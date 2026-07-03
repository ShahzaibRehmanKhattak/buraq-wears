"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FeaturedEditorial() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 pt-12 md:pt-[64px] pb-8 md:pb-[32px]">
      
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 md:mb-8 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl md:text-[24px] font-extrabold uppercase tracking-wider text-[#1b284f]">
            Limited Availability
          </h2>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-1">
            Exclusive curated inventory segments
          </p>
        </div>
        <a 
          className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#00b4d8] transition-colors flex items-center gap-1.5 mt-3 sm:mt-0 group" 
          href="#"
        >
          View Boutique 
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Editorial Split Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        
        {/* Card 1 */}
        <div className="group relative overflow-hidden h-[320px] md:h-[420px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl">
          <img 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-102 opacity-85 group-hover:opacity-95" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnfXXJPHPbES_0IS86toBceaYe2AR0GPcjgHseBSNSuMyId-9-5jyAlfFzHZ4uhDoOmpO2pwft0QaGrJ8e0KdBRPZTHT_g9nT_oFSOURezjcz7M2N6Ai482ZPxhycL3Ug2zPigNDAQjFlkCWPNOz8VrNJDEjUpv8DPaA37b7YlM-r7rdRgjoHzuurAXUkWO5KoJyt5nIHwZf9AgfS9vK5YmdbXcBQ4HfcfT17IajqyGYab0puICMFiclfqwmNNlMjHYQy43fy50A" 
            alt="Edition Collection Frame" 
          />
          <div className="absolute inset-0 bg-[#1b284f]/20 group-hover:bg-[#1b284f]/35 transition-colors duration-500" />
          
          <div className="relative z-10 text-center text-white px-6 md:px-8 flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-2 bg-[#00b4d8] text-white px-3 py-1 rounded-full shadow-sm">
              Last 5 Pieces
            </span>
            <h3 className="text-lg md:text-[22px] font-bold uppercase tracking-wide mb-5 mt-2 drop-shadow-sm">
              Tailored Evening Shirt
            </h3>
            <button className="px-6 py-2.5 bg-white text-[#1b284f] text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#1b284f] hover:text-white transition-all duration-300 shadow-sm">
              Shop Edition
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden h-[320px] md:h-[420px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl">
          <img 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-102 opacity-85 group-hover:opacity-95" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUtQl8-R9dyqbpBJGARC8e3lj0_KyviVXRZUARWqvFy90-k_cj2OGVyn8TV4nJRdHK-xSph2NnRFxEfjtGseTEMiKiWpYhswWAAlt8ceWoPq3NQJZqyWJQsPoTOSni6qw8Qgwwvr6-xnvsowo4fxd0XinE6k3lOXucopBWBR1Ey6BRM2Vkoawq5RfeUuC5nMLb5b4OznYg4he-S0m0p3Qb78ni_JYyXZde8ez9GDOEv5Syrv7nJ_D3AhBubkz1rft9mzrGJ5xtaw" 
            alt="Edition Collection Frame" 
          />
          <div className="absolute inset-0 bg-[#1b284f]/20 group-hover:bg-[#1b284f]/35 transition-colors duration-500" />
          
          <div className="relative z-10 text-center text-white px-6 md:px-8 flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-2 bg-[#1b284f] border border-white/20 text-white px-3 py-1 rounded-full shadow-sm">
              Limited Edition
            </span>
            <h3 className="text-lg md:text-[22px] font-bold uppercase tracking-wide mb-5 mt-2 drop-shadow-sm">
              Midnight Silk Wrap
            </h3>
            <button className="px-6 py-2.5 bg-white text-[#1b284f] text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#1b284f] hover:text-white transition-all duration-300 shadow-sm">
              Shop Edition
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}