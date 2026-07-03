'use client';

import React from "react";
import { useCategories } from "@/hooks/useCategories";
import  CategoryCard  from "./CategoryCard";
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

  if (loading && (!categories || categories.length === 0)) {
    return (
      <div className="w-full py-4 px-4 sm:px-6">
        <div className="flex flex-row gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-neutral-100 animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <nav className="w-full border-b border-neutral-100 bg-white p-4 sm:px-6 z-10">
      {/* Forced into a strict single horizontal row on ALL screen sizes (flex-row on mobile and desktop).
        `scrollbar-none` hides the native scrollbar while keeping the swiping functionality perfectly clean.
      */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x w-full">
        
        {/* Default Reset Option */}
        <CategoryCard 
          title="All Styles"
          icon={LayoutGrid}
          isActive={!activeCategory}
          onClick={() => onCategorySelect("")}
        />

        {/* Dynamic Database Mapping */}
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
    </nav>
  );
};
export default CuratedCategories;