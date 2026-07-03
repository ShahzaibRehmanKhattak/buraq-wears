"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export default function FilterBar({ 
  sortBy, 
  setSortBy,
  setSearchQuery 
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [hasText, setHasText] = useState(false);
  const searchInputRef = useRef(null);
  const sortRef = useRef(null);

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'low-high' },
    { label: 'Price: High to Low', value: 'high-low' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel = useMemo(() => {
    const found = sortOptions.find(o => o.value === sortBy);
    return found ? found.label : 'Sort By';
  }, [sortBy]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setHasText(text.length > 0);
    setSearchQuery(text);
  };

  const handleClearInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setHasText(false);
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-col gap-4 font-poppins select-none antialiased">
      
      {/* Search Input Block */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <Search size={16} strokeWidth={2} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search products..."
          onChange={handleInputChange}
          className="w-full h-10 pl-10 pr-9 bg-white border border-neutral-200/60 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B51E3] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
        {hasText && (
          <button
            onClick={handleClearInput}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors outline-none cursor-pointer"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Sort Select Dropdown Menu Frame */}
      <div ref={sortRef} className="relative w-full">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className={`w-full h-10 px-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all duration-200 outline-none cursor-pointer ${
            isSortOpen 
              ? 'border-[#3B51E3] bg-white text-[#3B51E3] shadow-sm' 
              : 'border-neutral-200/50 bg-[#F6F7FB] text-slate-700 hover:bg-neutral-50'
          }`}
        >
          <span>{currentSortLabel}</span>
          <ChevronDown 
            size={14} 
            className={`transition-transform duration-200 stroke-[2.5] ${isSortOpen ? 'rotate-180 text-[#3B51E3]' : 'text-slate-400'}`} 
          />
        </button>

        {isSortOpen && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-neutral-100 rounded-xl shadow-[0_10px_25px_rgba(27,40,79,0.08)] py-1.5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors outline-none cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-50 text-[#3B51E3] font-bold' 
                      : 'text-slate-600 hover:bg-slate-50/60'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={12} className="text-[#3B51E3] stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}