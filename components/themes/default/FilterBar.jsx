"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, Search, X, Check } from 'lucide-react';

export default function FilterBar({ 
  products = [], // 🎯 Receive raw items loaded by the page hook
  activeFilter, 
  setActiveFilter, 
  productCount, 
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

  // 🎯 GENERATE DYNAMIC SUB-CATEGORIES FROM LOADED PRODUCTS
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ['All'];

    // Grab all 'sub_category' fields, filter out blanks, and capitalize beautifully
    const rawSubCategories = products
      .map(p => p?.sub_category)
      .filter(sub => sub && typeof sub === 'string' && sub.trim() !== '');

    // Set constructor drops duplicate values instantly
    const uniqueSubs = Array.from(new Set(rawSubCategories));

    // Alphabetize so the layout always looks predictable and premium
    return ['All', ...uniqueSubs.sort((a, b) => a.localeCompare(b))];
  }, [products]);

  // Handle outside clicks to close the sort dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    if (searchInputRef.current) {
      const targetValue = searchInputRef.current.value.trim();
      setSearchQuery(targetValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleInputChange = () => {
    if (searchInputRef.current) {
      setHasText(searchInputRef.current.value.length > 0);
    }
  };

  const clearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      setHasText(false);
      setSearchQuery(""); 
    }
  };

  return (
    <div className="w-full bg-white border-b border-neutral-200/60 sticky top-0 z-40 backdrop-blur-md pt-8 pb-4">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[64px] flex flex-col gap-5">
        
        {/* Top Row: Search and Sorting controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          
          {/* Professional Low-Radius Search Box */}
          <div className="relative w-full sm:w-80 group">
            <input
              type="text"
              ref={searchInputRef}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="SEARCH PIECES..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-11 pr-10 py-3 text-xs font-bold tracking-wider uppercase text-neutral-900 focus:bg-white focus:border-neutral-900 outline-none transition-all duration-200"
            />
            
            <button 
              type="button"
              onClick={handleSearchSubmit}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
            >
              <Search size={15} />
            </button>
            
            {hasText && (
              <button 
                type="button"
                onClick={clearSearch} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Selection Counter Panel */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              {productCount} Items Listed
            </span>
            
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-neutral-200 bg-white text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors outline-none cursor-pointer"
              >
                <span className="text-neutral-400 font-medium">Sort by:</span>
                <span className="text-neutral-900">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden py-1 animate-fadeIn">
                  {sortOptions.map((option) => (
                    <button 
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                        sortBy === option.value 
                          ? 'bg-neutral-50 text-neutral-900' 
                          : 'text-neutral-500 hover:bg-neutral-50/60 hover:text-neutral-900'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && <Check size={14} className="text-neutral-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Pill Filters Track */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-colors shrink-0 outline-none cursor-pointer">
            <SlidersHorizontal size={14} className="text-neutral-600" />
            <span>Filters</span>
          </button>
          
          <div className="h-4 w-[1px] bg-neutral-200 mx-1 shrink-0" />

          {categories.map((category) => {
            const isActive = activeFilter === category;
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`inline-flex items-center px-4 py-2.5 rounded-lg w-auto shrink-0 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ease-in-out cursor-pointer select-none outline-none snap-start ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}