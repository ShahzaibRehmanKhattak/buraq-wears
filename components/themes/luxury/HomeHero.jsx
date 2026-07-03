"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStoreModule } from '@/hooks/useStoreModule';

const HomeHero = () => {
  const hookResponse = useStoreModule("home");
  const loading = hookResponse?.loading;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
        console.error("Failed parsing home_carousel_slides:", err);
      }
    } else if (Array.isArray(rawSlides)) {
      slidesPool = rawSlides;
    }
  }

  if (slidesPool.length === 0) {
    slidesPool = [
      {
        title: "The Architecture of Silence",
        target_slug: "Autumn / Winter 2026",
        description: "Bespoke daily essential articles constructed from lightweight luxury weaves.",
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
        btn_text: "Shop Now",
        btn_url: "/collections/shirts",
        price: "180",
        compare_at_price: "240"
      },
      {
        title: "The Monolith Silhouette",
        target_slug: "NEW ARRIVALS",
        description: "Minimalist geometric cuts tailored for seamless seasonal transitions.",
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
        btn_text: "Discover",
        btn_url: "/collections/new-season",
        price: "160",
        compare_at_price: "200"
      },
      {
        title: "Minimal Utility Pack",
        target_slug: "LIMITED RUN",
        description: "Architectural storage design.",
        img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
        btn_text: "Explore",
        btn_url: "/collections/accessories",
        price: "120",
        compare_at_price: "150"
      }
    ];
  }

  const mainCarouselSlides = slidesPool;
  const secondaryCard = slidesPool[1] || slidesPool[0];
  const tertiaryCard = slidesPool[2] || slidesPool[0];

  const activeMainSlide = mainCarouselSlides[currentSlideIndex] || mainCarouselSlides[0];

  useEffect(() => {
    if (mainCarouselSlides.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % mainCarouselSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [mainCarouselSlides.length]);

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[520px]">
        <div className="lg:col-span-8 bg-[#23356f]/20 animate-pulse rounded-xl" />
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-[#23356f]/10 animate-pulse rounded-xl" />
          <div className="flex-1 bg-[#23356f]/10 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#1b284f] pt-4 pb-10 md:pt-6 md:pb-12 antialiased mt-25">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          
          {/* ─── LEFT SIDE: MAIN SLIDESHOW CARD ─── */}
          <div className="lg:col-span-8 bg-[#23356f]/10 rounded-2xl p-5 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[280px] md:min-h-[520px] border border-white/5">
            <div className="flex flex-row items-center justify-between h-full my-auto relative z-10 w-full gap-4">
              
              <div className="w-[62%] flex flex-col items-start justify-center">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-4">
                  <span className="text-[#00b4d8] text-[18px] md:text-[32px] font-bold tracking-tight leading-none">
                    20%
                  </span>
                  <span className="text-white/40 text-[8px] md:text-[11px] font-bold uppercase tracking-[0.2em] pt-0.5">
                    {activeMainSlide?.target_slug || "LIMITED RUN"}
                  </span>
                </div>

                <h1 className="text-white text-[14px] md:text-[36px] font-semibold tracking-tight uppercase leading-[1.2] mb-1.5 md:mb-4 line-clamp-2 md:line-clamp-none">
                  {activeMainSlide?.title}
                </h1>

                {activeMainSlide?.description && (
                  <p className="text-[10px] md:text-[13px] text-white/50 font-light leading-relaxed mb-3 md:mb-8 max-w-md line-clamp-2 md:line-clamp-none">
                    {activeMainSlide.description}
                  </p>
                )}

                <Link
                  href={activeMainSlide?.btn_url?.startsWith('/') ? activeMainSlide.btn_url : `/${activeMainSlide?.btn_url || 'collections'}`}
                  className="bg-[#1b284f] text-white text-[8px] md:text-[11px] font-semibold uppercase tracking-widest px-3.5 md:px-8 py-1.5 md:py-3.5 rounded-lg hover:bg-[#00b4d8] transition-colors duration-300 border border-white/10"
                >
                  {activeMainSlide?.btn_text || "Shop Now"}
                </Link>
              </div>

              {/* Image Container with Extended Fallback Keys */}
              <div className="w-[38%] h-[140px] md:h-[360px] relative flex items-center justify-center shrink-0">
                {mainCarouselSlides.map((slide, idx) => {
                  const resolvedImgSrc = slide.img || slide.image || slide.imageUrl || slide.image_url;
                  return (
                    <div
                      key={idx}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
                      style={{
                        opacity: idx === currentSlideIndex ? 1 : 0,
                        transform: idx === currentSlideIndex ? 'scale(1)' : 'scale(0.95)',
                        zIndex: idx === currentSlideIndex ? 2 : 0,
                        pointerEvents: idx === currentSlideIndex ? 'auto' : 'none'
                      }}
                    >
                      {resolvedImgSrc && (
                        <img
                          src={resolvedImgSrc}
                          alt={slide.title || "Hero banner element"}
                          className="max-w-full max-h-full object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.3)]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {mainCarouselSlides.length > 1 && (
              <div className="absolute bottom-3 left-5 md:bottom-8 md:left-12 flex gap-1.5 z-20">
                {mainCarouselSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentSlideIndex(dotIdx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      dotIdx === currentSlideIndex ? 'w-5 md:w-8 bg-[#00b4d8]' : 'w-1.5 md:w-2 bg-white/20'
                    }`}
                    aria-label={`Jump position index ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDE: COMPACT APP-STYLE HORIZONTAL SLIDER ─── */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none gap-3 md:gap-6 no-scrollbar pb-1 lg:pb-0 scroll-smooth">
            
            {/* Top Side Card */}
            <div className="flex-shrink-0 w-[72%] sm:w-[50%] lg:w-full snap-center bg-[#23356f]/10 rounded-2xl p-4 md:p-6 flex flex-row items-center justify-between group border border-white/5 relative overflow-hidden min-h-[110px] md:min-h-[248px]">
              <div className="flex flex-col justify-between h-full w-[62%] z-10">
                <div>
                  <h3 className="text-white text-[12px] md:text-[16px] font-semibold tracking-tight uppercase leading-snug line-clamp-1 md:line-clamp-2">
                    {secondaryCard.title}
                  </h3>
                  <p className="text-[10px] md:text-[12px] text-white/40 font-light mt-0.5 md:mt-1 line-clamp-1 md:line-clamp-2 leading-relaxed">
                    Exquisite performance silhouettes.
                  </p>
                </div>
                
                <div className="mt-1 md:mt-6">
                  <span className="text-[8px] md:text-[10px] text-white/30 uppercase tracking-widest font-medium block mb-0.5">Limited Offer</span>
                  <div className="flex items-baseline gap-1.5 md:gap-2">
                    <span className="text-white text-[13px] md:text-[18px] font-bold tracking-tight">${secondaryCard.price || "160"}</span>
                    <span className="text-white/20 text-[10px] md:text-[13px] line-through font-light">${secondaryCard.compare_at_price || "200"}</span>
                  </div>
                </div>
              </div>
              <div className="w-[34%] aspect-square lg:h-full flex items-center justify-center shrink-0 relative z-10">
                <img 
                  src={secondaryCard.img || secondaryCard.image || secondaryCard.imageUrl || secondaryCard.image_url} 
                  alt={secondaryCard.title || "Promotional collection display"}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Bottom Side Card */}
            <div className="flex-shrink-0 w-[72%] sm:w-[50%] lg:w-full snap-center bg-[#23356f]/10 rounded-2xl p-4 md:p-6 flex flex-row items-center justify-between group border border-white/5 relative overflow-hidden min-h-[110px] md:min-h-[248px]">
              <div className="flex flex-col justify-between h-full w-[62%] z-10">
                <div>
                  <h3 className="text-white text-[12px] md:text-[16px] font-semibold tracking-tight uppercase leading-snug line-clamp-1 md:line-clamp-2">
                    {tertiaryCard.title}
                  </h3>
                  <p className="text-[10px] md:text-[12px] text-white/40 font-light mt-0.5 md:mt-1 line-clamp-1 md:line-clamp-2 leading-relaxed">
                    Premium structural design drops.
                  </p>
                </div>
                
                <div className="mt-1 md:mt-6">
                  <span className="text-[8px] md:text-[10px] text-white/30 uppercase tracking-widest font-medium block mb-0.5">Limited Offer</span>
                  <div className="flex items-baseline gap-1.5 md:gap-2">
                    <span className="text-white text-[13px] md:text-[18px] font-bold tracking-tight">${tertiaryCard.price || "120"}</span>
                    <span className="text-white/20 text-[10px] md:text-[13px] line-through font-light">${tertiaryCard.compare_at_price || "150"}</span>
                  </div>
                </div>
              </div>
              <div className="w-[34%] aspect-square lg:h-full flex items-center justify-center shrink-0 relative z-10">
                <img 
                  src={tertiaryCard.img || tertiaryCard.image || tertiaryCard.imageUrl || tertiaryCard.image_url} 
                  alt={tertiaryCard.title || "Promotional items display"}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </section>
  );
};

export default HomeHero;