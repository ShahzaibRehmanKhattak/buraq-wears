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

import { CategoryPills } from '../components/CategoryPills';
import { Hero } from '../components/HomeHero';
import { ProductSection } from '@/components/ProductSection';
import { TrustSignals } from '@/components/TrustSignals';
import {LimitedAvailability} from '@/components/LimitedAvailability';
import {NewArrivals} from '@/components/NewArrival';
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
  const products = [
    { title: "Structured Wool Coat", price: "$485.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvOEfc39i_Ei4Vuvjmnz1BPC58Ft_6cLtRqiYvU6JYe5y30-CxO-Ta2fyVNiJc3oYsmcsrE45yLsPnLquCsGpDj70Ipcg2TXgAYk1Vh3tQ1mx6sqYuCpdjTXp1fsabvLFKOaqCWN5-0lxhqZUo5l_u3CTa9-FRdopBbKs8TbgHZMbFhqLuGd5xfMLyvz3E9thkEN6Wzxe_gLRfBNGLJPLR8igkCwFKcCLW5AAOu9RTUa8LnTwpmW9VF08glqyVI1c-a9e6B2Zp3g" },
    { title: "Essential Poplin Shirt", price: "$165.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyeqXCwW2IqpR-OoqnwmBuixJfS2pJoRS0JI3yt_hBnDfDEZ0gqu5Z2H09Bjg_mv4wrjQgb_sJj86BD7ILmjEftvSviT_3g2JBSv9yAo5OhlKN_qJamFeXblr5nN-LS7Nr-Ehi4WEvFwaPENhw2HCHinoAgipXp43MPo60zJyW410_pLiZ4vCDEyE8zSeLm5xPGmfX83DJVXTvMV9bqovYzRTuy6zwYH4B_-jYTGWRfuB2qLxgE51beelXq2uDnR0H9TgR6t0W1g" },
    { title: "Slim-Fit Slate Trousers", price: "$220.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf5aQI_LkR_tfjwb9F7Wn2qQjVQPLhFlAkCFaCzMzfjT4wiTrSZpilA7CY-N7ckP0Th5jw47SyQYPl7ETV328uAgo1vynf5360-sleJ2dQ0Kd1BMEDDpZm2V7qQlu99yTcJwC7C90k4F1JF43fZaQaSoseOQbfMfR5Ux05Lbz-iun_g9B5Tchp2fLlDaABcuZAcfdHO6f9s6H7V5bLx6h99qfOVMLBCvcEL9-9BJF245feaswbp3bMGCLTlgWHpRhOrAh7ThKfyg" },
    { title: "Pebbled Leather Tote", price: "$340.00", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQCdAB3qm4l5rqytSKoTtRZDn8-nWH26gE-zJL2VFm66x3ln_XoZVFKqkFB45yA5RWXdUmD2HJL2O_PUeHlJLUoCVGXQOINX6ugNmVOTazKEGcAfc9g3lFE6tqrXdo5wMaerxYVMKVg2tSjlXuWIyHlFVp2yYRJjQNwfEnHOQBfe49ijL9mGEakCbEosc2oO2VS_1A3bsRXiPBIB6ECY8syUsWqWUzOe28fct-OUagIl8biZ2MESLLxf07gVJ-hz_KoxCqrgM-jA" }
  ];

  return (
    <div className="antialiased overflow-x-hidden selection:bg-black selection:text-white">
      <GlobalStyles />
      <BackgroundCanvas />
  
      
      <main className="pt-16 md:pt-0">
        <Hero />
        
        <CategoryPills />

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

  
        <NewArrivals />
        <TrustSignals />
      </main>

   
    </div>
  );
}