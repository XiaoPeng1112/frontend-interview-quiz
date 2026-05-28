import React, { useState } from 'react';
import './CategoryFilter.css';

interface Props {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const COLLAPSED_MAX_HEIGHT = 58; // 约两行按钮的高度

const CategoryFilter: React.FC<Props> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="category-filter">
      <div
        className={`category-grid ${expanded ? 'expanded' : 'collapsed'}`}
        style={!expanded ? { maxHeight: `${COLLAPSED_MAX_HEIGHT}px` } : undefined}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
        <button
          className="category-btn category-toggle-inline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '收起 ▲' : '更多 ▼'}
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;
