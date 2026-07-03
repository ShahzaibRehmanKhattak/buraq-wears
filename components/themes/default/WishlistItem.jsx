"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function WishlistItem({ item, onRemove, onMoveToBag }) {
  const [localUpdating, setLocalUpdating] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Unpack nested relational database objects safely
  const productData = item.products || {};
  const title = productData.title || "Selected Design Item";
  const price = Number(productData.price || 0);
  const compareAtPrice = Number(productData.compare_at_price || 0);
  
  const currentColor = productData.colors ? productData.colors.split(',')[0].trim() : "Standard Finish";
  const currentSize = productData.sizes ? productData.sizes.split(',')[0].trim() : "Universal";

  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : 0;

  const displayImage = Array.isArray(productData.images) && productData.images.length > 0 
    ? productData.images[0] 
    : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=60";

  const generateSlugUrl = () => {
    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    return `/${cleanSlug}-${productData.id || item.product_id}`;
  };

  const handleRemoveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (localUpdating) return;
    
    try {
      setLocalUpdating(true);
      if (onRemove) {
        await onRemove(productData, item.id);
      }
    } catch (err) {
      console.error("Failed to execute wishlist row removal:", err);
      setLocalUpdating(false);
    }
  };

  const handleMoveToBagClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (localUpdating || isAddedSuccess) return;

    try {
      setLocalUpdating(true);
      if (onMoveToBag) {
        // Trigger bag transfer function
        await onMoveToBag(item);
        
        // Show success phase in UI button text first!
        setIsAddedSuccess(true);
      }
    } catch (err) {
      console.error("Failed to route bag transfer execution step:", err);
    } finally {
      setLocalUpdating(false);
    }
  };

  return (
    <div className={`group relative flex flex-row gap-3.5 md:gap-6 p-3 md:p-5 mb-4 bg-white border border-black/[0.04] hover:border-black/[0.09] rounded-md transition-all duration-500 shadow-[0_1px_3px_rgba(0,0,0,0.01)] last:mb-0 ${isAddedSuccess ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}>
      <div className="w-[75px] sm:w-[110px] md:w-[130px] aspect-[3/4] overflow-hidden bg-[#fdfdfd] shrink-0 rounded-sm relative border border-black/[0.02]">
        <Link href={generateSlugUrl()} className="block w-full h-full cursor-pointer">
          <img 
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" 
            src={displayImage} 
            alt={title}
          />
        </Link>

        {hasDiscount && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className="bg-[#991b1b] text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm shadow-sm">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between min-h-[100px] sm:min-h-[173px] pt-0.5">
        <div className="flex justify-between items-start gap-2 w-full relative">
          <div className="space-y-1.5 max-w-[85%]">
            <h2 className="text-[11px] sm:text-[13px] md:text-[14px] font-bold tracking-[0.05em] uppercase text-black leading-tight">
              <Link href={generateSlugUrl()} className="hover:opacity-70 transition-opacity block w-full text-inherit no-underline">
                {title}
              </Link>
            </h2>
            
            <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium">
              <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-sm font-semibold border border-neutral-200/60">
                Color: <span className="text-black font-bold">{currentColor}</span>
              </span>
              <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-sm font-semibold border border-neutral-200/60">
                Size: <span className="text-black font-bold">{currentSize}</span>
              </span>
            </div>

            <div className="pt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
              <span className="text-[8px] uppercase tracking-widest font-bold text-neutral-500">In Stock Ready to Move</span>
            </div>
          </div>

          <button 
            type="button"
            disabled={localUpdating || isAddedSuccess}
            onClick={handleRemoveClick}
            className="w-6 h-6 sm:w-7 sm:h-7 inline-flex items-center justify-center rounded-full border border-neutral-100 bg-neutral-50/50 text-neutral-400 hover:text-black hover:bg-neutral-100 hover:border-neutral-200 transition-all duration-200 disabled:opacity-30 cursor-pointer shrink-0"
            title="Remove from Wishlist"
          >
            <span className="font-sans text-[11px] font-bold leading-none select-none">✕</span>
          </button>
        </div>
        
        <div className="flex flex-row items-end justify-between gap-3 mt-3 sm:mt-4 pt-2 sm:pt-4 border-t border-black/[0.03]">
          
          <div className="flex items-center gap-3 sm:gap-4 justify-between w-full shrink-0">
            <div>
              <button
                type="button"
                disabled={localUpdating || isAddedSuccess}
                onClick={handleMoveToBagClick}
                className={`h-8 sm:h-9 px-4 sm:px-5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm shadow-sm flex items-center gap-2 cursor-pointer ${
                  isAddedSuccess 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-black text-white hover:bg-neutral-800'
                } disabled:opacity-90`}
              >
                <span className="material-symbols-outlined text-[13px] sm:text-[15px]">
                  {isAddedSuccess ? 'check_circle' : 'shopping_bag'}
                </span>
                {isAddedSuccess ? 'Added to Bag' : 'Move to Bag'}
              </button>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-neutral-400">Price</p>
              <div className="flex items-center gap-2 h-6 sm:h-7 bg-neutral-50 px-2 sm:px-3 rounded-sm border border-black/[0.02]">
                {hasDiscount && (
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through font-normal tracking-tight">
                    {compareAtPrice.toFixed(2)}
                  </span>
                )}
                <p className={`text-[11px] sm:text-[13px] md:text-[14px] font-bold tracking-tight ${hasDiscount ? 'text-[#991b1b]' : 'text-black'}`}>
                  {price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

        </div>
        
        {localUpdating && (
          <div className="absolute top-3 right-11 sm:top-4 sm:right-14 flex items-center gap-1.5 bg-black text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-medium tracking-wider uppercase shadow-sm transition-all">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-neutral-400 animate-ping"></span>
            <span>Updating Workspace...</span>
          </div>
        )}

      </div>
    </div>
  );
}