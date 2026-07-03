'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard  from './ProductCard';
import SearchBar  from './SearchBar';
import CuratedCategories  from './CuratedCategories';

 const ProductSection = ({ title = "Store Collection", subtitle = "Premium Selections" }) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🎯 PASSING PRIMITIVES: This ensures the hook catches the change and sets loading=true
  const { 
    products, 
    categories, 
    loading, 
    loadingMore, 
    hasMore, 
    loadMore, 
    error 
  } = useProducts({
    category: activeCategory,
    search: searchQuery,
    limit: 12
  });

  const handleSearchTrigger = (searchVal) => {
    setSearchQuery(searchVal);
  };

  const toggleCategory = (catName) => {
    // If clicking the same category, clear it (toggle), else set it
    setActiveCategory((prev) => (prev === catName ? "" : catName));
  };

  return (
    <section className="py-12 md:py-24 px-4 md:px-20 max-w-[1440px] mx-auto bg-white">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 border-b border-neutral-100 pb-10">
        <div>
          <h2 className="text-[26px] md:text-[42px] font-bold uppercase tracking-tighter leading-none text-neutral-900">
            {activeCategory || title}
          </h2>
          <p className="text-[12px] text-neutral-400 mt-3 tracking-wide font-medium uppercase">
            {searchQuery ? `Results for: ${searchQuery}` : subtitle}
          </p>
        </div>

        <SearchBar 
          onSearch={handleSearchTrigger} 
          placeholder="SEARCH ARCHIVES..." 
        />
      </div>

      {/* 🎯 CURATED CATEGORIES SECTION */}
      {/* We use the 'categories' returned from the hook to keep them dynamic */}
   <CuratedCategories 
  activeCategory={activeCategory} 
  onCategorySelect={(cat) => setActiveCategory(cat)} 
/>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between mb-8 mt-12">
         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900">
            {loading ? "Calculating..." : `${products?.length || 0} Products Found`}
         </span>
         {activeCategory && (
            <button 
              onClick={() => setActiveCategory("")}
              className="text-[10px] underline underline-offset-4 font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Reset Filters
            </button>
         )}
      </div>

      {/* 🎯 UPDATED LOADING & ERROR UI */}
      {loading ? (
        /* Skeleton Grid Loading State */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] w-full bg-neutral-100 animate-pulse rounded-sm" />
              <div className="h-3 bg-neutral-100 animate-pulse w-3/4" />
              <div className="h-3 bg-neutral-100 animate-pulse w-1/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-32 text-center">
          <p className="text-xs uppercase text-red-500 font-bold tracking-widest">System Error</p>
          <p className="text-[10px] text-neutral-400 mt-2">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-200 rounded-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
            No records matched your criteria.
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          
          {/* Main Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 w-full mb-20">
            {products.map((item, idx) => (
              <div 
                key={item?.id || idx}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
              >
                <ProductCard item={item} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="h-12 w-full md:w-64 border border-neutral-900 text-[10px] font-bold tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center uppercase"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                   Loading
                </span>
              ) : 'Load More'}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
export default ProductSection;