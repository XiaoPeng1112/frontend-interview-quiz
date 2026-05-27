import React, { useState, useMemo, useRef, useEffect } from 'react';
import { questions, categories, Question } from './data/questions';
import CategoryFilter from './components/CategoryFilter';
import DifficultyFilter from './components/DifficultyFilter';
import QuestionCard from './components/QuestionCard';
import './App.css';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [stickyTop, setStickyTop] = useState(0);
  const stickyFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stickyFilterRef.current;
    if (!el) return;

    const updateHeight = () => {
      setStickyTop(el.offsetHeight);
    };
    updateHeight();

    // 使用 ResizeObserver 监听筛选区域高度变化（展开/收起分类时）
    const ro = new ResizeObserver(() => {
      setStickyTop(el.offsetHeight);
    });
    ro.observe(el);

    window.addEventListener('resize', updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q: Question) => {
      const categoryMatch =
        activeCategory === '全部' || q.category === activeCategory;
      const difficultyMatch =
        activeDifficulty === 'all' || q.difficulty === activeDifficulty;
      const searchMatch =
        !searchText ||
        q.question.toLowerCase().includes(searchText.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchText.toLowerCase());
      return categoryMatch && difficultyMatch && searchMatch;
    });
  }, [activeCategory, activeDifficulty, searchText]);

  const stats = useMemo(() => {
    const total = questions.length;
    const hard = questions.filter(q => q.difficulty === 'hard').length;
    const categoryCount = categories.length - 1;
    return { total, hard, categoryCount };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Frontend Interview</h1>
        <p className="subtitle">RN 架构 · AI Native · 系统设计</p>
      </header>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">题目总数</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.categoryCount}</span>
          <span className="stat-label">知识领域</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.hard}</span>
          <span className="stat-label">高难度题</span>
        </div>
      </div>

      {/* Sticky filter area */}
      <div className="sticky-filter" ref={stickyFilterRef}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜索题目关键词..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          {searchText && (
            <button
              className="search-clear"
              onClick={() => setSearchText('')}
            >
              ✕
            </button>
          )}
        </div>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <DifficultyFilter
          activeDifficulty={activeDifficulty}
          onDifficultyChange={setActiveDifficulty}
        />

        <div className="question-count">
          <span>共 <strong>{filteredQuestions.length}</strong> 道题目</span>
          {activeCategory !== '全部' && (
            <span className="active-filter-tag">
              {activeCategory}
              <button onClick={() => setActiveCategory('全部')}>✕</button>
            </span>
          )}
        </div>
      </div>

      <div className="question-list">
        {filteredQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} stickyTop={stickyTop} />
        ))}
        {filteredQuestions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>没有找到匹配的题目</p>
            <p className="empty-hint">试试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p className="footer-line">持续更新 · 助力面试</p>
        <p>Built for Senior RN Developer</p>
      </footer>
    </div>
  );
};

export default App;
