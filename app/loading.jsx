import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[85vh] bg-[#fcfcfc] flex flex-col items-center justify-center text-[#111111] gap-4 font-sans antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <div className="relative flex items-center justify-center">
        {/* Subtle spinning outer circle tracking meter */}
        <div className="w-12 h-12 border border-black/[0.05] rounded-full absolute"></div>
        <div className="w-12 h-12 border-t border-black rounded-full animate-spin"></div>
        
        {/* Central store icon indicator */}
        <span className="material-symbols-outlined text-[18px] text-black absolute animate-pulse">
          apparel
        </span>
      </div>

      <div className="text-center mt-2 space-y-1">
        <h3 className="text-[14px] font-bold text-black uppercase tracking-[0.25em]">
          BURAQWEARS
        </h3>
        <p className="text-[9px] text-[#777777] font-semibold uppercase tracking-[0.15em] animate-pulse">
          Syncing Luxury Catalog...
        </p>
      </div>
    </div>
  );
}