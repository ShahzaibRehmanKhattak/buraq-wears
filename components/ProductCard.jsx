'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export const ProductCard = ({ item }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  const generateSlugUrl = () => {
    const title = item?.title || item?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${item?.id || 0}`;
  };

  return (
    <div className="group cursor-pointer w-full">
      <Link href={generateSlugUrl()} className="block w-full text-inherit no-underline">
        
        {/* Image Viewport */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f4] mb-4 rounded-md">
          
          {/* CUSTOM BADGE: Top Left */}
          {item?.badge_text && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                {item.badge_text}
              </span>
            </div>
          )}

          {images.map((imgSrc, idx) => (
            <img
              key={`${item?.id || idx}-${idx}`}
              alt={`${item?.title || 'Product'}`}
              src={imgSrc || "/placeholder.jpg"}
              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-[1200ms] ease-in-out ${idx === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
          ))}

          {/* 🎯 ACTION BUTTONS: Now visible on mobile, reveal animation for desktop */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/40 to-transparent z-20 
                          md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
            
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
              className="bg-white text-black text-[9px] font-bold px-3 py-1.5 uppercase hover:bg-black hover:text-white transition-colors z-30 shadow-md"
            >
              Add
            </button>
            
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
              className="z-30 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
            >
              <Heart size={16} className="text-black hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* META BLOCK */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[12px] font-bold uppercase tracking-wider truncate text-black flex-1">
            {item?.title || item?.name || "Untitled Product"}
          </h3>
          
          {hasDiscount && (
            <span className="bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wide shrink-0">
              -{discountPercent}%
            </span>
          )}
        </div>
        
        {/* Price Display */}
        <div className="flex items-center gap-2 mt-1">
          <p className={`text-[12px] font-bold ${hasDiscount ? 'text-red-600' : 'text-black'}`}>
            ${Number(item?.price || 0).toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-[10px] text-gray-400 line-through">
              ${Number(item.compare_at_price).toFixed(2)}
            </p>
          )}
        </div>
        
      </Link>
    </div>
  );
};