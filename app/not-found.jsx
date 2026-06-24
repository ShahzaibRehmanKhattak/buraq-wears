"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    /* Dynamic background injection via global token */
    <div 
      style={{ backgroundColor: "var(--bg-color)" }}
      className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-8 antialiased w-full box-border"
    >
      {/* Google Material Icons CDN Reference */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      {/* Icon color uses your secondary accent configuration token */}
      <span 
        style={{ color: "var(--accent)" }}
        className="material-symbols-outlined text-[36px] md:text-[40px] mb-3 font-light select-none"
      >
        error_outline
      </span>

      {/* Main Headers inherit primary studio colors */}
      <h1 
        style={{ color: "var(--primary)" }}
        className="text-[38px] sm:text-[48px] font-light tracking-[0.08em] font-mono leading-none mb-2 select-none"
      >
        404
      </h1>
      
      <h2 
        style={{ color: "var(--primary)" }}
        className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
      >
        Page Not Found
      </h2>
      
      {/* Description text matches your studio accent shade */}
      <p 
        style={{ color: "var(--accent)" }}
        className="text-[11px] sm:text-[12px] max-w-[260px] sm:max-w-xs font-light leading-relaxed mb-6 sm:mb-8"
      >
        The destination item timeline, interface parameter, or user identity profile path you are attempting to trace does not exist.
      </p>

      {/* Button action elements scaling with database variables */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[260px] sm:max-w-[310px]">
        
        {/* Primary Action Button: Filled with your Primary Color, Text matches Global Background */}
        <button 
          onClick={() => router.push('/')} 
          style={{ 
            backgroundColor: "var(--primary)", 
            color: "var(--bg-color)",
            borderRadius: "var(--radius)" // Bonus: matches your chosen corner style too!
          }}
          className="h-10 sm:h-11 w-full px-5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
        >
          Go To Storefront
        </button>
        
        {/* Secondary Action Button: Transparent with a subtle border using your Primary Color */}
        <button 
          onClick={() => router.back()} 
          style={{ 
            borderColor: "var(--primary)", 
            color: "var(--primary)",
            borderRadius: "var(--radius)",
            backgroundColor: "transparent"
          }}
          className="h-10 sm:h-11 w-full px-5 border text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[var(--primary)] hover:text-[var(--bg-color)] hover:bg-opacity-5 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}