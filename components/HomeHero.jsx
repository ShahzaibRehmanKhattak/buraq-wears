"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStoreModule } from '@/hooks/useStoreModule';

export const Hero = () => {
  // 1. Hook into your 'home' module configuration data
  const hookResponse = useStoreModule("home");
  const loading = hookResponse?.loading;

  // Track the active slide indexing for the Desktop presentation view
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // 2. Extract and compile the dynamic carousel slides array
  let slidesPool = [];

  if (hookResponse && !loading) {
    const rawSlides = hookResponse.raw?.home_carousel_slides || hookResponse.hero?.carousel;

    if (rawSlides && typeof rawSlides === 'string') {
      try {
        const parsed = JSON.parse(rawSlides);
        if (Array.isArray(parsed)) {
          slidesPool = parsed;
        }
      } catch (err) {
        console.error("Failed parsing home_carousel_slides string layout array:", err);
      }
    } else if (Array.isArray(rawSlides)) {
      slidesPool = rawSlides;
    }
  }

  // Fallback defaults if database column array is empty
  if (slidesPool.length === 0) {
    slidesPool = [
      {
        title: "The Architecture of Silence",
        target_slug: "Autumn / Winter 2026",
        description: "Bespoke daily essential articles constructed from lightweight luxury weaves.",
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
        btn_text: "Shop Collection",
        btn_url: "/collections/shirts"
      },
      {
        title: "The Monolith Collection",
        target_slug: "NEW SEASON",
        description: "Minimalist geometric silhouettes tailored for seamless seasonal adaptations.",
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
        btn_text: "Discover",
        btn_url: "/collections/new-season"
      }
    ];
  }

  const activeDesktopSlide = slidesPool[currentSlideIndex] || slidesPool[0];

  useEffect(() => {
    if (slidesPool.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slidesPool.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [slidesPool.length]);

  if (loading) {
    return (
      <div className="w-full h-[95vh] min-h-[650px] bg-neutral-950 animate-pulse" />
    );
  }

  return (
    <>
      {/* Dynamic Style Injection to safely hide scrollbars across browsers on mobile */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* ================= DESKTOP HERO SLIDESHOW ================= */}
      <section className="hidden md:block relative h-[95vh] min-h-[650px] w-full overflow-hidden bg-neutral-950">
        {slidesPool.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${slide.img || slide.image}')`,
              opacity: idx === currentSlideIndex ? 1 : 0,
              zIndex: idx === currentSlideIndex ? 1 : 0
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-10" />
        
        <div className="relative z-20 h-full flex flex-col justify-center items-center px-6 text-center text-white max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase mb-5 tracking-[0.3em]">
            {activeDesktopSlide?.target_slug || activeDesktopSlide?.subtitle || "COLLECTION FRAMEWORK"}
          </p>
          
          <h1 className="font-display text-[54px] lg:text-[76px] mb-5 max-w-4xl font-bold leading-[1.1] uppercase tracking-wide drop-shadow-sm whitespace-pre-line">
            {activeDesktopSlide?.title}
          </h1>

          {activeDesktopSlide?.description && (
            <p className="text-[12px] text-neutral-200 uppercase tracking-[0.18em] max-w-xl mx-auto mb-8 leading-relaxed antialiased">
              {activeDesktopSlide.description}
            </p>
          )}

          <div className="flex gap-4">
            <Link 
              href={activeDesktopSlide?.btn_url?.startsWith('/') ? activeDesktopSlide.btn_url : `/${activeDesktopSlide?.btn_url || 'collections'}`}
              className="bg-white text-black font-bold text-[11px] px-12 py-4.5 uppercase hover:bg-black hover:text-white border border-white transition-all duration-200 tracking-widest rounded-sm select-none"
            >
              {activeDesktopSlide?.btn_text || "Shop Collection"}
            </Link>
            <Link 
              href="/lookbook" 
              className="bg-transparent border border-white/30 text-white font-bold text-[11px] px-12 py-4.5 uppercase backdrop-blur-sm hover:bg-white/10 transition-all duration-200 tracking-widest rounded-sm"
            >
              Read Narrative
            </Link>
          </div>

          {slidesPool.length > 1 && (
            <div className="absolute bottom-10 flex gap-2.5 z-30">
              {slidesPool.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentSlideIndex(dotIdx)}
                  className={`h-1 transition-all duration-300 rounded-full ${dotIdx === currentSlideIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                  aria-label={`Go to slide track frame line point ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= MOBILE HERO SNAP CAROUSEL ================= */}
      <section className="md:hidden w-full py-6 bg-white overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-4 pb-2">
          {slidesPool.map((item, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-[85%] snap-center relative aspect-[4/5] max-h-[460px] rounded-lg overflow-hidden bg-neutral-900 shadow-md border border-neutral-100"
            >
              {/* Image Layout Layer */}
              <img 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.85] contrast-[1.05]" 
                src={item.img || item.image} 
                alt={item.title} 
                loading="lazy"
              />
              
              {/* Dynamic Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
              
              {/* Content Box */}
              <div className="absolute inset-0 p-5 z-20 flex flex-col justify-end items-start w-full">
                <span className="text-[9px] text-white/70 font-bold tracking-[0.2em] mb-1.5 uppercase block">
                  {item.target_slug || item.subtitle || "New Season"}
                </span>
                
                <h2 className="text-white font-bold text-xl leading-tight mb-2 uppercase tracking-wide line-clamp-2 max-w-full drop-shadow-sm">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="text-[10px] text-neutral-300 font-medium tracking-normal normal-case leading-normal mb-4 line-clamp-2 pr-2">
                    {item.description}
                  </p>
                )}
                
                <Link 
                  href={item.btn_url?.startsWith('/') ? item.btn_url : `/${item.btn_url || 'collections'}`}
                  className="bg-white text-black text-[10px] py-2.5 px-5 rounded-sm font-bold uppercase tracking-wider text-center shadow active:scale-95 transition-transform"
                >
                  {item.btn_text || "Discover"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};