'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart'; 
import { useFavorites } from '@/hooks/FavoritesContext'; 

const ProductCard = ({ item }) => {
  // ================= RETAINED BACKEND LOGIC & HOOKS =================
  const { addItem } = useCart(); 
  const { toggleFavorite, isFavorited } = useFavorites(); 
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false); 
  const [isTogglingFav, setIsTogglingFav] = useState(false); 

  const favorited = isFavorited(item?.id);

  const images = Array.isArray(item?.images) && item.images.length > 0
    ? item.images
    : item?.image 
      ? [item.image] 
      : ["/placeholder.jpg"];

  const hasDiscount = item?.compare_at_price > item?.price;
  const discountPercent = hasDiscount 
    ? Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100) 
    : 0;

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [images]);

  const generateSlugUrl = () => {
    const title = item?.title || item?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${item?.id || 0}`;
  };

  const handleCartAction = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!item?.id || isAdding) return;

    try {
      setIsAdding(true);
      const defaultColor = item?.colors ? item.colors.split(',')[0].trim() : "Standard";
      const defaultSize = item?.sizes ? item.sizes.split(',')[0].trim() : "Free Size";
      await addItem(item.id, 1, defaultColor, defaultSize);
    } catch (err) {
      console.error("Cart quick action exception:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleFavoriteAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item?.id || isTogglingFav) return;

    try {
      setIsTogglingFav(true);
      await toggleFavorite(item);
    } catch (err) {
      console.error("Favorite toggle exception:", err);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const getTopLeftLabel = () => {
    if (item?.badge_text) {
      return (
        <span className="bg-[#1b284f] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest rounded shadow-sm">
          {item.badge_text}
        </span>
      );
    }
    if (hasDiscount) {
      return (
        <span className="bg-[#991b1b] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
          {discountPercent}% OFF
        </span>
      );
    }
    return null;
  };

  return (
    <div className="group w-full max-w-[280px] flex flex-col font-poppins select-none antialiased mx-auto">
      
      {/* 1. Light Grey Container Area */}
      <div className="relative w-full aspect-square bg-[#F6F7FB] rounded-2xl border border-neutral-200/20 overflow-hidden flex items-center justify-center">
        
        {/* Full Click Asset Cover Wrapper */}
        <Link href={generateSlugUrl()} className="absolute inset-0 w-full h-full z-10">
          {images.map((imgSrc, idx) => (
            <img
              key={`${item?.id || idx}-${idx}`}
              alt={`${item?.title || 'Product'}`}
              src={imgSrc || "/placeholder.jpg"}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
                idx === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />
          ))}
        </Link>

        {/* Top Left Hot-Deals Badges */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          {getTopLeftLabel()}
        </div>

        {/* Top Right Slider Progress Dots */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-20 flex flex-row gap-1 px-1.5 py-1 rounded-md bg-black/10 backdrop-blur-[2px] pointer-events-none">
            {images.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1 rounded-full transition-all duration-300 ease-out ${
                  dotIdx === currentImgIndex 
                    ? "w-3 bg-white" 
                    : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* RESPONSIVE HORIZONTAL INTERACTION DECK
            - Mobile: Static equal row layout of rounded square buttons (No text breaks)
            - Desktops (md:): Slides up cleanly on image area hover
        */}
        <div className="absolute bottom-3 left-0 right-0 px-3 z-20 flex items-center justify-center gap-1.5 opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out">
          
          {/* Quick View Button */}
          <Link
            href={generateSlugUrl()}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-colors duration-200"
          >
            <Eye size={14} className="md:w-4 md:h-4" />
          </Link>

          {/* Smart Adaptive Cart Target Action Link */}
          <button
            disabled={isAdding}
            onClick={handleCartAction}
            className="w-8 h-8 md:w-auto md:flex-1 h-8 md:h-9 bg-[#3B51E3] hover:bg-[#2a3ec4] disabled:bg-neutral-400 text-white text-[11px] md:text-xs font-bold tracking-wide rounded-lg shadow-[0_2px_6px_rgba(59,81,227,0.2)] transition-colors duration-200 flex items-center justify-center px-0 md:px-3 gap-1"
          >
            {isAdding ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <Plus size={14} className="md:w-3.5 md:h-3.5" />
                {/* Text is completely hidden on mobile screens, appearing only on md screens and up */}
                <span className="hidden md:inline">Add to cart</span>
              </>
            )}
          </button>

          {/* Favorite Trigger Control Toggle */}
          <button
            disabled={isTogglingFav}
            onClick={handleFavoriteAction}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white hover:bg-neutral-50 rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-all duration-200 active:scale-95"
          >
            <Heart
              size={14}
              strokeWidth={favorited ? 0 : 2}
              className={`transition-colors duration-200 md:w-4 md:h-4 ${
                favorited ? "fill-[#e63946] text-[#e63946]" : "text-neutral-700"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Item Specifications Legend Meta Data Block */}
      <div className="pt-3 px-1 flex flex-col gap-0.5 text-left">
        
        {/* Quality Rating Segment */}
        <div className="flex items-center gap-1 mb-0.5">
          <div className="flex gap-0.5 text-amber-400">
            {"★★★★★".split("").map((star, i) => (
              <span key={i} className="text-xs">★</span>
            ))}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium ml-0.5">(5)</span>
        </div>

        {/* Product Component Header Label */}
        <h3 className="text-[13.5px] font-semibold text-neutral-900 tracking-wide line-clamp-1 group-hover:text-[#3B51E3] transition-colors duration-200">
          {item?.title || item?.name || "Untitled Product"}
        </h3>

        {/* Pricing Layout Matrix Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-[14.5px] font-bold text-neutral-900 tracking-tight">
            ${Number(item?.price || 0).toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-[11.5px] text-neutral-400 font-medium line-through decoration-neutral-300/70">
              ${Number(item.compare_at_price).toFixed(0)}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductCard;