"use client";

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const NewsLetter = () => {
  return (
    <section className="mt-20 py-12 px-6 md:px-16 antialiased">
      <div className="max-w-[1440px] mx-auto">
        
        {/* ─── BANNER CONTAINER (RIGHT-ALIGNED ELEMENTS ON DESKTOP) ─── */}
        <div className="bg-[#1b284f] text-white rounded-xl p-8 md:p-12 lg:py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Text Block */}
          <div className="max-w-xl lg:flex-1">
            <h3 className="text-[22px] md:text-[28px] font-medium tracking-tight uppercase mb-2 leading-tight">
              Don't Miss Our Latest Trends & Offers
            </h3>
            <p className="text-white/60 text-[12px] font-normal tracking-wide">
              Sign up today to receive notifications about new collections and exclusive discounts.
            </p>
          </div>

          {/* Right Input Form Block (Perfect Side-Alignment) */}
          <div className="w-full lg:w-auto flex justify-end items-center lg:flex-1">
            <form 
              className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:max-w-md xl:max-w-lg" 
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                className="bg-white text-neutral-800 placeholder-neutral-400 px-5 py-3 text-[12px] tracking-wide rounded-lg focus:outline-none flex-grow" 
                placeholder="Enter your email address" 
                type="email" 
                required
              />
              <button className="bg-[#00b4d8] text-white hover:bg-white hover:text-[#1b284f] px-8 py-3 text-[11px] uppercase tracking-widest font-bold rounded-lg transition-all duration-300 whitespace-nowrap shrink-0">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* ─── 4-COLUMN SEAMLESS FEATURE FOOTER ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 px-2">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1b284f]/5 text-[#1b284f] rounded-lg shrink-0">
              <Truck size={22} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[12px] font-medium tracking-wide block text-neutral-900 uppercase">
                Free Delivery
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">
                On all orders across Pakistan
              </span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1b284f]/5 text-[#1b284f] rounded-lg shrink-0">
              <RotateCcw size={22} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[12px] font-medium tracking-wide block text-neutral-900 uppercase">
                Easy Returns
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">
                Hassle-free exchange policies
              </span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1b284f]/5 text-[#1b284f] rounded-lg shrink-0">
              <ShieldCheck size={22} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[12px] font-medium tracking-wide block text-neutral-900 uppercase">
                100% Secure Checkout
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">
                Your data is completely protected
              </span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1b284f]/5 text-[#1b284f] rounded-lg shrink-0">
              <Headphones size={22} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[12px] font-medium tracking-wide block text-neutral-900 uppercase">
                Dedicated Support
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">
                We are here to help anytime
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default NewsLetter;