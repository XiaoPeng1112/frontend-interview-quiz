import React from 'react';
import './CategoryFilter.css';

interface Props {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<Props> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="category-filter">
      <div className="category-scroll">
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
    </div>
  );
};

export default CategoryFilter;
