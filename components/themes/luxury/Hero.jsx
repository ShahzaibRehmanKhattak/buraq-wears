"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useStoreModule } from '@/hooks/useStoreModule';

export default function Hero({ masterSlug = "about", targetSection = "shirts" }) {
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

  // Flat, minimal structural skeleton to prevent layout shift
  if (loading) {
    return (
      <div className="w-full h-[400px] sm:h-[480px] md:h-[540px] bg-slate-900 animate-pulse border-b border-slate-200/40" />
    );
  }

  return (
    <header className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] overflow-hidden flex items-center justify-center bg-slate-950 border-b border-slate-100">
      
      {/* BACKGROUND IMAGE - Controlled, high-end opacity setting */}
      <img 
        className="absolute inset-0 w-full h-full object-cover object-center select-none opacity-40 transition-transform duration-1000 ease-out" 
        alt={activeTitle ? `${activeTitle} Visual` : "Collection Context"} 
        src={activeImage}
        loading="eager"
      />
      
      {/* VIGNETTE CONTRAST OVERLAY - Crisp flat gradient map */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b284f]/40 via-[#1b284f]/60 to-[#1b284f]/90 z-10" />
      
      {/* CONTENT FRAMEWORK - Aligned, scannable text configurations */}
      <div className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto flex flex-col items-center gap-4 sm:gap-5">
        
        {/* Dynamic Context Tag - Premium minimalist pill design */}
        {targetSection && (
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white bg-[#1b284f]/80 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full select-none">
            {targetSection} context
          </span>
        )}

        {/* Dynamic Title - Flat, crisp typographic hierarchy */}
        {activeTitle && (
          <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold uppercase tracking-[0.18em] leading-tight max-w-2xl text-white">
            {activeTitle}
          </h1>
        )}
        
        {/* Dynamic Description - Clean, readable body prose */}
        {activeDescription && (
          <p className="text-[11px] sm:text-[12px] max-w-lg mx-auto text-slate-200/90 font-medium uppercase tracking-[0.12em] leading-relaxed text-center antialiased">
            {activeDescription}
          </p>
        )}

        {/* Dynamic Button - Perfectly rounded enterprise design button */}
        {activeBtnText && (activeBtnUrl || activeBtnText) && (
          <div className="pt-2">
            <Link 
              href={activeBtnUrl.startsWith('/') ? activeBtnUrl : `/${activeBtnUrl || activeBtnText.toLowerCase()}`}
              className="inline-flex items-center gap-2 h-10 px-5 bg-white text-[#1b284f] hover:bg-[#1b284f] hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-200 group rounded-xl"
            >
              <span>{activeBtnText}</span>
              <ArrowUpRight size={13} className="text-[#00b4d8] stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
        
      </div>
    </header>
  );
}