import React from 'react';
import { Search, ShoppingBag, Truck, ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { Hero } from '@/components/CollectionHero';

import { NewsLetter } from '@/components/NewsLetter';
const GlobalStyles = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>{`
      body { 
        font-family: 'Inter', sans-serif; 
        background-color: #f9f9f9;
        color: #1a1c1c;
      }
      .font-display { font-family: 'Inter', sans-serif; letter-spacing: -0.02em; }
    `}</style>
  </>
);




const CollectionSection = ({ title, description, image, linkText, reverse = false }) => (
  <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32 md:mb-48">
    <div className={`md:col-span-7 ${reverse ? 'order-1 md:order-2' : ''} aspect-[16/10] bg-zinc-100 overflow-hidden group`}>
      <img 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
        src={image} 
        alt={title} 
      />
    </div>
    <div className={`md:col-span-5 ${reverse ? 'order-2 md:order-1' : ''} flex flex-col justify-center`}>
      <h2 className="text-3xl font-semibold mb-6 text-black tracking-tight">{title}</h2>
      <p className="text-zinc-500 mb-8 leading-relaxed max-w-md">{description}</p>
      <a 
        className="inline-flex items-center gap-2 w-fit border-b border-black pb-1 text-[13px] uppercase font-bold tracking-wider hover:opacity-50 transition-opacity" 
        href="#"
      >
        {linkText}
      </a>
    </div>
  </section>
);

const CuratedCategories = () => (
  <section className="mt-32 mb-32">
    <div className="flex justify-between items-end mb-16 border-b border-zinc-200 pb-6">
      <h3 className="text-3xl font-bold text-black">Curated Categories</h3>
      <a className="text-[12px] font-bold uppercase tracking-widest border-b border-black" href="#">View All</a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: "Accessories", count: "128 Items", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn_WuGTplxg11BR_V6jhv-adaVfA0MqkkdlHS3M1QcZ2NpW1oDW6FoLQTHirIFwL3klQ5wkPM15Es4uT7tWshvA__ahs8aUijajWIa93_77AIkiBNQ0pa8SGmj8rsZZrMk6aq01A4hXvM3391YtOLHZwJO640bwNFtWkfxlpH8OdzqbkbpdsTuexSLbUpfWVflmb3GqNJvP24PP_F6dxVOu2XbtkX--lejzfVYOf0lSobP1y0B3Qp8YxqhtPaEOERfpUJKMeyCOQ" },
        { title: "New Arrivals", count: "42 Items", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj3S67TWsu4rQHKIGHD-Wxy1JQXnYoIwP9qIZNfGUv_eK_b2pByx6u5unuGM1GpB6GVCzVfszCXFgFmgHlW35pGb9kVbvQxuLRpW9ns4wu6GZOmugzVAz9ImQ8nlkHciGU5DrmvsKD68WEMWp0572ka0QJ24linfVA00M_54QvkgSxDxhAr8_A7ETw0lcj2ha_fN7Jq2PRuJ9wGTKoDk0QVvDz5MluRpAM_y2jd28H-Dft6AF3Wvn_KtOpFjDDYdZeASmKgKbBUQ" },
        { title: "Tailoring", count: "86 Items", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0Nz5ENJAlRBvU0KjnMZ7uQJmi7R29x6-kkK334vKEfj4fOQFRveHF1QIU18EbQJfsM4GK0cVmMqWubqsgEOj4__CxsqO6Ie_423yO6QplIBYxID0fATTDHtdG8O3qMkjbrK81tfloEz-8YPCyrHJ_k_-3b2fHZd6QfuXpuaZt3QsP2cu95IM_gU4ejJTB2dU79Zzzu_Tz3fRsJnETyJa0uk3mCMciJys6-APW9nYTk-a4YuO7oVp_AbSU6SBOl-_hzDfkEIOzAw" }
      ].map((cat, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="aspect-[3/4] bg-zinc-100 overflow-hidden mb-6">
            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" src={cat.img} alt={cat.title} />
          </div>
          <h4 className="text-xl font-semibold mb-2 text-black">{cat.title}</h4>
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{cat.count}</span>
        </div>
      ))}
    </div>
  </section>
);



