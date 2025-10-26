import React from 'react';

const CategoryNav: React.FC = () => {
  const categories = ['Movies', 'TV shows', 'Sports', 'Live TV', 'New Releases', 'Trending'];

  return (
    <nav className="px-4">
      <div className="flex space-x-3 overflow-x-auto no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-1.5 bg-[var(--card-bg)] text-[var(--text-color)] rounded-full text-sm font-semibold whitespace-nowrap"
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;