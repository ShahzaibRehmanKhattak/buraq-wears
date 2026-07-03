"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, Search, X, Check } from 'lucide-react';

export default function FilterBar({ 
  products = [], 
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

    const rawSubCategories = products
      .map(p => p?.sub_category)
      .filter(sub => sub && typeof sub === 'string' && sub.trim() !== '');

    const uniqueSubs = Array.from(new Set(rawSubCategories));

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
    <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md pt-5 pb-3">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col gap-4">
        
        {/* Top Row: Search and Sorting controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          
          {/* Flat Minimalist Bordered Search Input */}
          <div className="relative w-full sm:w-72 group">
            <input
              type="text"
              ref={searchInputRef}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="SEARCH PIECES..."
              className="w-full bg-slate-50 border border-slate-200/70 rounded-lg pl-10 pr-9 py-2.5 text-[11px] font-bold tracking-wider uppercase text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#1b284f] outline-none transition-all duration-150"
            />
            
            <button 
              type="button"
              onClick={handleSearchSubmit}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1b284f] transition-colors"
            >
              <Search size={13} className="stroke-[2.5]" />
            </button>
            
            {hasText && (
              <button 
                type="button"
                onClick={clearSearch} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={13} className="stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Sort Selection Counter Panel */}
          <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              {productCount} Items
            </span>
            
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors outline-none cursor-pointer"
              >
                <span className="text-slate-400 font-medium">Sort by:</span>
                <span className="text-[#1b284f] font-bold">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.04)] z-50 overflow-hidden py-1">
                  {sortOptions.map((option) => (
                    <button 
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                        sortBy === option.value 
                          ? 'bg-slate-50 text-[#1b284f]' 
                          : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && <Check size={12} className="text-[#00b4d8] stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Ultra-Clean Pill Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1b284f] text-white text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 outline-none cursor-pointer">
            <SlidersHorizontal size={12} className="text-[#00b4d8] stroke-[2.5]" />
            <span>Filters</span>
          </button>
          
          <div className="h-3.5 w-[1px] bg-slate-200 mx-1.5 shrink-0" />

          {categories.map((category) => {
            const isActive = activeFilter === category;
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`inline-flex items-center px-3.5 py-2 rounded-lg w-auto shrink-0 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 ease-in-out cursor-pointer select-none outline-none snap-start border ${
                  isActive
                    ? 'bg-[#1b284f] text-white border-[#1b284f]'
                    : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100/80 hover:text-slate-800'
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