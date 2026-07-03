"use client";
import React, { useEffect, useRef, useState } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Heart, 
  Plus, 
  Globe, 
  ShieldCheck, 
  PenTool, 
  ArrowRight, 
  Store,
  Menu,
  X,
  LayoutGrid,
  Shirt,
  Layers,
  History
} from 'lucide-react';
import {getTheme} from "@/components/themes";
import { useProducts } from "@/hooks/useProducts";

const GlobalStyles = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      :root {
        /* Binds your database parameters flawlessly into internal variables */
        --primary: var(--primary, #000000);
        --on-surface-variant: var(--accent, #4c4546);
        --surface-container-low: #f3f3f4;
        --outline-variant: rgba(0,0,0,0.1);
        --error: #ba1a1a;
      }

      body {
        font-family: var(--font-stack, 'Inter', sans-serif);
        background-color: var(--bg-color, #f9f9f9);
        color: var(--primary);
        -webkit-font-smoothing: antialiased;
      }

      .font-display {
        font-family: var(--font-stack, 'Inter', sans-serif);
        font-weight: 700;
        letter-spacing: -0.04em;
      }

      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      
      .tap-scale { transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      .tap-scale:active { transform: scale(0.96); }
    `}</style>
  </>
);

export default function App() {
  const Theme = getTheme("premium"); // Dynamically switch between "default" and "luxury" themes based on user preference or context
  console.log("Theme object loaded:", Theme);
  const [activeCategory, setActiveCategory] = useState("");
  
  // Products hook dynamically fetches based on state, pills handle themselves!
  const { products, loading } = useProducts({ category: activeCategory });

  return (
    /* Selection highlight sets dynamically to your chosen primary theme color */
    <div className="antialiased overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--bg-color)] relative min-h-screen">
      <Theme.GlobalStyles />
      
      {/* LOCK THE CANVAS LAYER AWAY FROM CLICKS */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <Theme.BackgroundCanvas />
      </div>

      {/* LIFT THE MAIN CONTENT CLEARLY TO THE TOP LAYER */}
      <main className="relative pt-16 md:pt-0" style={{ zIndex: 50 }}>
        <Theme.Navbar />
        <Theme.HomeHero />
        
        <Theme.ProductSection 
          title=" Shop " 
          subtitle="Just landed in the studio"
          items={products} 
        />

      
        
        {/* <NewArrivals /> */}
        <Theme.TrustSignals />
        <Theme.PromoBanner />
        <Theme.NewsLetter/>
        <Theme.CountDown />
        <Theme.Testimonials />
        <Theme.PsychologicalNudge pageName="home" />
        <Theme.Footer />
      </main>
    </div>
  );
}