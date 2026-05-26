import React from 'react';
import './DifficultyFilter.css';

interface Props {
  activeDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

const difficulties = [
  { key: 'all', label: '全部难度' },
  { key: 'easy', label: '简单' },
  { key: 'medium', label: '中等' },
  { key: 'hard', label: '困难' },
];

const DifficultyFilter: React.FC<Props> = ({
  activeDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="difficulty-filter">
      {difficulties.map((d) => (
        <button
          key={d.key}
          className={`diff-btn ${activeDifficulty === d.key ? 'active' : ''}`}
          onClick={() => onDifficultyChange(d.key)}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
};

export default DifficultyFilter;
