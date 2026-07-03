'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

const LimitedAvailability = () => {
  const { products } = useProducts();

  // Filter: Products with >= 20% discount
  const hotDeals = products?.filter(item => {
    if (!item.compare_at_price || item.compare_at_price <= item.price) return false;
    const discount = ((item.compare_at_price - item.price) / item.compare_at_price) * 100;
    return discount >= 20;
  }) || [];

  const mainDeal = hotDeals[0];
  const secondaryDeals = hotDeals.slice(1, 4);

  const getProductUrl = (item) => {
    const title = item?.title || item?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${item?.id || 0}`;
  };

  if (hotDeals.length === 0) return null;

  return (
    <section className="py-20 bg-[#1b284f] text-white antialiased">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* ─── MINIMALIST HEADER ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-6 mb-12 gap-4">
          <div>
            <span className="text-[#00b4d8] text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">
              Special Clearance
            </span>
            <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white leading-none">
              Limited Stock Drops
            </h2>
          </div>
          <Link 
            href="/shop" 
            className="text-[11px] font-medium tracking-wide text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
          >
            View All Deals <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* ─── CLEAN FLAT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT AREA: Flat Feature Card */}
          {mainDeal && (
            <div className="lg:col-span-7 bg-[#23356f]/20 rounded-xl p-6 flex flex-col justify-between group relative">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#23356f] mb-6">
                  <img 
                    alt={mainDeal.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]" 
                    src={mainDeal.images?.[0] || mainDeal.image} 
                  />
                  <div className="absolute top-4 left-4 bg-[#1b284f]/90 text-[#00b4d8] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
                    {Math.round(((mainDeal.compare_at_price - mainDeal.price) / mainDeal.compare_at_price) * 100)}% OFF
                  </div>
                </div>

                <div className="px-1">
                  <h3 className="text-lg font-medium tracking-wide text-white group-hover:text-[#00b4d8] transition-colors duration-200">
                    {mainDeal.title}
                  </h3>
                  <p className="text-[12px] text-white/50 font-normal mt-1 max-w-xl">
                    Premium quality craft pieces left over from our last limited edition seasonal catalog release.
                  </p>
                </div>
              </div>

              {/* ONE-SIDED SEAMLESS ACTION BAR */}
              <div className="mt-8 pt-5 border-t border-white/5 flex flex-row justify-between items-center px-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-white">${mainDeal.price}</span>
                  <span className="text-xs text-white/30 line-through">${mainDeal.compare_at_price}</span>
                </div>
                
                <Link 
                  href={getProductUrl(mainDeal)} 
                  className="bg-white text-[#1b284f] font-medium text-[11px] px-5 py-2.5 rounded hover:bg-[#00b4d8] hover:text-white transition-all duration-300"
                >
                  View Product
                </Link>
              </div>
            </div>
          )}

          {/* RIGHT AREA: Horizontal Mobile Touch Slider / Desktop Clean Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Flat design blocks with absolutely no shadows, no borders */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 lg:max-h-[460px] lg:overflow-y-auto scrollbar-none snap-x snap-mandatory">
              {secondaryDeals.map((item) => {
                const calculatedDiscount = Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100);
                
                return (
                  <Link 
                    href={getProductUrl(item)} 
                    key={item.id} 
                    className="group block bg-[#23356f]/15 hover:bg-[#23356f]/30 p-3 rounded-xl transition-all duration-300 min-w-[280px] sm:min-w-[320px] lg:min-w-full snap-start"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-16 aspect-[3/4] overflow-hidden bg-[#23356f] rounded-lg shrink-0">
                        <img 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                          src={item.images?.[0] || item.image} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
                        <div>
                          <span className="text-[#00b4d8] text-[9px] font-medium tracking-wide block mb-0.5">
                            Save {calculatedDiscount}%
                          </span>
                          <h4 className="text-[13px] font-medium text-white truncate">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mt-auto">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[14px] font-semibold text-white">${item.price}</span>
                            <span className="text-[11px] text-white/30 line-through">${item.compare_at_price}</span>
                          </div>
                          <span className="text-[11px] text-white/40 group-hover:text-white transition-colors">
                            Order →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ─── SIMPLE PAKISTANI CUSTOMER FRIENDLY NOTE ─── */}
            <div className="p-5 bg-[#23356f]/10 rounded-xl mt-2 lg:mt-0">
              <p className="text-[12px] text-white/70 leading-relaxed">
                <strong className="text-white font-medium block mb-1">Please Note:</strong>
                These are the last few items remaining in our stock. Orders are processed on a first-come, first-served basis. Add multiple items to your cart today to enjoy heavily discounted prices and **100% Free Delivery** across Pakistan.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LimitedAvailability;