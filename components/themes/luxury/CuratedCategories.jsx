'use client';

import React from "react";
import { useCategories } from "@/hooks/useCategories";
import CategoryCard from "./CategoryCard";
import { LayoutGrid, Layers, Shirt, Scissors, ShoppingBag, Tag } from "lucide-react";

const CuratedCategories = ({ activeCategory, onCategorySelect }) => {
  const { categories, loading, error } = useCategories();

  const getCategoryIcon = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('all')) return LayoutGrid;
    if (lowerName.includes('hoodie') || lowerName.includes('sweater')) return Layers;
    if (lowerName.includes('shirt') || lowerName.includes('tee')) return Shirt;
    if (lowerName.includes('pant') || lowerName.includes('bottom')) return Scissors;
    if (lowerName.includes('jacket') || lowerName.includes('outerwear')) return ShoppingBag;
    return Tag;
  };

  // Premium Skeleton Loading matching the updated layout grid system bounds
  if (loading && (!categories || categories.length === 0)) {
    return (
      <div className="w-full bg-white border-b border-neutral-200/50 antialiased">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-4">
          <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-11 w-32 rounded-lg bg-neutral-50 border border-neutral-200/40 animate-pulse shrink-0" 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <nav className="w-full bg-white border-b border-neutral-200/50 antialiased">
      {/* This internal section box shares the EXACT structural sizing rules 
        as the main Hero layout container, keeping vertical grids perfectly parallel.
      */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-5">
        <div className="flex flex-row items-center gap-3 overflow-x-auto pb-1 scrollbar-none snap-x w-full">
          
          <CategoryCard 
            title="All Styles"
            icon={LayoutGrid}
            isActive={!activeCategory}
            onClick={() => onCategorySelect("")}
          />

          {categories?.map((cat, i) => {
            const displayName = cat && typeof cat === "object" ? (cat.name || cat.title) : String(cat);
            
            if (!displayName || displayName === "undefined" || displayName === "#") return null;

            const dbValue = displayName.toLowerCase().trim();
            const isCurrentlyActive = activeCategory?.toLowerCase() === dbValue;

          return (
            <CategoryCard 
              key={`${dbValue}-${i}`}
              title={displayName}
              icon={getCategoryIcon(displayName)}
              isActive={isCurrentlyActive}
              onClick={() => onCategorySelect(dbValue)}
            />
          );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CuratedCategories;