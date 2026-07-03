"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FeaturedEditorial() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[64px] pt-12 md:pt-[80px] pb-8 md:pb-[40px]">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 md:mb-12 border-b border-[#cfc4c5]/10 pb-6">
        <h2 className="text-xl md:text-[32px] font-semibold uppercase tracking-wider mb-2 md:mb-0">Limited Availability</h2>
        <a className="text-[12px] md:text-[14px] font-semibold uppercase tracking-widest text-[#4c4546] hover:text-[#000000] transition-colors flex items-center gap-2" href="#">
          View Boutique <ArrowRight size={16} />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[24px]">
        {/* Card 1 */}
        <div className="group relative overflow-hidden h-[300px] md:h-[450px] flex items-center justify-center bg-[#f3f3f4] product-card-shadow">
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnfXXJPHPbES_0IS86toBceaYe2AR0GPcjgHseBSNSuMyId-9-5jyAlfFzHZ4uhDoOmpO2pwft0QaGrJ8e0KdBRPZTHT_g9nT_oFSOURezjcz7M2N6Ai482ZPxhycL3Ug2zPigNDAQjFlkCWPNOz8VrNJDEjUpv8DPaA37b7YlM-r7rdRgjoHzuurAXUkWO5KoJyt5nIHwZf9AgfS9vK5YmdbXcBQ4HfcfT17IajqyGYab0puICMFiclfqwmNNlMjHYQy43fy50A" alt="Edition" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
          <div className="relative z-10 text-center text-white px-6 md:px-8">
            <span className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.3em] mb-2 md:mb-4 block opacity-80">Last 5 Pieces</span>
            <h3 className="text-lg md:text-[24px] font-semibold uppercase tracking-wide mb-4 md:mb-6">Tailored Evening Shirt</h3>
            <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-[#000000] text-[12px] md:text-[14px] font-semibold uppercase tracking-widest hover:bg-[#000000] hover:text-white transition-all duration-500">Shop Edition</button>
          </div>
        </div>
        {/* Card 2 */}
        <div className="group relative overflow-hidden h-[300px] md:h-[450px] flex items-center justify-center bg-[#f3f3f4] product-card-shadow">
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUtQl8-R9dyqbpBJGARC8e3lj0_KyviVXRZUARWqvFy90-k_cj2OGVyn8TV4nJRdHK-xSph2NnRFxEfjtGseTEMiKiWpYhswWAAlt8ceWoPq3NQJZqyWJQsPoTOSni6qw8Qgwwvr6-xnvsowo4fxd0XinE6k3lOXucopBWBR1Ey6BRM2Vkoawq5RfeUuC5nMLb5b4OznYg4he-S0m0p3Qb78ni_JYyXZde8ez9GDOEv5Syrv7nJ_D3AhBubkz1rft9mzrGJ5xtaw" alt="Edition" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
          <div className="relative z-10 text-center text-white px-6 md:px-8">
            <span className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.3em] mb-2 md:mb-4 block opacity-80">Limited Edition</span>
            <h3 className="text-lg md:text-[24px] font-semibold uppercase tracking-wide mb-4 md:mb-6">Midnight Silk Wrap</h3>
            <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-[#000000] text-[12px] md:text-[14px] font-semibold uppercase tracking-widest hover:bg-[#000000] hover:text-white transition-all duration-500">Shop Edition</button>
          </div>
        </div>
      </div>
    </section>
  );
}