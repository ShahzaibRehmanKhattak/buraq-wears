'use client';

import { Plus } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';

export const LimitedAvailability = () => {
  const { products } = useProducts();

  // Filter: Products with >= 20% discount
  const hotDeals = products?.filter(item => {
    if (!item.compare_at_price || item.compare_at_price <= item.price) return false;
    const discount = ((item.compare_at_price - item.price) / item.compare_at_price) * 100;
    return discount >= 20;
  }) || [];

  const mainDeal = hotDeals[0];
  const secondaryDeals = hotDeals.slice(1, 3);

  // Helper to generate slug URL
  const getProductUrl = (item) => {
    const title = item?.title || item?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${item?.id || 0}`;
  };

  if (hotDeals.length === 0) return null;

  return (
    <section className="py-32 bg-[#1a1c1c] text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div className="flex justify-between items-baseline mb-20">
          <div>
            <span className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Final Inventory</span>
            <h2 className="font-display text-[40px] md:text-[48px] uppercase leading-none">Limited Availability</h2>
          </div>
          <Link href="/shop" className="text-[11px] font-bold uppercase tracking-widest border-b border-white/20 pb-1 hover:border-white transition-all">
            Shop Archive Sale
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* LEFT: Main Large Deal */}
          {mainDeal && (
            <Link href={getProductUrl(mainDeal)} className="md:col-span-7 group cursor-pointer overflow-hidden relative block">
              <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
                <img alt={mainDeal.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={mainDeal.images?.[0] || mainDeal.image} />
              </div>
              <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest">
                Hot Discount / {Math.round(((mainDeal.compare_at_price - mainDeal.price) / mainDeal.compare_at_price) * 100)}% OFF
              </div>
              <div className="mt-8 flex justify-between items-end">
                <div>
                  <h3 className="font-display text-[24px] uppercase mb-2">{mainDeal.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-red-500 font-semibold text-xl">${mainDeal.price}</span>
                    <span className="text-white/40 line-through text-sm">${mainDeal.compare_at_price}</span>
                  </div>
                </div>
                <div className="hidden md:block bg-white text-black font-bold text-[10px] px-8 py-3 uppercase hover:bg-neutral-200 transition-colors">
                  View Product
                </div>
              </div>
            </Link>
          )}

          {/* RIGHT: Scrollable Side List */}
          <div className="md:col-span-5 h-auto md:h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="flex md:flex-col gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
              {secondaryDeals.map((item) => (
                <Link href={getProductUrl(item)} key={item.id} className="group cursor-pointer flex-shrink-0 w-[280px] md:w-full block">
                  <div className="flex gap-8">
                    <div className="w-2/5 aspect-[3/4] overflow-hidden bg-zinc-900 relative">
                      <img alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={item.images?.[0] || item.image} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Plus className="text-white" />
                      </div>
                    </div>
                    <div className="w-3/5 py-4">
                      <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">
                        -{Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100)}% Season End
                      </span>
                      <h4 className="text-[12px] font-bold uppercase mb-2 text-white/90 truncate">{item.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">${item.price}</span>
                        <span className="text-white/30 text-xs line-through">${item.compare_at_price}</span>
                      </div>
                      <span className="inline-block mt-6 text-[10px] font-bold uppercase text-white/50 border-b border-white/20 pb-1 group-hover:text-white transition-all">
                        Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};