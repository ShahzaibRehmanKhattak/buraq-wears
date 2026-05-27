"use client";
import React from "react";
import { useCategories } from "@/hooks/useCategories";

export function CategoryPills({ activeCategory, setActiveCategory }) {
  const { categories, loading, error } = useCategories();

  const getCategoryIcon = (name) => {
    const cleanName = String(name || "").toLowerCase();
    if (cleanName.includes("tee") || cleanName.includes("top")) return "apparel";
    if (cleanName.includes("shirt")) return "checkroom";
    if (cleanName.includes("pent") || cleanName.includes("pant") || cleanName.includes("trouser")) return "straighten";
    if (cleanName.includes("knit") || cleanName.includes("sweater")) return "layers";
    if (cleanName.includes("access")) return "local_mall";
    return "tag";
  };

  if (loading && (!categories || categories.length === 0)) {
    return (
      <section className="md:hidden mt-4 px-5 flex gap-2 overflow-x-auto hide-scrollbar">
        <div className="px-6 py-2.5 bg-[#e8e8e8] text-gray-400 rounded-full text-[13px] animate-pulse">
          Loading Styles...
        </div>
      </section>
    );
  }

  return (
    <section className="md:hidden mt-4 px-5 overflow-x-auto hide-scrollbar flex gap-2 animate-fade-in">
      {/* "All Styles" Reset Button */}
      <button 
        type="button"
        onClick={() => setActiveCategory("")}
        className={`px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap tap-scale font-medium flex items-center gap-2 transition-all duration-200 ${
          activeCategory === "" 
            ? "bg-black text-white" 
            : "bg-[#e8e8e8] text-black hover:bg-gray-300"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">grid_view</span>
        <span>All Styles</span>
      </button>

      {/* Dynamic Categories Loop */}
      {categories?.map((cat, index) => {
        // Universal parser to read the category name string reliably
        const displayName = cat && typeof cat === "object" ? cat.name : String(cat);
        const uniqueKey = cat && typeof cat === "object" ? (cat.id || displayName) : `cat-${index}`;

        if (!displayName || displayName === "undefined" || displayName === "#") return null;

        // 🎯 THE TRACKING FIX: Compare and track active states using the NAME string, not the slug
        const isButtonActive = activeCategory === displayName;
        
        return (
          <button 
            key={uniqueKey} 
            type="button"
            // 🎯 THE CLICK FIX: Send the text name string straight to your hook's state tree
            onClick={() => setActiveCategory(displayName)} 
            className={`px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap tap-scale font-medium flex items-center gap-2 transition-all duration-200 ${
              isButtonActive 
                ? "bg-black text-white" 
                : "bg-[#e8e8e8] text-black hover:bg-gray-300"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {getCategoryIcon(displayName)}
            </span>
            <span className="capitalize">
              {displayName}
            </span>
          </button>
        );
      })}
    </section>
  );
}