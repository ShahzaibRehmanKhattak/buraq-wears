import React from 'react';

export default function GlobalLoading() {
  return (
    /* Adaptive background setup reads directly from the theme database configuration */
    <div 
      style={{ backgroundColor: "var(--bg-color)" }}
      className="min-h-[85vh] flex flex-col items-center justify-center gap-4 antialiased"
    >
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <div className="relative flex items-center justify-center">
        {/* Subtle spinning outer circle tracking meter using low-opacity primary brand color */}
        <div 
          style={{ borderColor: "var(--primary)" }}
          className="w-12 h-12 border opacity-10 rounded-full absolute"
        ></div>
        
        {/* Active spinning indicator driven by your primary theme selector */}
        <div 
          style={{ borderTopColor: "var(--primary)" }}
          className="w-12 h-12 border-t border-transparent rounded-full animate-spin"
        ></div>
        
        {/* Central store icon indicator updates to match active configuration */}
        <span 
          style={{ color: "var(--primary)" }}
          className="material-symbols-outlined text-[18px] absolute animate-pulse"
        >
          apparel
        </span>
      </div>

      <div className="text-center mt-2 space-y-1">
        {/* Title inherits primary layout color rules */}
        <h3 
          style={{ color: "var(--primary)" }}
          className="text-[14px] font-bold uppercase tracking-[0.25em]"
        >
          BURAQWEARS
        </h3>
        
        {/* Status text maps directly to studio secondary accent configurations */}
        <p 
          style={{ color: "var(--accent)" }}
          className="text-[9px] font-semibold uppercase tracking-[0.15em] animate-pulse"
        >
          Syncing Luxury Catalog...
        </p>
      </div>
    </div>
  );
}