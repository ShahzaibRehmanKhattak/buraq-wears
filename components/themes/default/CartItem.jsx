"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function CartItem({ item, onUpdateSize, onUpdateQuantity, onRemove }) {
  const [localUpdating, setLocalUpdating] = useState(false);

  const productInfo = item.products || {};
  const title = productInfo.title || "Selected Design Item";
  const price = Number(productInfo.price || 0);
  const compareAtPrice = Number(productInfo.compare_at_price || 0);
  
  const currentColor = item.selected_color || "Standard Finish";
  const currentSize = item.selected_size || "Universal";

  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : 0;

  const sizeMatrix = productInfo.sizes 
    ? productInfo.sizes.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const displayImage = Array.isArray(productInfo.images) && productInfo.images.length > 0 
    ? productInfo.images[0] 
    : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=60";

  const generateSlugUrl = () => {
    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const targetId = productInfo?.id || productInfo?.product_id || item?.product_id || item?.id;
    return `/${cleanSlug}-${targetId}`;
  };

  const dispatchNavbarSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const handleQuantityClick = async (change) => {
    if (localUpdating) return;
    try {
      setLocalUpdating(true);
      
      const absoluteTargetQty = item.quantity + change;
      if (absoluteTargetQty < 1) return;

      // ✨ SYNC FIX: Passes all common variants (id, total, and full object layout)
      // to cleanly handle context configurations without dropping connection frames.
      if (onUpdateQuantity) {
        await onUpdateQuantity(item.id, absoluteTargetQty, item);
      }
      
      dispatchNavbarSync();
    } catch (err) {
      console.error("Failed to execute onUpdateQuantity:", err);
    } finally {
      setLocalUpdating(false);
    }
  };

  const handleSizeClick = async (size) => {
    if (localUpdating || size.toLowerCase() === currentSize.toLowerCase()) return;
    try {
      setLocalUpdating(true);
      
      // Execute the size mutation using the context channel fallback mechanics
      if (onUpdateSize) {
        await onUpdateSize(item, size);
      }
      
      dispatchNavbarSync();
    } catch (err) {
      console.error("Failed to execute onUpdateSize:", err);
    } finally {
      setLocalUpdating(false);
    }
  };

  const handleRemoveClick = async () => {
    if (localUpdating) return;
    try {
      setLocalUpdating(true);
      
      if (onRemove) {
        await onRemove(item.id);
      }
      
      dispatchNavbarSync();
    } catch (err) {
      console.error("Failed to execute onRemove:", err);
    } finally {
      setLocalUpdating(false);
    }
  };

  return (
    <div className="group relative flex flex-row gap-3.5 md:gap-6 p-3 md:p-5 mb-4 bg-white border border-black/[0.04] hover:border-black/[0.09] rounded-md transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.01)] last:mb-0">
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

              {productInfo.sku && (
                <span className="text-neutral-300 font-mono tracking-normal text-[9px] ml-1 hidden sm:inline">
                  SKU: {productInfo.sku}
                </span>
              )}
            </div>

            <div className="pt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
              <span className="text-[8px] uppercase tracking-widest font-bold text-neutral-500">In Stock Ready to Ship</span>
            </div>
          </div>

          <button 
            type="button"
            disabled={localUpdating}
            onClick={handleRemoveClick}
            className="w-6 h-6 sm:w-7 sm:h-7 inline-flex items-center justify-center rounded-full border border-neutral-100 bg-neutral-50/50 text-neutral-400 hover:text-black hover:bg-neutral-100 hover:border-neutral-200 transition-all duration-200 disabled:opacity-30 cursor-pointer shrink-0"
            title="Remove Item"
          >
            <span className="font-sans text-[11px] font-bold leading-none select-none">✕</span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-3 sm:mt-4 pt-2 sm:pt-4 border-t border-black/[0.03]">
          {sizeMatrix.length > 0 && (
            <div className="space-y-1">
              <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-neutral-400">Quick Switch Size</p>
              <div className="flex gap-1 flex-wrap">
                {sizeMatrix.map((size) => {
                  const isSelected = size.toLowerCase() === currentSize.toLowerCase();
                  return (
                    <button 
                      key={size}
                      type="button"
                      disabled={localUpdating}
                      onClick={() => handleSizeClick(size)}
                      className={`h-6 min-w-[24px] sm:h-7 sm:min-w-[28px] px-1 flex items-center justify-center text-[9px] sm:text-[10px] font-medium transition-all duration-200 rounded-sm border cursor-pointer ${
                        isSelected 
                          ? 'bg-black text-white border-black font-bold shadow-sm' 
                          : 'border-black/[0.06] text-black hover:border-black bg-white'
                      } disabled:opacity-40`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end w-full sm:w-auto shrink-0">
            <div className="space-y-1">
              <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-neutral-400">Quantity</p>
              <div className="flex items-center border border-black/[0.06] h-6 sm:h-7 px-1.5 gap-2 rounded-sm bg-white w-max select-none">
                <button 
                  type="button"
                  onClick={() => handleQuantityClick(-1)}
                  disabled={localUpdating || item.quantity <= 1}
                  className="text-[12px] sm:text-[14px] font-bold text-neutral-400 cursor-pointer disabled:opacity-30 hover:text-black transition-colors px-1"
                >
                  −
                </button>
                <span className="text-[10px] sm:text-[11px] font-bold text-black min-w-[12px] text-center">
                  {item.quantity}
                </span>
                <button 
                  type="button"
                  onClick={() => handleQuantityClick(1)}
                  disabled={localUpdating}
                  className="text-[12px] sm:text-[14px] font-bold text-neutral-400 cursor-pointer hover:text-black transition-colors px-1"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-neutral-400">Total Price</p>
              <div className="flex items-center gap-2 h-6 sm:h-7 bg-neutral-50 px-2 sm:px-3 rounded-sm border border-black/[0.02]">
                {hasDiscount && (
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through font-normal tracking-tight">
                    {(compareAtPrice * item.quantity).toFixed(2)}
                  </span>
                )}
                <p className={`text-[11px] sm:text-[13px] md:text-[14px] font-bold tracking-tight ${hasDiscount ? 'text-[#991b1b]' : 'text-black'}`}>
                  {(price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

        </div>
        
        {localUpdating && (
          <div className="absolute top-3 right-11 sm:top-4 sm:right-14 flex items-center gap-1.5 bg-black text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-medium tracking-wider uppercase shadow-sm transition-all">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-neutral-400 animate-ping"></span>
            <span>Updating Bag...</span>
          </div>
        )}

      </div>
    </div>
  );
}