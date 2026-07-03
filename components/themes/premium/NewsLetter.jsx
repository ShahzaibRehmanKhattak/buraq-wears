"use client";

import React from "react";
import Image from "next/image";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your subscription logic stream here
  };

  return (
    <section className="overflow-hidden py-12 bg-white font-poppins antialiased">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-0">
        <div className="relative z-1 overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          
          {/* ================= VISUAL BACKGROUND ASSETS ================= */}
          <Image
            src="/images/shapes/newsletter-bg.jpg"
            alt="background illustration"
            className="absolute -z-1 w-full h-full left-0 top-0 rounded-2xl object-cover pointer-events-none select-none"
            width={1170}
            height={200}
            priority
          />
          {/* Accent layer blending overlay */}
          <div className="absolute -z-1 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

          {/* ================= INTERACTIVE LAYOUT ROW ================= */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-6 sm:px-10 xl:pl-14 xl:pr-16 py-12">
            
            {/* Left Column: Heading Copy text */}
            <div className="max-w-[491px] w-full space-y-2">
              <h2 className="max-w-[420px] text-white font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
                Don&apos;t Miss Out Latest Trends & Offers
              </h2>
              <p className="text-white/80 text-sm font-normal tracking-wide">
                Register to receive news about the latest offers & discount codes.
              </p>
            </div>

            {/* Right Column: Dynamic Capture Form */}
            <div className="max-w-[477px] w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="Enter your email"
                    className="w-full bg-white/95 text-neutral-900 placeholder:text-neutral-400 text-sm border border-neutral-200/40 outline-none rounded-xl py-3 px-5 focus:bg-white focus:ring-2 focus:ring-[#3B51E3]/20 focus:border-[#3B51E3] transition-all duration-200 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center h-11 py-3 px-7 text-white bg-[#1b284f] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#3B51E3] transition-colors duration-200 active:scale-[0.98] shadow-md cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;