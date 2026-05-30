// components/ProductDetails.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Heart, HelpCircle, ChevronLeft, ChevronRight, Sparkles, Shield, RefreshCw } from 'lucide-react';

export default function ProductDetails({ product }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Extract array fields directly from your exact DB columns safely
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=80"];

  // Helper function to safely split your comma-separated text fields into iterable UI chips
  const parseTextColumnToArray = (textValue) => {
    if (!textValue) return [];
    return textValue.split(',').map(item => item.trim()).filter(Boolean);
  };

  const dbColors = parseTextColumnToArray(product?.colors);
  const dbSizes = parseTextColumnToArray(product?.sizes);

  useEffect(() => {
    if (dbColors.length > 0) setSelectedColor(dbColors[0]);
    if (dbSizes.length > 0) setSelectedSize(dbSizes[0]);
  }, [product]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 xl:gap-x-16 items-start">
      
      {/* 📸 LEFT STAGE: Compact, Screen-Optimized Media Layout (6 of 12 columns) */}
      <div className="lg:col-span-6 w-full flex flex-col gap-3">
        
        {/* 🎯 FIXED SIZE VIEWPOT CONTAINER: Capped at 520px max height to prevent page stretching */}
        <div className="relative w-full max-h-[480px] lg:max-h-[520px] aspect-[4/5] md:aspect-[3/4] bg-[#F6F6F7] overflow-hidden rounded-lg border border-neutral-200/60 group select-none shadow-xs mx-auto">
          
          {/* Dynamic Badge Tag */}
          {product?.badge_text && (
            <span className="absolute top-3 left-3 z-20 bg-neutral-900 text-white font-bold text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-sm shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> {product.badge_text}
            </span>
          )}

          <img 
            alt={`${product?.title || 'Product'} View`} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102" 
            src={images[activeImgIndex]}
          />

          {/* Clean Action Navigation Sliders */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-neutral-200/60 shadow-xs hover:bg-white active:scale-95 z-20"
                aria-label="Previous slider slide"
              >
                <ChevronLeft className="w-4 h-4 text-neutral-800 stroke-[2.5]" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-neutral-200/60 shadow-xs hover:bg-white active:scale-95 z-20"
                aria-label="Next slider slide"
              >
                <ChevronRight className="w-4 h-4 text-neutral-800 stroke-[2.5]" />
              </button>

              {/* Slider Track Progress Overlay Bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/10 backdrop-blur-md px-2 py-1 rounded-full">
                {images.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-300 ${idx === activeImgIndex ? 'bg-white w-3' : 'bg-white/40 w-1'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Horizontal Miniature Display Grid Tracker (Sized down uniformly to match frame dimensions) */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2 w-full max-w-full">
            {images.map((imgUrl, idx) => {
              const isSelected = idx === activeImgIndex;
              return (
                <button 
                  key={idx} 
                  onClick={() => setActiveImgIndex(idx)}
                  className={`aspect-[4/5] md:aspect-[3/4] max-h-[85px] bg-[#F6F6F7] cursor-pointer overflow-hidden rounded border transition-all duration-200 focus:outline-none ${
                    isSelected 
                      ? 'border-neutral-900 ring-1 ring-neutral-900 opacity-100' 
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img alt="Gallery grid link" className="w-full h-full object-cover" src={imgUrl} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 📄 RIGHT STAGE: Info Grid Layout Spec Fields (6 of 12 columns) */}
      <div className="lg:col-span-6 w-full flex flex-col gap-5 lg:pl-2">
        
        {/* Brand & Title Node */}
        <div className="space-y-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            <span>{product?.brand || "Premium Collection"}</span>
            {product?.sub_category && (
              <>
                <span className="text-neutral-300 font-light">/</span>
                <span className="text-neutral-500">{product.sub_category}</span>
              </>
            )}
          </div>
          
          <h1 className="text-[24px] md:text-[28px] font-bold text-neutral-900 uppercase tracking-tight leading-tight font-display">
            {product?.title}
          </h1>

          <div className="flex items-baseline gap-3 pt-0.5">
            <span className="text-[22px] font-bold text-neutral-900">
              ${Number(product?.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product?.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
              <span className="text-[14px] text-neutral-400 line-through font-medium">
                ${Number(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-xs uppercase tracking-wider">
              {product?.availability || "In Stock"}
            </span>
          </div>
        </div>

        {/* Dynamic Comma-Separated Color Options Rendering */}
        {dbColors.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-neutral-900">
              <span>Finish Colorway</span>
              <span className="text-neutral-400 font-medium tracking-normal lowercase bg-neutral-100 px-2 py-0.5 rounded">
                {selectedColor}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-50 rounded-md border border-neutral-200/60">
              {dbColors.map((color) => {
                const isCurrent = selectedColor === color;
                const useHex = color.startsWith('#') ? color : color.toLowerCase();
                return (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-7 h-7 rounded-full border transition-all tap-scale ${
                      isCurrent ? 'border-neutral-900 ring-2 ring-offset-2 ring-neutral-900 scale-105' : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                    style={{ backgroundColor: useHex }}
                    title={color}
                  >
                    {isCurrent && <span className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full mix-blend-difference" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Comma-Separated Sizes Rendering */}
        {dbSizes.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-neutral-900">
              <span>Select Size Variant</span>
              <button className="text-neutral-500 hover:text-black transition-colors flex items-center gap-1 normal-case text-[11px] font-semibold">
                Size Guide <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {dbSizes.map((size) => {
                const isCurrent = selectedSize === size;
                return (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-[10px] font-bold uppercase border rounded-md tracking-wider transition-all tap-scale ${
                      isCurrent 
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs' 
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Center Buttons Set */}
        <div className="flex gap-2.5 pt-1">
          <button className="flex-grow bg-neutral-900 text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-md shadow-xs hover:bg-black transition-all tap-scale">
            ADD TO BAG
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)} 
            className="w-12 flex items-center justify-center border border-neutral-200 bg-white hover:bg-neutral-50 rounded-md transition-all tap-scale"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${isFavorite ? 'fill-red-500 stroke-red-500 text-red-500 scale-110' : 'text-neutral-700'}`} />
          </button>
        </div>

        {/* Dynamic Rich Text Metadata Accordions */}
        <div className="border-t border-neutral-200 pt-4 mt-1 space-y-4">
          {product?.short_description && (
            <p className="text-[13px] leading-relaxed text-neutral-600 font-medium">
              {product.short_description}
            </p>
          )}

          {product?.description && (
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">Product Story</h3>
              <p className="text-[12.5px] leading-relaxed text-neutral-500">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications Grid Display Block */}
          {product?.material || product?.warranty || product?.sku ? (
            <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/60 grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px]">
              {product.sku && (
                <div><span className="text-neutral-400 font-medium uppercase tracking-wider">SKU:</span> <span className="text-neutral-800 font-semibold">{product.sku}</span></div>
              )}
              {product.material && (
                <div><span className="text-neutral-400 font-medium uppercase tracking-wider">Material:</span> <span className="text-neutral-800 font-semibold">{product.material}</span></div>
              )}
              {product.warranty && (
                <div><span className="text-neutral-400 font-medium uppercase tracking-wider">Warranty:</span> <span className="text-neutral-800 font-semibold">{product.warranty}</span></div>
              )}
              {product.stock_qty !== undefined && (
                <div><span className="text-neutral-400 font-medium uppercase tracking-wider">Availability:</span> <span className="text-neutral-800 font-semibold">{product.stock_qty} Units left</span></div>
              )}
            </div>
          ) : null}

          {/* Workspace Standard Value Badges */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="border border-neutral-200/50 p-2 rounded-md bg-white flex flex-col items-center gap-0.5">
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-[8.5px] font-bold uppercase tracking-wide text-neutral-900">Secure Checkout</span>
            </div>
            <div className="border border-neutral-200/50 p-2 rounded-md bg-white flex flex-col items-center gap-0.5">
              <RefreshCw className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-[8.5px] font-bold uppercase tracking-wide text-neutral-900">Easy Returns</span>
            </div>
            <div className="border border-neutral-200/50 p-2 rounded-md bg-white flex flex-col items-center gap-0.5">
              <span className="text-[9.5px] font-bold text-neutral-800">{product?.weight || 'N/A'}</span>
              <span className="text-[8.5px] font-bold uppercase tracking-wide text-neutral-400">Net Weight</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}