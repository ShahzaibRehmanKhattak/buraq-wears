"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useStoreModule } from '@/hooks/useStoreModule';

export function Hero({ masterSlug = "about", targetSection = "shirts" }) {
  // 1. Fetch the structured response from your module hook
  const hookResponse = useStoreModule(masterSlug);
  const loading = hookResponse?.loading;

  // 2. Local variables for the UI
  let activeTitle = "";
  let activeDescription = "";
  let activeImage = "";
  let activeBtnText = "";
  let activeBtnUrl = "";

  // 3. Precision Extraction using your exact hook payload structure
  if (hookResponse && !loading) {
    // Grab the matrix string directly from the 'hero' block or 'raw' fallback
    const matrixString = hookResponse.hero?.matrix || hookResponse.raw?.standard_heroes_matrix;

    if (matrixString && typeof matrixString === 'string' && matrixString !== "[]") {
      try {
        const parsedMatrix = JSON.parse(matrixString);
        
        if (Array.isArray(parsedMatrix)) {
          // Find the exact object matching our target section (e.g., "shirts")
          const contentNode = parsedMatrix.find(
            item => String(item?.target_slug).toLowerCase() === String(targetSection).toLowerCase()
          );

          // Map the found data to our UI states
          if (contentNode) {
            activeTitle = contentNode.title || "";
            activeDescription = contentNode.description || "";
            activeImage = contentNode.img || contentNode.image || "";
            activeBtnText = contentNode.btn_text || "";
            activeBtnUrl = contentNode.btn_url || "";
          }
        }
      } catch (err) {
        console.error("Matrix extraction crash:", err);
      }
    }
  }

  // 4. Default Fallbacks (Only displays if the database array doesn't have the targetSection)
  if (!activeTitle) activeTitle = targetSection;
  if (!activeDescription) activeDescription = "Premium clothing collection frameworks designed for everyday utility.";
  if (!activeImage) activeImage = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop";

  // Prevent harsh layout shifts during initial data fetch
  if (loading) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-neutral-950 animate-pulse border-b border-neutral-200/40" />
    );
  }

  return (
    <header className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center bg-neutral-950 border-b border-neutral-200">
      
      {/* BACKGROUND IMAGE */}
      <img 
        className="absolute inset-0 w-full h-full object-cover object-center scale-100 transition-all duration-1000 ease-out select-none" 
        alt={activeTitle ? `${activeTitle} Visual` : "Collection Context"} 
        src={activeImage}
        loading="eager"
      />
      
      {/* VIGNETTE CONTRAST OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />
      
      {/* CONTENT FRAMEWORK */}
      <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto flex flex-col items-center gap-5 sm:gap-6">
        
        {/* Dynamic Context Tag */}
        {targetSection && (
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-neutral-300 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1 rounded-sm shadow-sm select-none">
            {targetSection} context
          </span>
        )}

        {/* Dynamic Title ("contact terminal") */}
        {activeTitle && (
          <h1 className="text-2xl sm:text-4xl md:text-[44px] font-bold uppercase tracking-[0.22em] leading-tight drop-shadow-md max-w-2xl text-white">
            {activeTitle}
          </h1>
        )}
        
        {/* Dynamic Description ("header content") */}
        {activeDescription && (
          <p className="text-[11px] sm:text-[12px] md:text-[13px] max-w-xl mx-auto text-neutral-200/90 font-medium uppercase tracking-[0.15em] leading-relaxed text-center antialiased">
            {activeDescription}
          </p>
        )}

        {/* Dynamic Button ("contact") */}
        {activeBtnText && (activeBtnUrl || activeBtnText) && (
          <div className="pt-2">
            <Link 
              href={activeBtnUrl.startsWith('/') ? activeBtnUrl : `/${activeBtnUrl || activeBtnText.toLowerCase()}`}
              className="inline-flex items-center gap-2 h-11 px-6 bg-white text-black hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-200 shadow-xl group rounded-sm"
            >
              <span>{activeBtnText}</span>
              <ArrowUpRight size={13} className="text-black transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
        
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
    </header>
  );
}