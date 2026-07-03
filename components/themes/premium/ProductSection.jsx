'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import CuratedCategories from './CuratedCategories';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

const ProductSection = ({ title = "Collection", subtitle = "Premium Selections" }) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter States Matching your Supabase table fields
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState(0);

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

  // Client-side local filtering matrix (Size, Color, Price, Sorting)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // 1. Max Price Filter Rule (Only applies if shifted past 0)
    if (priceRange > 0) {
      result = result.filter(item => Number(item?.price || 0) <= priceRange);
    }

    // 2. Filter by Size match string matching your 'sizes' text column
    if (selectedSize) {
      result = result.filter(item => 
        item?.sizes && String(item.sizes).toUpperCase().includes(selectedSize.toUpperCase())
      );
    }

    // 3. Filter by Color match string matching your 'colors' text column
    if (selectedColor) {
      result = result.filter(item => 
        item?.colors && String(item.colors).toLowerCase().includes(selectedColor.toLowerCase())
      );
    }

    // 4. Sort Ordering Matrix Actions
    if (sortBy === 'low-high') {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return result;
  }, [products, sortBy, selectedSize, selectedColor, priceRange]);

  // 🎯 FIX: Clear Filters resets state immediately, forcing useProducts to load defaults instantly
  const handleClearAllFilters = () => {
    setActiveCategory("");
    setSearchQuery("");
    setSelectedSize("");
    setSelectedColor("");
    setPriceRange(0);
    setSortBy("featured");
  };

  return (
    <section className="w-full bg-white antialiased font-poppins min-h-screen relative overflow-visible">
      
      {/* Branding Section Header Top Bar */}
      <div className="w-full border-b border-neutral-100 bg-[#F6F7FB]/40">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-6 xl:px-0 pt-12 pb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#3B51E3]">
              {subtitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight capitalize">
              {activeCategory ? activeCategory : title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Clear Filters Action Button displaying dynamically */}
            {(activeCategory || searchQuery || selectedSize || selectedColor || priceRange > 0) && (
              <button 
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/70 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
              >
                <X size={12} strokeWidth={2.5} />
                Clear Filters
              </button>
            )}
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-white border border-neutral-200/50 px-3 py-1.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] w-fit">
              {filteredProducts.length} Items Listed
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Sticky Mobile Filter Row */}
      <div className="md:hidden w-full sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1b284f] hover:bg-[#3B51E3] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-sm cursor-pointer"
        >
          <SlidersHorizontal size={13} className="stroke-[2.5]" />
          <span>Filters Workflow</span>
        </button>

        <span className="text-[11px] font-semibold text-neutral-500">
          {filteredProducts.length} Results
        </span>
      </div>

      {/* Main Container Setup Panel */}
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 xl:px-0 py-10 !overflow-visible h-full">
        <div className="flex flex-col md:flex-row gap-8 items-start w-full relative !overflow-visible h-full">
          
          {/* ================= DESKTOP SIDEBAR GRID AREA (STICKY FIX) ================= */}
          <aside className="hidden md:flex flex-col gap-4 w-[260px] shrink-0 sticky top-6 self-start z-30 max-h-[90vh] overflow-y-auto no-scrollbar">
            <FilterBar 
              sortBy={sortBy}
              setSortBy={setSortBy}
              setSearchQuery={setSearchQuery}
            />

            <CuratedCategories 
              products={products}
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              priceRange={priceRange === 0 ? 1000 : priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* ================= RIGHT SIDE CORE PRODUCTS CONTENT ROW ================= */}
          <div className="flex-1 w-full flex flex-col">
            
            {loading && filteredProducts.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6 w-full">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-full flex flex-col gap-3 animate-pulse">
                    <div className="w-full aspect-square bg-neutral-100 rounded-2xl" />
                    <div className="h-4 bg-neutral-100 rounded w-2/3 mx-1" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="w-full text-center py-20 bg-[#F6F7FB] rounded-2xl border border-neutral-200/20 px-4">
                <p className="text-sm font-semibold text-neutral-500">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              /* 🎯 FIX: When filtered items don't match, give them a beautiful, one-click immediate reset handler */
              <div className="w-full text-center py-20 bg-[#F6F7FB] rounded-2xl border border-neutral-200/20 px-4 flex flex-col items-center justify-center gap-3">
                <p className="text-sm font-semibold text-neutral-500">No items match your active keyword parameters within this view.</p>
                <button 
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1b284f] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#3B51E3] transition-colors cursor-pointer shadow-md active:scale-95"
                >
                  <RotateCcw size={12} />
                  Reset View Parameters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 xl:gap-6 w-full">
                {filteredProducts.map((item, idx) => (
                  <div 
                    key={item?.id || idx}
                    className="animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out"
                    style={{ animationDelay: `${idx * 20}ms`, animationFillMode: 'both' }}
                  >
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Load More */}
            {hasMore && (
              <div className="w-full flex items-center justify-center mt-12 mb-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="h-11 w-full max-w-xs bg-[#1b284f] text-white text-[10.5px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#3B51E3] disabled:bg-neutral-300 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  {loadingMore ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Load More Products'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE SLIDE-OUT FILTER MODAL OVERLAY ================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300"
          />

          <div className="relative w-full max-w-[290px] h-full bg-white shadow-2xl flex flex-col p-5 overflow-y-auto z-10 animate-in slide-in-from-right duration-200 ease-out">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 mb-4">
              <span className="text-xs font-bold uppercase text-[#1b284f] tracking-wider">
                Workspace Parameters
              </span>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F6F7FB] text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-full flex flex-col gap-4">
              <FilterBar 
                sortBy={sortBy}
                setSortBy={setSortBy}
                setSearchQuery={setSearchQuery}
              />
              
              <CuratedCategories 
                products={products}
                activeCategory={activeCategory}
                onCategorySelect={(cat) => {
                  setActiveCategory(cat);
                  setIsMobileSidebarOpen(false);
                }}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                priceRange={priceRange === 0 ? 1000 : priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ProductSection;