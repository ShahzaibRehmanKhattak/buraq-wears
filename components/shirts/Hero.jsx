"use client";
import React from 'react';

export function Hero({ image,name,description }) {
  return (
    <header className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] overflow-hidden flex items-center justify-center bg-neutral-900">
      <img 
        className="absolute inset-0 w-full h-full object-cover object-center scale-100 transition-all duration-700 ease-out" 
        alt="Editorial fashion" 
        src={image || "/placeholder.jpg"}
      />
      
      {/* Editorial Vignette Overlay: Darkens the image slightly to make white text highly readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 z-10"></div>
      
      {/* Content Layer */}
      <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-[48px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] mb-4 drop-shadow-sm animate-fadeIn leading-tight">
          The {name} Collection
        </h1>
        <p className="text-xs sm:text-sm md:text-[18px] max-w-xl mx-auto opacity-90 font-light leading-relaxed tracking-wide">
          {description || "Essential silhouettes crafted from the world's finest linen, silk, and cotton poplin."}
        </p>
      </div>
    </header>
  );
}