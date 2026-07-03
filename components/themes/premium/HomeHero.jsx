"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { getTheme } from "@/components/themes";
// Import Core Swiper Styles
import "swiper/css";
import "swiper/css/pagination";

// Clean static metadata arrays matching your public assets
const FEATURE_DATA = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Free Shipping",
    description: "For all orders $200",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "1 & 1 Returns",
    description: "Cancellation after 1 day",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Secure Payments",
    description: "Guarantee secure payments",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "24/7 Dedicated Support",
    description: "Anywhere & anytime",
  },
];

export default function HomeHero() {
  const Theme = getTheme("premium"); // Dynamically switch between "default" and "luxury" themes based on user preference or context
  return (
    <section className="overflow-hidden pb-8 pt-12 bg-[#E5EAF4] font-sans antialiased">
      {/* FIX: Increased max-w to 1280px and reduced px-4/sm:px-8 down to px-2/sm:px-4 to let content stretch wide left-to-right */}
      <div className="max-w-[1280px] w-full mx-auto px-2 sm:px-4">
        <div className="flex flex-wrap lg:flex-nowrap gap-5">
          
          {/* ================= LEFT COLUMN: HERO CAROUSEL ================= */}
          <div className="xl:max-w-[840px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden min-h-[420px] flex items-center">
              
              {/* Geometric Layout Background Shape Asset */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="Hero structural geometry background"
                className="absolute right-0 bottom-0 top-0 h-full w-auto object-contain pointer-events-none -z-1 select-none"
                width={534}
                height={520}
                priority
              />

              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="hero-carousel w-full h-full flex items-center"
              >
                {/* Slide 1: Audio Asset Variant */}
                <SwiperSlide>
                  <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row px-10 py-6 justify-between w-full gap-6">
                    <div className="w-full sm:w-[55%] shrink-0 text-left flex flex-col justify-center">
                      
                      <div className="flex items-center gap-2 mb-4 select-none">
                        <span className="block font-extrabold text-5xl text-[#3b49df] tracking-tight leading-none">
                          30%
                        </span>
                        <span className="block text-[#3b49df] text-xs font-bold uppercase tracking-wider leading-tight whitespace-nowrap">
                          Sale<br />Off
                        </span>
                      </div>

                      <h1 className="font-bold text-dark text-xl sm:text-2xl lg:text-3xl mb-3 leading-snug">
                        <a href="#" className="hover:text-blue transition-colors">
                          True Wireless Noise Cancelling Headphone
                        </a>
                      </h1>

                      <p className="text-sm text-neutral-500 leading-relaxed max-w-[320px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis.
                      </p>

                      <div className="mt-6">
                        <a
                          href="#"
                          className="inline-flex items-center justify-center font-medium text-white text-xs rounded-lg bg-[#1d2746] py-3 px-8 transition-colors duration-200 hover:bg-blue shadow-sm tracking-wide"
                        >
                          Shop Now
                        </a>
                      </div>
                    </div>

                    <div className="w-full sm:w-[45%] flex justify-center items-center relative">
                      <Image
                        src="/images/hero/hero-01.png"
                        alt="True Wireless Headphone Display Asset"
                        width={320}
                        height={320}
                        className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain filter drop-shadow-sm"
                        priority
                      />
                    </div>
                  </div>
                </SwiperSlide>

                {/* Slide 2: Dynamic Curated Studio Monitor */}
                <SwiperSlide>
                  <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row px-10 py-6 justify-between w-full gap-6">
                    <div className="w-full sm:w-[55%] shrink-0 text-left flex flex-col justify-center">
                      
                      <div className="flex items-center gap-2 mb-4 select-none">
                        <span className="block font-extrabold text-5xl text-[#3b49df] tracking-tight leading-none">
                          15%
                        </span>
                        <span className="block text-[#3b49df] text-xs font-bold uppercase tracking-wider leading-tight whitespace-nowrap">
                          Hot<br />Deal
                        </span>
                      </div>

                      <h1 className="font-bold text-dark text-xl sm:text-2xl lg:text-3xl mb-3 leading-snug">
                        <a href="#" className="hover:text-blue transition-colors">
                          Acoustic Studio Wireless Over-Ear
                        </a>
                      </h1>

                      <p className="text-sm text-neutral-500 leading-relaxed max-w-[320px]">
                        Experience clean premium sound dynamics with isolated custom architecture acoustic pipelines.
                      </p>

                      <div className="mt-6">
                        <a
                          href="#"
                          className="inline-flex items-center justify-center font-medium text-white text-xs rounded-lg bg-[#1d2746] py-3 px-8 transition-colors duration-200 hover:bg-blue shadow-sm tracking-wide"
                        >
                          Shop Now
                        </a>
                      </div>
                    </div>

                    <div className="w-full sm:w-[45%] flex justify-center items-center relative">
                      <Image
                        src="/images/hero/hero-03.png"
                        alt="Acoustic Over-Ear Studio Monitor Asset"
                        width={320}
                        height={320}
                        className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain filter drop-shadow-sm"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PROMOTIONS SIDEBAR ================= */}
          <div className="xl:max-w-[420px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5 h-full justify-between">
              
              {/* Promotion Banner 1: iPhone Tier */}
              <div className="w-full relative rounded-[10px] bg-white p-6 flex-1 flex items-center border border-transparent hover:border-neutral-200/60 transition-all shadow-sm group cursor-pointer">
                <div className="flex justify-between items-center w-full gap-4">
                  <div className="flex flex-col justify-between h-full">
                    <h2 className="max-w-[160px] font-semibold text-dark text-base sm:text-lg leading-snug mb-6">
                      <a href="#" className="group-hover:text-blue transition-colors">
                        iPhone 14 Plus & 14 Pro Max
                      </a>
                    </h2>

                    <div>
                      <p className="font-medium text-neutral-400 text-xs uppercase tracking-wide mb-1 select-none">
                        limited time offer
                      </p>
                      <span className="flex items-baseline gap-2">
                        <span className="font-semibold text-xl text-[#ef4444] tracking-tight">
                          $699
                        </span>
                        <span className="font-medium text-sm text-neutral-300 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 relative w-[110px] h-[120px] flex items-center justify-center">
                    <Image
                      src="/images/hero/hero-02.png"
                      alt="iPhone Smart Hardware Series"
                      width={110}
                      height={140}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-103"
                    />
                  </div>
                </div>
              </div>

              {/* Promotion Banner 2: Alternative Audio Sub-Tier */}
              <div className="w-full relative rounded-[10px] bg-white p-6 flex-1 flex items-center border border-transparent hover:border-neutral-200/60 transition-all shadow-sm group cursor-pointer">
                <div className="flex justify-between items-center w-full gap-4">
                  <div className="flex flex-col justify-between h-full">
                    <h2 className="max-w-[160px] font-semibold text-dark text-base sm:text-lg leading-snug mb-6">
                      <a href="#" className="group-hover:text-blue transition-colors">
                        Wireless Headphone
                      </a>
                    </h2>

                    <div>
                      <p className="font-medium text-neutral-400 text-xs uppercase tracking-wide mb-1 select-none">
                        limited time offer
                      </p>
                      <span className="flex items-baseline gap-2">
                        <span className="font-semibold text-xl text-[#ef4444] tracking-tight">
                          $699
                        </span>
                        <span className="font-medium text-sm text-neutral-300 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 relative w-[110px] h-[120px] flex items-center justify-center">
                    <Image
                      src="/images/hero/hero-01.png"
                      alt="Wireless Personal Audio Hardware"
                      width={110}
                      height={140}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-103"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================= LOWER ASSURANCES ASSISTANCE FEATURES PANE ================= */}
      {/* FIX: Aligned the bottom assurances bar width with the new wider container format */}
      <div className="max-w-[1280px] w-full mx-auto px-2 sm:px-4 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/40 backdrop-blur-sm p-5 rounded-[10px] border border-white/20">
          {FEATURE_DATA.map((item, index) => (
            <div className="flex items-center gap-3" key={index}>
              <div className="shrink-0 relative w-8 h-8 flex items-center justify-center">
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <h3 className="font-semibold text-xs text-dark uppercase tracking-wide">{item.title}</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br></br>
      <br></br>
      <Theme.BrowseCategories /> {/* Dynamically render the BrowseCategories component from the selected theme */}
    </section>
  );
}