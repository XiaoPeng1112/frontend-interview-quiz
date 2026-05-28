import React, { useState, useRef, useCallback } from 'react';
import { Question } from '../data/questions';
import { StarFilled, StarOutlined, CheckCircleFilled, CheckCircleOutlined, ExclamationCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

  const rawAnswer = answerTab === 'oral' && hasOralAnswer
    ? question.oralAnswer || ''
    : question.answer;

  // 将纯文本中的连续空行压缩，避免 markdown 生成过多空段落
  const answerText = rawAnswer.replace(/\n{3,}/g, '\n\n');

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
          <span className="question-actions">
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
          <div className="answer-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const inline = !match && !String(children).includes('\n');
                  return !inline ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match ? match[1] : 'text'}
                      PreTag="div"
                      customStyle={{
                        margin: '8px 0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        padding: '12px',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {answerText}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
