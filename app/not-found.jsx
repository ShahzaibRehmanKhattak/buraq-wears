"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] bg-[#fcfcfc] flex flex-col items-center justify-center text-center px-4 py-8 font-sans antialiased w-full box-border">
      {/* Google Material Icons CDN Reference */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      {/* Professional minimalist icon signature */}
      <span className="material-symbols-outlined text-[36px] md:text-[40px] text-neutral-400 mb-3 font-light select-none">
        error_outline
      </span>

      {/* Main Error Headers */}
      <h1 className="text-[38px] sm:text-[48px] font-light text-black tracking-[0.08em] font-mono leading-none mb-2 select-none">
        404
      </h1>
      
      <h2 className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-3">
        Page Not Found
      </h2>
      
      {/* Responsive paragraph wrap constraints */}
      <p className="text-[11px] sm:text-[12px] text-[#777777] max-w-[260px] sm:max-w-xs font-light leading-relaxed mb-6 sm:mb-8">
        The destination item timeline, interface parameter, or user identity profile path you are attempting to trace does not exist.
      </p>

      {/* Fluid mobile stack sizing optimizations */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[260px] sm:max-w-[310px]">
        {/* ⚡ FIXED: Added explicit px-5 left/right padding to keep the text well spaced */}
        <button 
          onClick={() => router.push('/')} 
          className="h-10 sm:h-11 w-full px-5 bg-[#111111] text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-800 active:scale-[0.99] transition-all rounded-sm cursor-pointer whitespace-nowrap"
        >
          Go To Storefront
        </button>
        
        <button 
          onClick={() => router.back()} 
          className="h-10 sm:h-11 w-full px-5 bg-transparent border border-black/[0.12] text-black text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-black/[0.02] active:scale-[0.99] transition-all rounded-sm cursor-pointer whitespace-nowrap"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}