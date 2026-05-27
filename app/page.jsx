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
import {BackgroundCanvas} from '../components/BackgroundCanvas';

import { Hero } from '../components/HomeHero';
import { ProductSection } from '@/components/ProductSection';
import { TrustSignals } from '@/components/TrustSignals';
import {LimitedAvailability} from '@/components/LimitedAvailability';
import {NewArrivals} from '@/components/NewArrival';
import Footer from '@/components/Footer';
import Navbar  from '@/components/Navbar';
import { useProducts } from "@/hooks/useProducts";
import { CategoryPills } from "@/components/CategoryPills";

const GlobalStyles = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      :root {
        --primary: #000000;
        --on-surface-variant: #4c4546;
        --surface-container-low: #f3f3f4;
        --outline-variant: rgba(0,0,0,0.1);
        --error: #ba1a1a;
      }

      body {
        font-family: 'Inter', sans-serif;
        background-color: #f9f9f9;
        color: var(--primary);
        -webkit-font-smoothing: antialiased;
      }

      .font-display {
        font-family: 'Inter', sans-serif;
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
  const [activeCategory, setActiveCategory] = useState("");
  
  // Products hook dynamically fetches based on state, pills handle themselves!
  const { products, loading } = useProducts({ category: activeCategory });
return (
  <div className="antialiased overflow-x-hidden selection:bg-black selection:text-white relative min-h-screen">
    <GlobalStyles />
    
    {/* LOCK THE CANVAS LAYER AWAY FROM CLICKS */}
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <BackgroundCanvas />
    </div>

    {/* LIFT THE MAIN CONTENT CLEARLY TO THE TOP LAYER */}
    <main className="relative pt-16 md:pt-0" style={{ zIndex: 50 }}>
      <Navbar />
      <Hero />
      
      <CategoryPills 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      <ProductSection 
        title="New Arrivals" 
        subtitle="Just landed in the studio"
        items={products} 
      />

      <LimitedAvailability />
      
      <ProductSection 
        title="Trending Now" 
        subtitle="Most loved this week"
        items={products.slice().reverse()} 
      />

      {/* <NewArrivals /> */}
      <TrustSignals />
      <Footer />
    </main>
  </div>
);
}