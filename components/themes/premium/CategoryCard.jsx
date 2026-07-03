'use client';

import React from 'react';

export default function CategoryCard({ title, icon: Icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2.5 px-5 h-11 rounded-lg text-[13px] font-medium tracking-wide border transition-all duration-200 shrink-0 snap-start select-none outline-none active:scale-[0.98] ${
        isActive
          ? 'bg-[#1b284f] border-[#1b284f] text-white font-bold shadow-sm shadow-[#1b284f]/10'
          : 'bg-white border-neutral-200/70 text-[#1b284f] hover:text-[#4f46e5] hover:border-[#4f46e5]/30'
      }`}
    >
      {Icon && (
        <Icon 
          size={16} 
          strokeWidth={isActive ? 2.2 : 1.8} 
          className={`transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-[#1b284f]/60 group-hover:text-[#4f46e5]'
          }`} 
        />
      )}
      <span>{title}</span>

      {/* Premium indicator underline trace matching the 'Demo' cyan badge accent */}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#00b4d8] rounded-full" />
      )}
    </button>
  );
}