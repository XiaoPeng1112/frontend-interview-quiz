import React, { useState, useRef, useCallback } from 'react';
import { Question } from '../data/questions';
import './QuestionCard.css';

interface Props {
  question: Question;
  stickyTop?: number;
}

const difficultyMap = {
  easy: { label: '基础', className: 'difficulty-easy' },
  medium: { label: '进阶', className: 'difficulty-medium' },
  hard: { label: '深度', className: 'difficulty-hard' },
};

const QuestionCard: React.FC<Props> = ({ question, stickyTop = 0 }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const difficulty = difficultyMap[question.difficulty];
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCollapse = useCallback(() => {
    setShowAnswer(false);
    // Scroll the card back into comfortable view after collapsing
    setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.top < stickyTop) {
          cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  }, [stickyTop]);

  return (
    <div className={`question-card ${showAnswer ? 'expanded' : ''}`} ref={cardRef}>
      <div
        className={`question-sticky-header ${showAnswer ? 'is-sticky' : ''}`}
        style={showAnswer ? { top: `${stickyTop}px` } : undefined}
      >
        <div className="question-header">
          <span className={`difficulty-tag ${difficulty.className}`}>
            {difficulty.label}
          </span>
          <span className="category-tag">{question.category}</span>
        </div>
        <h3 className="question-title">{question.question}</h3>
        {showAnswer && (
          <button
            className="toggle-answer-btn active"
            onClick={handleCollapse}
          >
            收起答案
            <span className="arrow">▼</span>
          </button>
        )}
      </div>

      {!showAnswer && (
        <button
          className="toggle-answer-btn"
          onClick={() => setShowAnswer(true)}
        >
          展开答案
          <span className="arrow">▼</span>
        </button>
      )}

      {showAnswer && (
        <div className="answer-content">
          <pre>{question.answer}</pre>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
