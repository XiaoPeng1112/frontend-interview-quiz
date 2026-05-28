import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { questions } from '../data/questions';
import { StarFilled, CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import QuestionCard from './QuestionCard';
import Changelog from './Changelog';
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
  const [showChangelog, setShowChangelog] = useState(false);
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

  if (showChangelog) {
    return <Changelog onBack={() => setShowChangelog(false)} />;
  }

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
            <StarFilled style={{ color: '#fadb14', fontSize: 12 }} /> 收藏 <span className="fav-count">{counts.favorite}</span>
          </button>
          <button
            className={`fav-filter ${activeFilter === 'mastered' ? 'active' : ''}`}
            onClick={() => handleFilterChange('mastered')}
          >
            <CheckCircleFilled style={{ color: '#52c41a', fontSize: 12 }} /> 已掌握 <span className="fav-count">{counts.mastered}</span>
          </button>
          <button
            className={`fav-filter ${activeFilter === 'weak' ? 'active' : ''}`}
            onClick={() => handleFilterChange('weak')}
          >
            <ExclamationCircleFilled style={{ color: '#ff4d4f', fontSize: 12 }} /> 薄弱 <span className="fav-count">{counts.weak}</span>
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
              <QuestionCard
                key={q.id}
                question={q}
                stickyTop={stickyTop}
                isFavorite={favorites.has(q.id)}
                mark={marks[q.id] || null}
                onToggleFavorite={onToggleFavorite}
                onSetMark={onSetMark}
              />
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

      {/* 更新日志入口 */}
      <div className="changelog-entrance">
        <button className="changelog-entrance-btn" onClick={() => setShowChangelog(true)}>
          📋 更新日志
        </button>
      </div>
    </div>
  );
};

export default Favorites;
