import React, { useState, useRef, useCallback } from 'react';
import { Question } from '../data/questions';
import { StarFilled, StarOutlined, CheckCircleFilled, CheckCircleOutlined, ExclamationCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import './QuestionCard.css';

interface Props {
  question: Question;
  stickyTop?: number;
  isFavorite?: boolean;
  mark?: string | null;
  onToggleFavorite?: (id: number) => void;
  onSetMark?: (id: number, mark: any) => void;
}

const difficultyMap = {
  easy: { label: '基础', className: 'difficulty-easy' },
  medium: { label: '进阶', className: 'difficulty-medium' },
  hard: { label: '深度', className: 'difficulty-hard' },
};

const QuestionCard: React.FC<Props> = ({ question, stickyTop = 0, isFavorite, mark, onToggleFavorite, onSetMark }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerTab, setAnswerTab] = useState<'key' | 'oral'>('key');
  const difficulty = difficultyMap[question.difficulty];
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCollapse = useCallback(() => {
    setShowAnswer(false);
    setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.top < stickyTop) {
          cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  }, [stickyTop]);

  const hasOralAnswer = !!question.oralAnswer;

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
          {showAnswer && (
            <button className="collapse-btn" onClick={handleCollapse}>
              收起 ▲
            </button>
          )}
        </div>
        <h3
          className="question-title"
          onClick={() => !showAnswer && setShowAnswer(true)}
        >
          <span className="question-title-text">{question.question}</span>
          <span className="question-actions" onClick={(e) => e.stopPropagation()}>
            <span
              className={`q-action-icon ${isFavorite ? 'favorite-active' : ''}`}
              onClick={() => onToggleFavorite?.(question.id)}
            >
              {isFavorite ? <StarFilled /> : <StarOutlined />}
            </span>
            <span
              className={`q-action-icon ${mark === 'mastered' ? 'mastered-active' : ''}`}
              onClick={() => onSetMark?.(question.id, mark === 'mastered' ? null : 'mastered')}
            >
              {mark === 'mastered' ? <CheckCircleFilled /> : <CheckCircleOutlined />}
            </span>
            <span
              className={`q-action-icon ${mark === 'weak' ? 'weak-active' : ''}`}
              onClick={() => onSetMark?.(question.id, mark === 'weak' ? null : 'weak')}
            >
              {mark === 'weak' ? <ExclamationCircleFilled /> : <ExclamationCircleOutlined />}
            </span>
          </span>
          {!showAnswer && <span className="expand-hint">查看 ▾</span>}
        </h3>
      </div>

      {showAnswer && (
        <div className="answer-content">
          {hasOralAnswer && (
            <div className="answer-tabs">
              <button
                className={`answer-tab ${answerTab === 'key' ? 'active' : ''}`}
                onClick={() => setAnswerTab('key')}
              >
                要点版
              </button>
              <button
                className={`answer-tab ${answerTab === 'oral' ? 'active' : ''}`}
                onClick={() => setAnswerTab('oral')}
              >
                口语版
              </button>
            </div>
          )}
          <pre>
            {answerTab === 'oral' && hasOralAnswer
              ? question.oralAnswer
              : question.answer}
          </pre>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
