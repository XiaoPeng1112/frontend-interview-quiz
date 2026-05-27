import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { questions } from '../data/questions';
import QuestionCard from './QuestionCard';
import './Favorites.css';

type MarkType = 'favorite' | 'mastered' | 'weak';

interface Props {
  favorites: Set<number>;
  marks: Record<number, MarkType>;
  onToggleFavorite: (id: number) => void;
  onSetMark: (id: number, mark: MarkType | null) => void;
}

const PAGE_SIZE = 10;

const Favorites: React.FC<Props> = ({ favorites, marks, onToggleFavorite, onSetMark }) => {
  const [activeFilter, setActiveFilter] = useState<'favorite' | 'mastered' | 'weak' | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);

  const filteredQuestions = useMemo(() => {
    if (activeFilter === 'all') {
      return questions.filter(q => favorites.has(q.id) || marks[q.id]);
    }
    if (activeFilter === 'favorite') {
      return questions.filter(q => favorites.has(q.id));
    }
    return questions.filter(q => marks[q.id] === activeFilter);
  }, [activeFilter, favorites, marks]);

  // 切换筛选时重置分页
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter]);

  // 吸顶高度计算
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const updateHeight = () => setStickyTop(el.offsetHeight);
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 无限滚动：Intersection Observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredQuestions.length));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [filteredQuestions.length]);

  const visibleQuestions = useMemo(() => {
    return filteredQuestions.slice(0, visibleCount);
  }, [filteredQuestions, visibleCount]);

  const counts = useMemo(() => ({
    all: questions.filter(q => favorites.has(q.id) || marks[q.id]).length,
    favorite: favorites.size,
    mastered: Object.values(marks).filter(m => m === 'mastered').length,
    weak: Object.values(marks).filter(m => m === 'weak').length,
  }), [favorites, marks]);

  const handleFilterChange = useCallback((filter: 'favorite' | 'mastered' | 'weak' | 'all') => {
    setActiveFilter(filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const hasMore = visibleCount < filteredQuestions.length;

  return (
    <div className="favorites-page">
      <div className="favorites-sticky" ref={stickyRef}>
        <div className="favorites-header">
          <h2>收藏 · 标记</h2>
          <p className="favorites-desc">管理你的重点题目和掌握进度</p>
        </div>

        <div className="favorites-filters">
          <button
            className={`fav-filter ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            全部 <span className="fav-count">{counts.all}</span>
          </button>
          <button
            className={`fav-filter ${activeFilter === 'favorite' ? 'active' : ''}`}
            onClick={() => handleFilterChange('favorite')}
          >
            ⭐ 收藏 <span className="fav-count">{counts.favorite}</span>
          </button>
          <button
            className={`fav-filter ${activeFilter === 'mastered' ? 'active' : ''}`}
            onClick={() => handleFilterChange('mastered')}
          >
            ✅ 已掌握 <span className="fav-count">{counts.mastered}</span>
          </button>
          <button
            className={`fav-filter ${activeFilter === 'weak' ? 'active' : ''}`}
            onClick={() => handleFilterChange('weak')}
          >
            ❗ 薄弱 <span className="fav-count">{counts.weak}</span>
          </button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="favorites-empty">
          <div className="empty-icon">📋</div>
          <p>暂无{activeFilter === 'all' ? '标记' : activeFilter === 'favorite' ? '收藏' : activeFilter === 'mastered' ? '已掌握' : '薄弱'}的题目</p>
          <p className="empty-hint">在题库中浏览题目时，点击标记按钮来添加</p>
        </div>
      ) : (
        <>
          <div className="favorites-list">
            {visibleQuestions.map(q => (
              <div key={q.id} className="favorite-item">
                <div className="favorite-actions">
                  <button
                    className={`mark-btn ${favorites.has(q.id) ? 'active' : ''}`}
                    onClick={() => onToggleFavorite(q.id)}
                    title="收藏"
                  >
                    {favorites.has(q.id) ? '⭐' : '☆'}
                  </button>
                  <button
                    className={`mark-btn ${marks[q.id] === 'mastered' ? 'active mastered' : ''}`}
                    onClick={() => onSetMark(q.id, marks[q.id] === 'mastered' ? null : 'mastered')}
                    title="已掌握"
                  >
                    ✅
                  </button>
                  <button
                    className={`mark-btn ${marks[q.id] === 'weak' ? 'active weak' : ''}`}
                    onClick={() => onSetMark(q.id, marks[q.id] === 'weak' ? null : 'weak')}
                    title="薄弱"
                  >
                    ❗
                  </button>
                </div>
                <QuestionCard question={q} stickyTop={stickyTop} />
              </div>
            ))}
          </div>

          {/* 加载更多触发器 */}
          <div ref={loaderRef} className="favorites-loader">
            {hasMore ? (
              <span className="loader-text">加载更多...</span>
            ) : (
              <span className="loader-text end">已展示全部 {filteredQuestions.length} 道题目</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
