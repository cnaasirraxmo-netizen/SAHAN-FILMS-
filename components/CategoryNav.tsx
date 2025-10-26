import React from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <nav className="px-4">
      <div className="flex space-x-3 overflow-x-auto no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
              activeCategory === category
                ? 'bg-white text-black'
                : 'bg-[var(--card-bg)] text-[var(--text-color)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
