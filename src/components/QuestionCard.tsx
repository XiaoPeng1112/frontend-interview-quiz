import React, { useState } from 'react';
import { Question } from '../data/questions';
import './QuestionCard.css';

interface Props {
  question: Question;
}

const difficultyMap = {
  easy: { label: '基础', className: 'difficulty-easy' },
  medium: { label: '进阶', className: 'difficulty-medium' },
  hard: { label: '深度', className: 'difficulty-hard' },
};

const QuestionCard: React.FC<Props> = ({ question }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const difficulty = difficultyMap[question.difficulty];

  return (
    <div className={`question-card ${showAnswer ? 'expanded' : ''}`}>
      <div className="question-header">
        <span className={`difficulty-tag ${difficulty.className}`}>
          {difficulty.label}
        </span>
        <span className="category-tag">{question.category}</span>
      </div>
      <h3 className="question-title">{question.question}</h3>
      <button
        className={`toggle-answer-btn ${showAnswer ? 'active' : ''}`}
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {showAnswer ? '收起答案' : '展开答案'}
        <span className="arrow">▼</span>
      </button>
      {showAnswer && (
        <div className="answer-content">
          <pre>{question.answer}</pre>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
