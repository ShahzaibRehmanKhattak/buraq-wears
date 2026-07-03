'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart'; 
import { useFavorites } from '@/hooks/FavoritesContext'; 

const ProductCard = ({ item }) => {
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

  // Determine the single high-priority label to display on the top right
  const getTopRightLabel = () => {
    if (item?.badge_text) {
      return (
        <span className="bg-[#00b4d8] text-white text-[8px] font-extrabold px-2 py-0.5 uppercase tracking-widest rounded shadow-sm">
          {item.badge_text}
        </span>
      );
    }
    if (hasDiscount) {
      return (
        <span className="bg-[#e63946] text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
          {discountPercent}% OFF
        </span>
      );
    }
    return null;
  };

  return (
    <div className="group relative w-full max-w-[280px] aspect-[2/3] overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/30 shadow-[0_2px_8px_rgba(27,40,79,0.02)] hover:shadow-[0_8px_24px_rgba(27,40,79,0.06)] transition-all duration-500 ease-out select-none antialiased mx-auto">
      <Link href={generateSlugUrl()} className="absolute inset-0 w-full h-full z-10">
        
        {/* ================= IMMERSIVE VISUAL MEDIA FEED ================= */}
        {images.map((imgSrc, idx) => (
          <img
            key={`${item?.id || idx}-${idx}`}
            alt={`${item?.title || 'Product'}`}
            src={imgSrc || "/placeholder.jpg"}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-in-out group-hover:scale-[1.02] ${
              idx === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-99'
            }`}
          />
        ))}

        {/* Razor-Sharp Contrast Gradient Matrix */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/15 z-11 pointer-events-none" />
      </Link>

      {/* ================= TOP LEFT: CAROUSEL DIALS (SLIDER DOTS) ================= */}
      {images.length > 1 && (
        <div className="absolute top-3 left-3 z-20 flex flex-row gap-1 px-1.5 py-1 rounded-md bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none">
          {images.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`h-0.5 rounded-full transition-all duration-300 ease-out ${
                dotIdx === currentImgIndex 
                  ? "w-2.5 bg-white" 
                  : "w-0.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* ================= TOP RIGHT: SINGLE HIGH-PRIORITY LABEL ================= */}
      <div className="absolute top-3 right-3 z-20 flex items-center pointer-events-none">
        {getTopRightLabel()}
      </div>

      {/* ================= FLOATING RIGHT COLUMN INTERACTION HUB ================= */}
      <div className="absolute right-3 bottom-14 z-20 flex flex-col gap-2">
        
        {/* Engagement Heart Action */}
        <button 
          disabled={isTogglingFav}
          onClick={handleFavoriteAction} 
          className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white border border-white/10 transition-all duration-200 rounded-full shadow-md active:scale-90 group/btn"
        >
          <Heart 
            size={14} 
            strokeWidth={favorited ? 0 : 2}
            className={`transition-all duration-200 ${
              favorited 
                ? "fill-[#e63946] text-[#e63946] scale-105" 
                : "text-white group-hover/btn:text-[#e63946]"
            }`} 
          />
        </button>

        {/* Brand Accent Quick Addition Disk */}
        <button 
          disabled={isAdding}
          onClick={handleCartAction} 
          className="w-8 h-8 flex items-center justify-center bg-[#1b284f] hover:bg-[#4f46e5] disabled:bg-neutral-800 text-white transition-all duration-200 rounded-full shadow-md active:scale-90"
        >
          {isAdding ? (
            <Loader2 size={12} className="animate-spin text-white" />
          ) : (
            <Plus size={14} strokeWidth={2.5} className="text-white" />
          )}
        </button>
      </div>

      {/* ================= MINIMALIST DISPLAY TEXT OVERLAY ================= */}
      {/* Tightened margins to make it ultra-compact and professional */}
      <div className="absolute bottom-3 left-3 right-13 z-20 pointer-events-none max-w-[calc(100%-56px)]">
        <div className="space-y-0.5">
          <h3 className="text-[12.5px] font-bold tracking-wide text-white drop-shadow-sm line-clamp-1 group-hover:text-[#00b4d8] transition-colors duration-300">
            {item?.title || item?.name || "Untitled Product"}
          </h3>
          
          <div className="flex items-baseline gap-1.5">
            <p className="text-[13.5px] font-black text-white drop-shadow-sm tracking-tight">
              ${Number(item?.price || 0).toFixed(2)}
            </p>
            {hasDiscount && (
              <p className="text-[10.5px] text-white/40 font-medium line-through decoration-white/30">
                ${Number(item.compare_at_price).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;