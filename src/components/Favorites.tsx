import React, { useState, useMemo } from 'react';
import { questions, Question } from '../data/questions';
import QuestionCard from './QuestionCard';
import './Favorites.css';

type MarkType = 'favorite' | 'mastered' | 'weak';

interface Props {
  favorites: Set<number>;
  marks: Record<number, MarkType>;
  onToggleFavorite: (id: number) => void;
  onSetMark: (id: number, mark: MarkType | null) => void;
}

const Favorites: React.FC<Props> = ({ favorites, marks, onToggleFavorite, onSetMark }) => {
  const [activeFilter, setActiveFilter] = useState<'favorite' | 'mastered' | 'weak' | 'all'>('all');

  const filteredQuestions = useMemo(() => {
    if (activeFilter === 'all') {
      // 展示所有有标记或收藏的题目
      return questions.filter(q => favorites.has(q.id) || marks[q.id]);
    }
    if (activeFilter === 'favorite') {
      return questions.filter(q => favorites.has(q.id));
    }
    return questions.filter(q => marks[q.id] === activeFilter);
  }, [activeFilter, favorites, marks]);

  const counts = useMemo(() => ({
    all: questions.filter(q => favorites.has(q.id) || marks[q.id]).length,
    favorite: favorites.size,
    mastered: Object.values(marks).filter(m => m === 'mastered').length,
    weak: Object.values(marks).filter(m => m === 'weak').length,
  }), [favorites, marks]);

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>收藏 · 标记</h2>
        <p className="favorites-desc">管理你的重点题目和掌握进度</p>
      </div>

      <div className="favorites-filters">
        <button
          className={`fav-filter ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          全部 <span className="fav-count">{counts.all}</span>
        </button>
        <button
          className={`fav-filter ${activeFilter === 'favorite' ? 'active' : ''}`}
          onClick={() => setActiveFilter('favorite')}
        >
          ⭐ 收藏 <span className="fav-count">{counts.favorite}</span>
        </button>
        <button
          className={`fav-filter ${activeFilter === 'mastered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('mastered')}
        >
          ✅ 已掌握 <span className="fav-count">{counts.mastered}</span>
        </button>
        <button
          className={`fav-filter ${activeFilter === 'weak' ? 'active' : ''}`}
          onClick={() => setActiveFilter('weak')}
        >
          ❗ 薄弱 <span className="fav-count">{counts.weak}</span>
        </button>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="favorites-empty">
          <div className="empty-icon">📋</div>
          <p>暂无{activeFilter === 'all' ? '标记' : activeFilter === 'favorite' ? '收藏' : activeFilter === 'mastered' ? '已掌握' : '薄弱'}的题目</p>
          <p className="empty-hint">在题库中浏览题目时，点击标记按钮来添加</p>
        </div>
      ) : (
        <div className="favorites-list">
          {filteredQuestions.map(q => (
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
              <QuestionCard question={q} stickyTop={0} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
