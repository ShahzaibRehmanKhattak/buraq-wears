'use client';

import React, { useState, useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CuratedCategories({ 
  products = [], 
  activeCategory, 
  onCategorySelect,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  priceRange,
  setPriceRange
}) {
  const { categories, loading, error } = useCategories();

  // Accordion Section Toggle States
  const [openSections, setOpenSections] = useState({
    category: true,
    size: true,
    colors: true,
    price: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 🎯 Extract Dynamic Sizes from DB table fields (`sizes` text string)
  const availableSizes = useMemo(() => {
    if (!products || products.length === 0) return ["SM", "MD", "LG", "XL", "XXL"];
    const allSizes = products
      .flatMap(p => p?.sizes ? p.sizes.split(',').map(s => s.trim().toUpperCase()) : [])
      .filter(Boolean);
    return Array.from(new Set(allSizes)).sort();
  }, [products]);

  // 🎯 Extract Dynamic Colors from DB table fields (`colors` text string)
  const availableColors = useMemo(() => {
    if (!products || products.length === 0) {
      return [
        { name: "black", hex: "#000000" },
        { name: "white", hex: "#ffffff", border: true },
        { name: "blue", hex: "#3B51E3" },
        { name: "grey", hex: "#888888" }
      ];
    }
    const uniqueNames = Array.from(new Set(
      products
        .flatMap(p => p?.colors ? p.colors.split(',').map(c => c.trim().toLowerCase()) : [])
        .filter(Boolean)
    ));
    
    // Map standard color words to clean presentation hex values
    return uniqueNames.map(colorName => {
      let hex = "#888888"; // default fallback grey
      if (colorName === "black") hex = "#000000";
      if (colorName === "white") hex = "#ffffff";
      if (colorName === "red") hex = "#dc2626";
      if (colorName === "blue") hex = "#3B51E3";
      if (colorName === "green") hex = "#16a34a";
      if (colorName === "pink") hex = "#fbcfe8";
      if (colorName === "yellow") hex = "#eab308";
      return { name: colorName, hex, border: colorName === "white" };
    });
  }, [products]);

  const handleClearAll = () => {
    onCategorySelect("");
    setSelectedSize("");
    setSelectedColor("");
    setPriceRange(1000);
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="w-full flex flex-col gap-3 font-poppins select-none antialiased text-slate-800">
      
      {/* 1. TOP STATUS PANEL */}
      <div className="w-full bg-white border border-neutral-200/50 rounded-xl px-4 py-3 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Active Filters</span>
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-[#3B51E3] hover:text-[#1b284f] transition-colors duration-150 cursor-pointer outline-none"
        >
          Clear All
        </button>
      </div>

      {/* 2. CATEGORIES SECTION ACCORDION */}
      <div className="w-full bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <button
          onClick={() => toggleSection("category")}
          className="w-full px-4 py-3.5 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors cursor-pointer outline-none"
        >
          <span>Categories</span>
          {openSections.category ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </button>

        {openSections.category && (
          <div className="p-4 flex flex-col gap-3 max-h-[240px] overflow-y-auto no-scrollbar animate-in fade-in duration-150">
            {categories?.map((cat, i) => {
              const displayName = cat && typeof cat === "object" ? (cat.name || cat.title) : String(cat);
              if (!displayName || displayName === "undefined" || displayName === "#") return null;

              const dbValue = displayName.toLowerCase().trim();
              const isChecked = activeCategory?.toLowerCase() === dbValue;

              return (
                <label key={`${dbValue}-${i}`} className="flex items-center justify-between group cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onCategorySelect(isChecked ? "" : dbValue)}
                      className="w-4 h-4 rounded border-neutral-300 text-[#3B51E3] focus:ring-[#3B51E3] transition-colors cursor-pointer"
                    />
                    <span className={`transition-colors duration-150 ${isChecked ? "text-[#3B51E3] font-bold" : "text-slate-600 group-hover:text-slate-900"}`}>
                      {displayName}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SIZES SECTION ACCORDION */}
      <div className="w-full bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <button
          onClick={() => toggleSection("size")}
          className="w-full px-4 py-3.5 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors cursor-pointer outline-none"
        >
          <span>Filter by Size</span>
          {openSections.size ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </button>

        {openSections.size && (
          <div className="p-4 flex flex-wrap gap-2 animate-in fade-in duration-150">
            {availableSizes.map((size) => {
              const isSizeActive = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(isSizeActive ? "" : size)}
                  className={`h-7 px-3.5 rounded-xl text-[10.5px] font-bold tracking-wider transition-all duration-150 cursor-pointer outline-none ${
                    isSizeActive
                      ? "bg-[#3B51E3] text-white shadow-sm"
                      : "bg-[#F6F7FB] text-slate-600 hover:bg-neutral-200/70"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. COLORS SECTION ACCORDION */}
      <div className="w-full bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <button
          onClick={() => toggleSection("colors")}
          className="w-full px-4 py-3.5 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors cursor-pointer outline-none"
        >
          <span>Filter by Color</span>
          {openSections.colors ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </button>

        {openSections.colors && (
          <div className="p-4 flex flex-wrap gap-2.5 items-center animate-in fade-in duration-150">
            {availableColors.map((color) => {
              const isColorActive = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(isColorActive ? "" : color.name)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-5 h-5 rounded-full transition-transform duration-150 relative cursor-pointer outline-none ${
                    isColorActive ? "scale-125 ring-2 ring-[#3B51E3] ring-offset-2" : "hover:scale-110"
                  } ${color.border ? "border border-neutral-300" : ""}`}
                  title={color.name}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 5. PRICE RANGE ACCORDION */}
      <div className="w-full bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <button
          onClick={() => toggleSection("price")}
          className="w-full px-4 py-3.5 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-50 hover:bg-neutral-50/40 transition-colors cursor-pointer outline-none"
        >
          <span>Max Budget Price</span>
          {openSections.price ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </button>

        {openSections.price && (
          <div className="p-4 flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex justify-between text-xs font-bold text-neutral-700 px-0.5">
              <span>$0</span>
              <span className="text-[#3B51E3]">${priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#3B51E3]"
            />
          </div>
        )}
      </div>

    </div>
  );
}