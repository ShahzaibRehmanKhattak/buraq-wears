'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import CuratedCategories from './CuratedCategories';

const ProductSection = ({ title = "Collection", subtitle = "Premium Selections" }) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    products, 
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

  return (
    <section className="w-full bg-white antialiased">
      {/* 1. Header & Navigation (Full-Bleed Divider) */}
      <div className="w-full border-b border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 pt-16 pb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-widest text-[#4f46e5] uppercase bg-[#4f46e5]/5 inline-block px-3 py-1 rounded-full">
              {subtitle}
            </p>
            <h1 className="text-[34px] md:text-[48px] font-extrabold tracking-tighter leading-none text-[#1b284f] max-w-lg">
              {activeCategory || title}
            </h1>
            {searchQuery && (
              <p className="text-[13px] text-neutral-500 mt-2 tracking-normal font-normal">
                Displaying archives matching: &quot;{searchQuery}&quot;
              </p>
            )}
          </div>

          <SearchBar 
            onSearch={handleSearchTrigger} 
            placeholder="Search our database..." 
          />
        </div>
      </div>

      {/* 2. Curated Categories (Shared Structural Padding) */}
      <CuratedCategories 
        activeCategory={activeCategory} 
        onCategorySelect={(cat) => setActiveCategory(cat)} 
      />

      {/* 3. Main Results Grid & Filtering */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-16">
        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-neutral-100 transition-colors">
          <div className="flex items-center gap-3">
            <span className={`text-[12px] font-bold uppercase tracking-wider ${loading ? "text-neutral-400" : "text-[#1b284f]"}`}>
              {loading ? "Analyzing..." : `Displaying ${products?.length || 0} Results`}
            </span>
          </div>
          {activeCategory && (
            <button 
              onClick={() => setActiveCategory("")}
              className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#4f46e5] transition-colors flex items-center gap-1.5"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dynamic Loading States Matrix */}
        {loading ? (
          /* Premium Skeleton Grid Matrix matching the updated ProductCard geometry */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-5 p-3 rounded-2xl border border-neutral-100 bg-white">
                <div className="aspect-[2/3] w-full bg-neutral-100 animate-pulse rounded-xl" />
                <div className="space-y-2 px-1">
                  <div className="h-3 bg-neutral-100 animate-pulse w-3/4 rounded" />
                  <div className="h-4 bg-neutral-100 animate-pulse w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-32 text-center bg-red-50 rounded-xl border border-red-100 max-w-2xl mx-auto px-6">
            <p className="text-[11px] uppercase text-red-600 font-extrabold tracking-widest bg-red-100 inline-block px-3 py-1 rounded-full mb-3">Database Connection Error</p>
            <p className="text-[14px] text-red-900/70 mt-2 font-normal leading-relaxed">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28 bg-neutral-50/50 rounded-xl border-2 border-dashed border-neutral-100 max-w-2xl mx-auto px-6">
            <p className="text-[14px] font-medium text-neutral-500 max-w-md mx-auto leading-relaxed">
              No matching archives found for the current filter criteria. Try adjusting your search query or switching categories.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            
            {/* Main Product Grid Matrix (Social-feed aesthetic) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mb-20">
              {products.map((item, idx) => (
                <div 
                  key={item?.id || idx}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
                  style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
                >
                  <ProductCard item={item} />
                </div>
              ))}
            </div>

            {/* Pagination Load More Controller */}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="h-12 w-full md:w-72 bg-[#1b284f] text-white text-[11px] font-bold tracking-[0.15em] rounded-lg hover:bg-[#4f46e5] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center uppercase shadow-sm active:scale-[0.98]"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                    Connecting...
                  </span>
                ) : 'Request More Archives'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;