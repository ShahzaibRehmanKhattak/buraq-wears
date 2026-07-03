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
    <div className="group relative flex flex-row gap-4 md:gap-6 p-4 bg-white border border-slate-100 hover:border-slate-200/80 rounded-md transition-all duration-150 last:mb-0">
      
      {/* Product Image Frame - Low Radius Sharp Cut */}
      <div className="w-[80px] sm:w-[110px] md:w-[125px] aspect-[3/4] overflow-hidden bg-slate-50 shrink-0 rounded-sm relative border border-slate-100">
        <Link href={generateSlugUrl()} className="block w-full h-full cursor-pointer">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]" 
            src={displayImage} 
            alt={title}
          />
        </Link>

        {hasDiscount && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span className="bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>
      
      {/* Information Container */}
      <div className="flex-1 flex flex-col justify-between min-h-[110px] sm:min-h-[165px] pt-0.5">
        <div className="flex justify-between items-start gap-2 w-full relative">
          <div className="space-y-1">
            <h2 className="text-[12px] sm:text-[13px] md:text-[14px] font-bold tracking-wider uppercase text-[#1b284f] leading-tight">
              <Link href={generateSlugUrl()} className="hover:text-[#00b4d8] transition-colors block w-full text-inherit no-underline">
                {title}
              </Link>
            </h2>
            
            {/* Meta Tags - Flat Bordered Design */}
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold pt-0.5">
              <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-sm border border-slate-100">
                Color: <span className="text-[#1b284f] font-bold">{currentColor}</span>
              </span>
              <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-sm border border-slate-100">
                Size: <span className="text-[#1b284f] font-bold">{currentSize}</span>
              </span>

              {productInfo.sku && (
                <span className="text-slate-300 font-mono tracking-normal text-[9px] ml-1 hidden sm:inline">
                  SKU: {productInfo.sku}
                </span>
              )}
            </div>

            <div className="pt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#00b4d8]" />
              <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400">In Stock Ready to Ship</span>
            </div>
          </div>

          {/* Dismiss switch - Clean Low-Radius Box */}
          <button 
            type="button"
            disabled={localUpdating}
            onClick={handleRemoveClick}
            className="w-6 h-6 inline-flex items-center justify-center rounded-sm border border-slate-100 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors disabled:opacity-30 cursor-pointer shrink-0"
            title="Remove Item"
          >
            <span className="font-sans text-[9px] font-bold leading-none select-none">✕</span>
          </button>
        </div>
        
        {/* Bottom Panel Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-3 pt-3 border-t border-slate-50">
          
          {sizeMatrix.length > 0 && (
            <div className="space-y-1">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Quick Switch Size</p>
              <div className="flex gap-1 flex-wrap">
                {sizeMatrix.map((size) => {
                  const isSelected = size.toLowerCase() === currentSize.toLowerCase();
                  return (
                    <button 
                      key={size}
                      type="button"
                      disabled={localUpdating}
                      onClick={() => handleSizeClick(size)}
                      className={`h-6 min-w-[24px] sm:h-7 sm:min-w-[28px] px-1.5 flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-colors rounded-sm border cursor-pointer select-none ${
                        isSelected 
                          ? 'bg-[#1b284f] text-white border-[#1b284f]' 
                          : 'border-slate-200/60 text-slate-500 hover:border-[#1b284f] hover:text-[#1b284f] bg-white'
                      } disabled:opacity-40`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto shrink-0">
            
            {/* Quantity Controller Block */}
            <div className="space-y-1">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Quantity</p>
              <div className="flex items-center border border-slate-200/70 h-6 sm:h-7 px-1.5 gap-2 rounded-sm bg-white w-max select-none">
                <button 
                  type="button"
                  onClick={() => handleQuantityClick(-1)}
                  disabled={localUpdating || item.quantity <= 1}
                  className="text-[12px] sm:text-[14px] font-bold text-slate-400 cursor-pointer disabled:opacity-30 hover:text-[#1b284f] transition-colors px-1"
                >
                  −
                </button>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1b284f] min-w-[12px] text-center">
                  {item.quantity}
                </span>
                <button 
                  type="button"
                  onClick={() => handleQuantityClick(1)}
                  disabled={localUpdating}
                  className="text-[12px] sm:text-[14px] font-bold text-slate-400 cursor-pointer hover:text-[#1b284f] transition-colors px-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Output */}
            <div className="space-y-1 text-right">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Total Price</p>
              <div className="flex items-center gap-2 h-6 sm:h-7 bg-slate-50 px-2.5 rounded-sm border border-slate-100">
                {hasDiscount && (
                  <span className="text-[9px] sm:text-[10px] text-slate-400 line-through font-medium tracking-tight">
                    {(compareAtPrice * item.quantity).toFixed(2)}
                  </span>
                )}
                <p className={`text-[11px] sm:text-[13px] md:text-[14px] font-bold tracking-tight ${hasDiscount ? 'text-red-600' : 'text-[#1b284f]'}`}>
                  {(price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

        </div>
        
        {/* Sync Indicator Tag */}
        {localUpdating && (
          <div className="absolute top-3 right-10 flex items-center gap-1.5 bg-[#1b284f] border border-white/10 text-white px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-wider uppercase">
            <span className="w-1 h-1 bg-[#00b4d8]" />
            <span>Updating Bag...</span>
          </div>
        )}

      </div>
    </div>
  );
}