const VisualFooter = () => (
  <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
    <img 
      alt="Luxury Editorial" 
      className="absolute inset-0 w-full h-full object-cover scale-110" 
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfZauzD3ioaPM70oY4Bjab4wesAaT2hjb6Kv7KtBxcXV2cUY_Lggkv3zdvX7ZIdxCguEPg8i4eETGawIfPdc62a6AR7q2y9Hu7wtVgK_HZv_dX5g_Q5FXhogERuwZ-rdL4UkqCfevcfkmFoZpc30HFht9Hy7n8b_6_XP-evw72M3D7BoWQ8gB3QvHvKR1vw3bWlEAOs-sk6P29azL_wpULd0Fsm0CHQ_fmx_S8jc4dNuYvUQrCRmA3amCjrsu-Jyq3uqUQxvtcA" 
    />
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="relative z-10 max-w-4xl px-8 text-center text-white">
      <h2 className="text-4xl md:text-6xl font-light mb-10 tracking-[0.3em] uppercase leading-tight">Elevate Your Perspective</h2>
      <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto italic opacity-80 font-light leading-relaxed">
        Experience the pinnacle of minimalist design and handcrafted luxury.
      </p>
      <a className="inline-block border border-white px-16 py-5 text-[12px] uppercase font-bold tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700 backdrop-blur-[2px]" href="#">
        Join IBNA
      </a>
    </div>
  </section>
);

export default function App() {
  return (
    <div className="antialiased mt-15 selection:bg-black selection:text-white bg-[#f9f9f9]">
      <GlobalStyles />
     

      <main className="max-w-7xl mx-auto px-6 md:px-16 pb-20 overflow-hidden">
        <Hero />

        <div className="space-y-0">
          <CollectionSection 
            title="The Atelier Series"
            description="Handcrafted garments focusing on the purity of the material. Each piece is a testament to the artisan's touch, designed for longevity."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDF9nwht5_xunCNrsQzRzgjhqOzZUfGSH4ebUAjmptpnGjUPyhV_du44lvn_ccTyHdUmUzhrvqzEy3_yXbhDGOnIlMQGNZMHqQHNoLGjQ1TXVepSloYZS_LpbDPsfO83TzN56S24in1mxPPznUCPLfMm1jNGHqmJv0WxyacFd46epHm3WOMtdMp13xiqVBOL-Mj_jzKsD7upu5av9d3PSdFczdhi_bVylqe9hsLPnZVJ2091LNICz7iekTEL6y8pvsVhimPAp8Xjw"
            linkText="Explore Series"
            reverse={true}
          />

          <CollectionSection 
            title="Elevated Basics"
            description="The foundation of the modern wardrobe. Reimagining essential silhouettes with premium textures and precise tailoring."
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAb1hfOXrAxOLppEQ1li4ey15i4rt7z_v8OnLP_ebWVGXZez_rOhInLAjfhD4l-SBWLBGYLI8X9ETrZ_mCKTRr5jl52fqfhL0jb0zX0YoJGegbrcACP5O3W8L4WkZv35xX1M9lSdwRFgS2FHMeECgdK-Mfnv9T9N5MYMxCmEDwqg1W-gydi-Nh0i1ElfWIWPelxkuRx-D3imXpotKCzTxJTUsZGHsx4BM-LoyX8k7IvHxU3uM2Kx2dNlV0JBil0nh3erraV6pR8ZQ"
            linkText="Shop Basics"
          />
        </div>

        <CuratedCategories />
        <NewsLetter />
      </main>

      <VisualFooter />

 
    </div>
  );
}