import React, { useState, useCallback, useMemo } from 'react';
import { questions, categories } from '../data/questions';
import type { Question } from '../data/questions';
import QuestionCard from './QuestionCard';
import './MockInterview.css';

const MockInterview: React.FC = () => {
  const [mode, setMode] = useState<'idle' | 'interviewing' | 'finished'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawnQuestions, setDrawnQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [questionCount, setQuestionCount] = useState(10);

  const availableCategories = useMemo(() => categories, []);

  const startInterview = useCallback(() => {
    const pool = selectedCategory === '全部'
      ? questions
      : questions.filter(q => q.category === selectedCategory);

    if (pool.length === 0) return;

    const count = Math.min(questionCount, pool.length);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setDrawnQuestions(shuffled.slice(0, count));
    setCurrentIndex(0);
    setMode('interviewing');
  }, [selectedCategory, questionCount]);

  const handleNext = useCallback(() => {
    if (currentIndex < drawnQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setMode('finished');
    }
  }, [currentIndex, drawnQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setMode('idle');
    setDrawnQuestions([]);
    setCurrentIndex(0);
  }, []);

  if (mode === 'idle') {
    return (
      <div className="mock-interview">
        <div className="mock-header">
          <h2>随机抽题 · 模拟面试</h2>
          <p className="mock-desc">从题库随机抽取题目，模拟真实面试流程</p>
        </div>

        <div className="mock-settings">
          <div className="setting-item">
            <label className="setting-label">选择范围</label>
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
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  className={`setting-option ${questionCount === n ? 'active' : ''}`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n} 题
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="mock-start-btn" onClick={startInterview}>
          开始模拟面试
        </button>
      </div>
    );
  }

  if (mode === 'finished') {
    return (
      <div className="mock-interview">
        <div className="mock-finish">
          <div className="finish-icon">🎉</div>
          <h2>面试结束</h2>
          <p className="finish-stats">
            本轮共 <strong>{drawnQuestions.length}</strong> 题
          </p>
          <button className="mock-start-btn" onClick={handleReset}>
            再来一轮
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = drawnQuestions[currentIndex];

  return (
    <div className="mock-interview">
      <div className="mock-progress">
        <div className="progress-text">
          第 <strong>{currentIndex + 1}</strong> / {drawnQuestions.length} 题
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / drawnQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mock-question-area">
        <QuestionCard question={currentQuestion} stickyTop={0} />
      </div>

      <div className="mock-nav">
        <button
          className="mock-nav-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← 上一题
        </button>
        <button className="mock-nav-btn primary" onClick={handleNext}>
          {currentIndex === drawnQuestions.length - 1 ? '完成' : '下一题 →'}
        </button>
      </div>
    </div>
  );
};

export default MockInterview;
