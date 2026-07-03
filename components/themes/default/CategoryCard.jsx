import React from 'react';

const CategoryCard = ({ title, isActive, onClick, icon: Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        /* Fixed horizontal pill dimensions across all viewports */
        inline-flex items-center gap-2 px-4 py-2.5 rounded-full w-auto shrink-0
        text-sm font-medium tracking-tight whitespace-nowrap
        transition-all duration-200 ease-in-out cursor-pointer select-none outline-none snap-start
        ${
          isActive
            ? 'bg-neutral-900 text-white shadow-sm font-semibold'
            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
        }
      `}
    >
      {Icon && (
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-600'}`} />
      )}
      <span className="capitalize">
        {title}
      </span>
    </button>
  );
};
export default CategoryCard;