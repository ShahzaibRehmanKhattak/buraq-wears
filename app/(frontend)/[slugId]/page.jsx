"use client";
import React from 'react';
import { useParams, useRouter, notFound } from 'next/navigation'; // ◄ FIXED: Added notFound import here
import { Loader2, ArrowLeft } from 'lucide-react';

import { useProductData } from '@/hooks/useProductData';
import ProductDetails from '@/components/ProductDetails';
import RelatedProducts from '@/components/RelatedProducts';
import { useCart } from '@/hooks/useCart';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background-color: #FAFAFA;
      color: #1A1A1A;
      -webkit-font-smoothing: antialiased;
    }
    .font-display { letter-spacing: -0.02em; }
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tap-scale { transition: transform 0.1s ease; }
    .tap-scale:active { transform: scale(0.98); }
  `}</style>
);

export default function ProductPage() {
  const { slugId } = useParams();
  const router = useRouter();
  
  const { product, relatedProducts, loading } = useProductData(slugId);
  const { addItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#FAFAFA]">
        <Loader2 className="w-5 h-5 text-neutral-800 animate-spin stroke-[1.5]" />
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400">Loading Product Workspace...</p>
      </div>
    );
  }

  // ⚡️ FIXED: Instead of rendering the raw "Item Signature Missing" text panel,
  // we now hand off control directly to your global Next.js not-found template!
  if (!product) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 antialiased pb-24">
      <GlobalStyles />

      {/* Corporate Dashboard Style Sub-Header Utility Strip */}
      <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2.5} /> Back to Collection
          </button>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 font-display">
            IBNA Atelier Suite
          </div>
        </div>
      </header>

      {/* Full-Width Presentation Layout Engine Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Pass down the addItem function seamlessly into details viewport mapping handles */}
        <ProductDetails product={product} onAddToCart={addItem} />

        <RelatedProducts items={relatedProducts} />

      </main>
    </div>
  );
}