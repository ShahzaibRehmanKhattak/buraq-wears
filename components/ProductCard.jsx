'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export const ProductCard = ({ item }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // 🎯 BULLETPROOF LOGIC: Safely parses array, null arrays, empty arrays, or falls back to single string image keys
  const images = Array.isArray(item?.images) && item.images.length > 0
    ? item.images
    : item?.image 
      ? [item.image] 
      : ["/placeholder.jpg"];

  // Automatic smooth cross-fade engine slider loop
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="group cursor-pointer w-full">
      {/* Visual Image Viewport Box */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f4] mb-6">
        
        {/* Render all image layers safely */}
        {images.map((imgSrc, idx) => (
          <img
            key={`${item?.id || idx}-${idx}`}
            alt={`${item?.title || 'Product'} - View ${idx + 1}`}
            src={imgSrc || "/placeholder.jpg"}
            className={`
              absolute inset-0 w-full h-full object-cover 
              group-hover:scale-105 transition-all duration-[1200ms] ease-in-out
              ${idx === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          />
        ))}

        {/* Hover Action Sheet Overlays (Desktop Only) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent z-20">
          <button className="bg-white text-black text-[10px] font-bold px-4 py-2 uppercase hover:bg-black hover:text-white transition-colors">
            Add to Bag
          </button>
          <Heart size={18} className="text-white hover:text-red-500 transition-colors" z-30 />
        </div>

        {/* Minimal indicator dots at the top if multiple lookbook variants exist */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1 z-20 bg-black/10 backdrop-blur-xs px-2 py-1 rounded-full">
            {images.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-1 h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'bg-white w-2' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meta Text Blocks */}
      <h3 className="text-[12px] font-bold uppercase mb-2 tracking-wider truncate">
        {item?.title || item?.name || "Untitled Product"}
      </h3>
      <p className="text-[14px] text-gray-500">
        {typeof item?.price === 'number' ? `$${item.price.toFixed(2)}` : (item?.price || "$0.00")}
      </p>
    </div>
  );
};