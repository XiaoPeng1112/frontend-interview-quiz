import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { questions, categories, Question } from './data/questions';
import CategoryFilter from './components/CategoryFilter';
import DifficultyFilter from './components/DifficultyFilter';
import QuestionCard from './components/QuestionCard';
import BottomBar, { TabKey } from './components/BottomBar';
import MockInterview from './components/MockInterview';
import Favorites from './components/Favorites';
import SyncPanel from './components/SyncPanel';
import {
  GistConfig,
  SyncData,
  InterviewRecord,
  loadGistConfig,
  readGist,
  updateGist,
  mergeData,
} from './services/gistSync';
import './App.css';

type MarkType = 'favorite' | 'mastered' | 'weak';

// localStorage helpers
const STORAGE_KEY_FAV = 'interview-quiz-favorites';
const STORAGE_KEY_MARKS = 'interview-quiz-marks';
const STORAGE_KEY_HISTORY = 'interview-quiz-history';

function loadFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAV);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function loadMarks(): Record<number, MarkType> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MARKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadHistory(): InterviewRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('library');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [stickyTop, setStickyTop] = useState(0);
  const stickyFilterRef = useRef<HTMLDivElement>(null);

  // 核心数据状态
  const [favorites, setFavorites] = useState<Set<number>>(loadFavorites);
  const [marks, setMarks] = useState<Record<number, MarkType>>(loadMarks);
  const [interviewHistory, setInterviewHistory] = useState<InterviewRecord[]>(loadHistory);

  // 同步状态
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [gistConfig, setGistConfig] = useState<GistConfig | null>(loadGistConfig);

  // 持久化到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MARKS, JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(interviewHistory));
  }, [interviewHistory]);

  // 构建当前同步数据快照
  const buildSyncData = useCallback((): SyncData => ({
    favorites: Array.from(favorites),
    marks: Object.fromEntries(
      Object.entries(marks).map(([k, v]) => [k, v])
    ),
    interviewHistory,
    lastSyncAt: new Date().toISOString(),
  }), [favorites, marks, interviewHistory]);

  // 从 SyncData 恢复状态
  const applySyncData = useCallback((data: SyncData) => {
    setFavorites(new Set(data.favorites));
    const restoredMarks: Record<number, MarkType> = {};
    for (const [k, v] of Object.entries(data.marks)) {
      if (v === 'favorite' || v === 'mastered' || v === 'weak') {
        restoredMarks[Number(k)] = v as MarkType;
      }
    }
    setMarks(restoredMarks);
    setInterviewHistory(data.interviewHistory || []);
  }, []);

  // 同步操作
  const handleSync = useCallback(async () => {
    if (!gistConfig) return;

    setSyncStatus('syncing');
    try {
      const remoteData = await readGist(gistConfig.token, gistConfig.gistId);
      const localData = buildSyncData();

      if (remoteData) {
        // 合并
        const merged = mergeData(localData, remoteData);
        applySyncData(merged);
        await updateGist(gistConfig.token, gistConfig.gistId, merged);
        setLastSyncTime(merged.lastSyncAt);
      } else {
        // 远端为空，直接上传本地
        await updateGist(gistConfig.token, gistConfig.gistId, localData);
        setLastSyncTime(localData.lastSyncAt);
      }

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e) {
      console.error('Sync error:', e);
      setSyncStatus('error');
    }
  }, [gistConfig, buildSyncData, applySyncData]);

  // 首次加载时自动同步
  useEffect(() => {
    if (gistConfig) {
      handleSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSetMark = useCallback((id: number, mark: MarkType | null) => {
    setMarks(prev => {
      const next = { ...prev };
      if (mark === null) delete next[id];
      else next[id] = mark;
      return next;
    });
  }, []);

  const handleSaveRecord = useCallback((record: InterviewRecord) => {
    setInterviewHistory(prev => [record, ...prev]);
  }, []);

  const handleClearHistory = useCallback(() => {
    setInterviewHistory([]);
  }, []);

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

  const stats = useMemo(() => {
    const total = questions.length;
    const hard = questions.filter(q => q.difficulty === 'hard').length;
    const categoryCount = categories.length - 1;
    return { total, hard, categoryCount };
  }, []);

  const renderLibrary = () => (
    <>
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

      {/* 同步面板 */}
      <SyncPanel
        onConfigChange={setGistConfig}
        onSync={handleSync}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
        currentData={buildSyncData()}
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
          <div key={q.id} className="question-item-wrap">
            <div className="question-item-actions">
              <button
                className={`q-mark-btn ${favorites.has(q.id) ? 'active' : ''}`}
                onClick={() => handleToggleFavorite(q.id)}
              >
                {favorites.has(q.id) ? '⭐' : '☆'}
              </button>
              <button
                className={`q-mark-btn small ${marks[q.id] === 'mastered' ? 'mastered' : ''}`}
                onClick={() => handleSetMark(q.id, marks[q.id] === 'mastered' ? null : 'mastered')}
              >
                ✅
              </button>
              <button
                className={`q-mark-btn small ${marks[q.id] === 'weak' ? 'weak' : ''}`}
                onClick={() => handleSetMark(q.id, marks[q.id] === 'weak' ? null : 'weak')}
              >
                ❗
              </button>
            </div>
            <QuestionCard question={q} stickyTop={stickyTop} />
          </div>
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
    </>
  );

  return (
    <div className="app">
      {activeTab === 'library' && renderLibrary()}
      {activeTab === 'mock' && (
        <MockInterview
          interviewHistory={interviewHistory}
          onSaveRecord={handleSaveRecord}
          onClearHistory={handleClearHistory}
        />
      )}
      {activeTab === 'favorites' && (
        <Favorites
          favorites={favorites}
          marks={marks}
          onToggleFavorite={handleToggleFavorite}
          onSetMark={handleSetMark}
        />
      )}
      <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
