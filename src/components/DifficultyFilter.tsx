import React from 'react';
import './DifficultyFilter.css';

interface Props {
  activeDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

const difficulties = [
  { key: 'all', label: '全部' },
  { key: 'easy', label: '基础', dot: '#4ade80' },
  { key: 'medium', label: '进阶', dot: '#fbbf24' },
  { key: 'hard', label: '深度', dot: '#f87171' },
];

const DifficultyFilter: React.FC<Props> = ({
  activeDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="difficulty-filter">
      <span className="diff-label">难度</span>
      <div className="diff-group">
        {difficulties.map((d) => (
          <button
            key={d.key}
            className={`diff-btn ${activeDifficulty === d.key ? 'active' : ''}`}
            onClick={() => onDifficultyChange(d.key)}
          >
            {d.dot && <span className="diff-dot" style={{ background: d.dot }} />}
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultyFilter;
