"use client";
import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

// Hooks & Split Components References
import { usePageProducts } from '@/hooks/usePageProducts';
import { getTheme } from "@/components/themes";
export default function ShirtsPage() {
    const Theme = getTheme("luxury"); // Dynamically switch between "default" and "luxury" themes based on user preference or context
  
  // 🎯 Clean baseline to handle global collections perfectly
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Consume your dynamic product data hook stream
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    loadMore
  } = usePageProducts("trousers", 12); // Extracted values correspond purely to category = "trousers"

  // Process data mutations cleanly based on dynamic user sub-category choices
  const processedProducts = useMemo(() => {
    let result = [...products];
    
    // 🎯 1. Dynamic SUB_CATEGORY Filtering Engine
    if (activeFilter !== 'All') {
      result = result.filter(p => 
        String(p.sub_category).toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // 2. High-Performance Price Array Sorting Matrix
    if (sortBy === 'low-high') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    
    return result;
  }, [products, activeFilter, sortBy]);

  return (
    <div className="antialiased bg-white text-[#1a1c1c] font-sans selection:bg-black selection:text-white">
      <Theme.GlobalStyles />
      
      {/* Brand Aesthetic Banner Section */}
 <Theme.Hero masterSlug="about" targetSection="trousers" />
      {/* Synchronized Control Filter Bar */}
      <Theme.FilterBar 
        products={products} // 🎯 Connect the live collection data chunk down to the pill matrix
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
        productCount={processedProducts.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setSearchQuery={setSearchQuery} 
      />

      {/* Editorial Double Layout Section */}
      <Theme.FeaturedEditorial />
      <Theme.PsychologicalNudge   pageContextName="trousers" />
      {/* Main Core Catalog Section */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[64px] py-12 md:py-[80px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-6 h-6 text-neutral-900 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Loading Archives...</p>
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-neutral-200 rounded-lg">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-bold">
              No pieces found matching the criteria.
            </p>
          </div>
        ) : (
          /* Main Product Grid */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-[24px] gap-y-10 md:gap-y-[72px] w-full">
            {processedProducts.map((product, idx) => (
              <div 
                key={product?.id || idx}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
              >
                <Theme.ProductCard item={product} />
              </div>
            ))}
          </div>
        )}

        {/* Load More/Pagination Segment Controls */}
        {hasMore && !loading && (
          <div className="mt-16 md:mt-[100px] flex justify-center">
            <button 
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full md:w-64 border border-neutral-900 h-12 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-900 cursor-pointer"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading</span>
                </span>
              ) : (
                <span>Load More</span>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}