import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { questions, categories } from '../data/questions';
import type { Question } from '../data/questions';
import QuestionCard from './QuestionCard';
import './MockInterview.css';

type SelfScore = 0 | 1 | 2 | 3; // 0=未评 1=不会 2=部分 3=掌握

const MockInterview: React.FC = () => {
  const [mode, setMode] = useState<'idle' | 'interviewing' | 'finished'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawnQuestions, setDrawnQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [questionCount, setQuestionCount] = useState(10);
  const [scores, setScores] = useState<SelfScore[]>([]);
  const [elapsed, setElapsed] = useState(0); // 总用时(秒)
  const [questionTimes, setQuestionTimes] = useState<number[]>([]); // 每题用时
  const [slideDir, setSlideDir] = useState<'left' | 'right' | ''>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef(0);

  const availableCategories = useMemo(() => categories, []);

  // 计时器
  useEffect(() => {
    if (mode === 'interviewing') {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startInterview = useCallback(() => {
    const pool = selectedCategory === '全部'
      ? questions
      : questions.filter(q => q.category === selectedCategory);

    if (pool.length === 0) return;

    const count = Math.min(questionCount, pool.length);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count);
    setDrawnQuestions(drawn);
    setScores(new Array(count).fill(0));
    setQuestionTimes(new Array(count).fill(0));
    setCurrentIndex(0);
    setElapsed(0);
    setSlideDir('');
    questionStartRef.current = Date.now();
    setMode('interviewing');
  }, [selectedCategory, questionCount]);

  const recordQuestionTime = useCallback((index: number) => {
    const now = Date.now();
    const spent = Math.round((now - questionStartRef.current) / 1000);
    setQuestionTimes(prev => {
      const next = [...prev];
      next[index] = (next[index] || 0) + spent;
      return next;
    });
    questionStartRef.current = now;
  }, []);

  const goToQuestion = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    recordQuestionTime(currentIndex);
    setSlideDir(targetIndex > currentIndex ? 'left' : 'right');
    setTimeout(() => {
      setCurrentIndex(targetIndex);
      setSlideDir('');
    }, 150);
  }, [currentIndex, recordQuestionTime]);

  const handleNext = useCallback(() => {
    if (currentIndex < drawnQuestions.length - 1) {
      goToQuestion(currentIndex + 1);
    } else {
      recordQuestionTime(currentIndex);
      if (timerRef.current) clearInterval(timerRef.current);
      setMode('finished');
    }
  }, [currentIndex, drawnQuestions.length, goToQuestion, recordQuestionTime]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  }, [currentIndex, goToQuestion]);

  const handleScore = useCallback((score: SelfScore) => {
    setScores(prev => {
      const next = [...prev];
      next[currentIndex] = score;
      return next;
    });
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setMode('idle');
    setDrawnQuestions([]);
    setCurrentIndex(0);
    setScores([]);
    setQuestionTimes([]);
    setElapsed(0);
  }, []);

  // idle 模式：设置页
  if (mode === 'idle') {
    const poolSize = selectedCategory === '全部'
      ? questions.length
      : questions.filter(q => q.category === selectedCategory).length;

    return (
      <div className="mock-interview">
        <div className="mock-header">
          <div className="mock-header-icon">🎯</div>
          <h2>模拟面试</h2>
          <p className="mock-desc">随机抽题，模拟真实面试节奏</p>
        </div>

        <div className="mock-settings">
          <div className="setting-item">
            <label className="setting-label">
              选择范围
              <span className="setting-hint">（共 {poolSize} 题可选）</span>
            </label>
            <div className="setting-options category-options">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  className={`setting-option ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">题目数量</label>
            <div className="setting-options">
              {[5, 10, 15, 20, 30].map(n => (
                <button
                  key={n}
                  className={`setting-option ${questionCount === n ? 'active' : ''}`}
                  onClick={() => setQuestionCount(n)}
                  disabled={n > poolSize}
                >
                  {n} 题
                </button>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">模拟面试流程</label>
            <div className="mock-flow">
              <div className="flow-step">
                <span className="flow-num">1</span>
                <span className="flow-text">看题思考</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-num">2</span>
                <span className="flow-text">展开答案</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-num">3</span>
                <span className="flow-text">自评打分</span>
              </div>
            </div>
          </div>
        </div>

        <button className="mock-start-btn" onClick={startInterview}>
          开始面试（{Math.min(questionCount, poolSize)} 题）
        </button>
      </div>
    );
  }

  // finished 模式：结果页
  if (mode === 'finished') {
    const scored = scores.filter(s => s > 0);
    const masteredCount = scores.filter(s => s === 3).length;
    const partialCount = scores.filter(s => s === 2).length;
    const failedCount = scores.filter(s => s === 1).length;
    const unanswered = scores.filter(s => s === 0).length;
    const avgScore = scored.length > 0
      ? (scored.reduce((a: number, b: number) => a + b, 0) / scored.length).toFixed(1)
      : '--';
    const totalTime = elapsed;
    const avgTime = drawnQuestions.length > 0
      ? Math.round(totalTime / drawnQuestions.length)
      : 0;

    return (
      <div className="mock-interview">
        <div className="mock-finish">
          <div className="finish-icon">📊</div>
          <h2>面试报告</h2>

          <div className="finish-summary">
            <div className="summary-card">
              <span className="summary-value">{drawnQuestions.length}</span>
              <span className="summary-label">总题数</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{formatTime(totalTime)}</span>
              <span className="summary-label">总用时</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{avgScore}</span>
              <span className="summary-label">平均分</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{avgTime}s</span>
              <span className="summary-label">平均用时</span>
            </div>
          </div>

          <div className="finish-breakdown">
            <div className="breakdown-row mastered">
              <span className="breakdown-icon">✅</span>
              <span className="breakdown-label">掌握</span>
              <span className="breakdown-bar">
                <span style={{ width: `${(masteredCount / drawnQuestions.length) * 100}%` }} />
              </span>
              <span className="breakdown-count">{masteredCount}</span>
            </div>
            <div className="breakdown-row partial">
              <span className="breakdown-icon">🟡</span>
              <span className="breakdown-label">部分</span>
              <span className="breakdown-bar">
                <span style={{ width: `${(partialCount / drawnQuestions.length) * 100}%` }} />
              </span>
              <span className="breakdown-count">{partialCount}</span>
            </div>
            <div className="breakdown-row failed">
              <span className="breakdown-icon">❌</span>
              <span className="breakdown-label">不会</span>
              <span className="breakdown-bar">
                <span style={{ width: `${(failedCount / drawnQuestions.length) * 100}%` }} />
              </span>
              <span className="breakdown-count">{failedCount}</span>
            </div>
            {unanswered > 0 && (
              <div className="breakdown-row skipped">
                <span className="breakdown-icon">⏭️</span>
                <span className="breakdown-label">未评</span>
                <span className="breakdown-bar">
                  <span style={{ width: `${(unanswered / drawnQuestions.length) * 100}%` }} />
                </span>
                <span className="breakdown-count">{unanswered}</span>
              </div>
            )}
          </div>

          {/* 薄弱题目列表 */}
          {failedCount > 0 && (
            <div className="finish-weak-list">
              <h3>需要加强的题目</h3>
              {drawnQuestions
                .filter((_, i) => scores[i] === 1)
                .map(q => (
                  <div key={q.id} className="weak-item">
                    <span className="weak-category">{q.category}</span>
                    <span className="weak-question">{q.question}</span>
                  </div>
                ))}
            </div>
          )}

          <div className="finish-actions">
            <button className="mock-start-btn" onClick={handleReset}>
              再来一轮
            </button>
          </div>
        </div>
      </div>
    );
  }

  // interviewing 模式
  const currentQuestion = drawnQuestions[currentIndex];
  const currentScore = scores[currentIndex];

  return (
    <div className="mock-interview">
      {/* 顶部状态栏 */}
      <div className="mock-topbar">
        <button className="mock-quit-btn" onClick={() => {
          recordQuestionTime(currentIndex);
          if (timerRef.current) clearInterval(timerRef.current);
          setMode('finished');
        }}>
          结束
        </button>
        <div className="mock-timer">
          <span className="timer-icon">⏱</span>
          {formatTime(elapsed)}
        </div>
        <div className="mock-counter">
          {currentIndex + 1}/{drawnQuestions.length}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mock-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / drawnQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 题目导航圆点 */}
      <div className="mock-dots">
        {drawnQuestions.map((_, i) => (
          <button
            key={i}
            className={`mock-dot ${i === currentIndex ? 'current' : ''} ${scores[i] === 3 ? 'mastered' : scores[i] === 2 ? 'partial' : scores[i] === 1 ? 'failed' : ''}`}
            onClick={() => goToQuestion(i)}
          />
        ))}
      </div>

      {/* 题目卡片 */}
      <div className={`mock-question-area ${slideDir ? `slide-out-${slideDir}` : 'slide-in'}`}>
        <QuestionCard question={currentQuestion} stickyTop={0} />
      </div>

      {/* 自评打分 */}
      <div className="mock-scoring">
        <span className="scoring-label">自评：</span>
        <div className="scoring-btns">
          <button
            className={`score-btn failed ${currentScore === 1 ? 'active' : ''}`}
            onClick={() => handleScore(1)}
          >
            ❌ 不会
          </button>
          <button
            className={`score-btn partial ${currentScore === 2 ? 'active' : ''}`}
            onClick={() => handleScore(2)}
          >
            🟡 部分
          </button>
          <button
            className={`score-btn mastered ${currentScore === 3 ? 'active' : ''}`}
            onClick={() => handleScore(3)}
          >
            ✅ 掌握
          </button>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="mock-nav">
        <button
          className="mock-nav-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← 上一题
        </button>
        <button className="mock-nav-btn primary" onClick={handleNext}>
          {currentIndex === drawnQuestions.length - 1 ? '完成面试' : '下一题 →'}
        </button>
      </div>
    </div>
  );
};

export default MockInterview;
