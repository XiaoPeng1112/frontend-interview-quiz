import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { questions, categories } from './data/questions';
import type { Question } from './data/questions';
import CategoryFilter from './components/CategoryFilter';
import DifficultyFilter from './components/DifficultyFilter';
import QuestionCard from './components/QuestionCard';
import BottomBar, { TabKey } from './components/BottomBar';
import MockInterview from './components/MockInterview';
import ReviewAnalysis from './components/ReviewAnalysis';
import Favorites from './components/Favorites';
import SyncPanel from './components/SyncPanel';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { useInterviewHistory } from './hooks/useInterviewHistory';
import { useSync } from './hooks/useSync';
import { useTheme } from './hooks/useTheme';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('library');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [stickyTop, setStickyTop] = useState(0);
  const stickyFilterRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 随机刷题
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);

  // Tab 首次激活后保活
  const [mountedTabs, setMountedTabs] = useState<Set<TabKey>>(new Set(['library' as TabKey]));

  // 主题
  const { theme, toggleTheme } = useTheme();

  // 自定义 hooks
  const { auth, handleLogout: authLogout } = useAuth();
  const { favorites, setFavorites, marks, setMarks, handleToggleFavorite, handleSetMark } = useFavorites();
  const { interviewHistory, setInterviewHistory, handleSaveRecord, handleClearHistory } = useInterviewHistory();

  const { syncStatus, lastSyncTime, handleSync, handleLogout } = useSync({
    auth,
    favorites,
    marks,
    interviewHistory,
    setFavorites,
    setMarks,
    setInterviewHistory,
    onLogout: authLogout,
  });

  // Tab 切换时标记已挂载
  useEffect(() => {
    setMountedTabs(prev => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  // 吸顶高度计算
  useEffect(() => {
    const el = stickyFilterRef.current;
    if (!el) return;

    const updateHeight = () => {
      setStickyTop(el.offsetHeight);
    };
    updateHeight();

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

  // 筛选条件变化时重置分页
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, activeDifficulty, searchText]);

  // 无限滚动加载更多
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

  const stats = useMemo(() => {
    const total = questions.length;
    const hard = questions.filter(q => q.difficulty === 'hard').length;
    const categoryCount = categories.length - 1;
    return { total, hard, categoryCount };
  }, []);

  // 随机一题
  const handleRandomQuestion = useCallback(() => {
    const pool = filteredQuestions.length > 0 ? filteredQuestions : questions;
    const idx = Math.floor(Math.random() * pool.length);
    setRandomQuestion(pool[idx]);
  }, [filteredQuestions]);

  const closeRandomQuestion = useCallback(() => {
    setRandomQuestion(null);
  }, []);

  const renderLibrary = () => (
    <>
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? '切换浅色模式' : '切换深色模式'}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
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

      {/* 同步面板 */}
      <SyncPanel
        auth={auth}
        onLogout={handleLogout}
        onSync={handleSync}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
      />

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

        <div className="filter-bottom-row">
          <DifficultyFilter
            activeDifficulty={activeDifficulty}
            onDifficultyChange={setActiveDifficulty}
          />
          <button className="random-quiz-btn" onClick={handleRandomQuestion}>
            🎲 随机一题
          </button>
          <div className="question-count">
            <span>共 <strong>{filteredQuestions.length}</strong> 题</span>
            {activeCategory !== '全部' && (
              <span className="active-filter-tag">
                {activeCategory}
                <button onClick={() => setActiveCategory('全部')}>✕</button>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="question-list">
        {visibleQuestions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            stickyTop={stickyTop}
            isFavorite={favorites.has(q.id)}
            mark={marks[q.id] || null}
            onToggleFavorite={handleToggleFavorite}
            onSetMark={handleSetMark}
          />
        ))}
        {filteredQuestions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>没有找到匹配的题目</p>
            <p className="empty-hint">试试调整筛选条件或搜索关键词</p>
          </div>
        )}
        {/* 加载更多触发器 */}
        <div ref={loaderRef} className="list-loader">
          {visibleCount < filteredQuestions.length && (
            <span className="loader-text">加载更多...</span>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p className="footer-line">持续更新 · 助力面试</p>
        <p>Built for Senior RN Developer</p>
      </footer>
    </>
  );

  // Tab 切换或筛选条件变化时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, activeCategory, activeDifficulty]);

  return (
    <div className="app">
      {/* 随机一题弹窗 */}
      {randomQuestion && (
        <div className="random-modal-overlay" onClick={closeRandomQuestion}>
          <div className="random-modal" onClick={e => e.stopPropagation()}>
            <div className="random-modal-header">
              <span>🎲 随机一题</span>
              <button className="random-modal-close" onClick={closeRandomQuestion}>✕</button>
            </div>
            <div className="random-modal-body">
              <QuestionCard
                question={randomQuestion}
                stickyTop={0}
                isFavorite={favorites.has(randomQuestion.id)}
                mark={marks[randomQuestion.id] || null}
                onToggleFavorite={handleToggleFavorite}
                onSetMark={handleSetMark}
              />
            </div>
            <div className="random-modal-footer">
              <button className="random-next-btn" onClick={handleRandomQuestion}>
                下一题 →
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: activeTab === 'library' ? 'block' : 'none' }}>
        {renderLibrary()}
      </div>
      {mountedTabs.has('mock') && (
        <div style={{ display: activeTab === 'mock' ? 'block' : 'none' }}>
          <MockInterview
            interviewHistory={interviewHistory}
            onSaveRecord={handleSaveRecord}
            onClearHistory={handleClearHistory}
          />
        </div>
      )}
      {mountedTabs.has('review') && (
        <div style={{ display: activeTab === 'review' ? 'block' : 'none' }}>
          <ReviewAnalysis />
        </div>
      )}
      {mountedTabs.has('favorites') && (
        <div style={{ display: activeTab === 'favorites' ? 'block' : 'none' }}>
          <Favorites
            favorites={favorites}
            marks={marks}
            onToggleFavorite={handleToggleFavorite}
            onSetMark={handleSetMark}
          />
        </div>
      )}
      <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
