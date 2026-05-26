import React, { useState, useMemo } from 'react';
import { questions, categories, Question } from './data/questions';
import CategoryFilter from './components/CategoryFilter';
import DifficultyFilter from './components/DifficultyFilter';
import QuestionCard from './components/QuestionCard';
import './App.css';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [searchText, setSearchText] = useState('');

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>前端面试题库</h1>
        <p className="subtitle">助力前端开发者高效备战面试</p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索题目..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
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
        共 <strong>{filteredQuestions.length}</strong> 道题目
      </div>

      <div className="question-list">
        {filteredQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
        {filteredQuestions.length === 0 && (
          <div className="empty-state">
            <p>没有找到匹配的题目</p>
            <p className="empty-hint">试试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>持续更新中 · 祝你面试顺利 🎉</p>
      </footer>
    </div>
  );
};

export default App;
