import React, { useState } from 'react';
import './CategoryFilter.css';

interface Props {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const COLLAPSED_MAX_HEIGHT = 68; // 约两行按钮的高度

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
      </div>
      <button
        className="category-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '收起 ▲' : '展开全部 ▼'}
      </button>
    </div>
  );
};

export default CategoryFilter;
