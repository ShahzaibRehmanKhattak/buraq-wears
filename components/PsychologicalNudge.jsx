'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Palette, Layers, RefreshCw, ShoppingBag, Sparkles, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLookbook } from '@/hooks/useLookbook';

export const PsychologicalNudge = ({ currentProduct = null }) => {
  const { outfitCombinationsByPalette, palettes, loading } = useLookbook(currentProduct);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activePaletteId, setActivePaletteId] = useState('p1');
  const [currentToast, setCurrentToast] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  // 🔢 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const activeCluster = outfitCombinationsByPalette[activePaletteId];

  useEffect(() => {
    setCurrentPage(1);
  }, [activePaletteId]);

  useEffect(() => {
    if (!activeCluster && Object.keys(outfitCombinationsByPalette).length > 0) {
      setActivePaletteId(Object.keys(outfitCombinationsByPalette)[0]);
    }
  }, [outfitCombinationsByPalette, activeCluster]);

  // ⚡ Dynamic Slug Generator matching your platform's URL schema exactly
  const generateSlugUrl = (productItem) => {
    const title = productItem?.title || productItem?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${productItem?.id || 0}`;
  };

  // 🔔 Social-App Style Neat Notification Loop (Filtered only for hot deals & trending items)
  useEffect(() => {
    if (loading || Object.keys(outfitCombinationsByPalette).length === 0) return;

    const entranceTimer = setTimeout(() => {
      const keys = Object.keys(outfitCombinationsByPalette);
      const primaryGroup = outfitCombinationsByPalette[keys[0]];
      
      if (primaryGroup && primaryGroup.pairs?.[0]) {
        const shirt = primaryGroup.pairs[0].shirt;
        const trouser = primaryGroup.pairs[0].trouser;
        
        const isShirtHot = shirt.compare_at_price > shirt.price;
        const isTrouserHot = trouser.compare_at_price > trouser.price;

        // ONLY show if it matches your criteria: Hot Deal or Featured Trending look
        if (isShirtHot || isTrouserHot || shirt.is_featured || trouser.is_featured) {
          setCurrentToast({
            palette: primaryGroup.palette,
            shirt,
            trouser,
            isHotDeal: isShirtHot || isTrouserHot
          });
          setIsToastVisible(true);
        }
      }
    }, 5000);

    return () => clearTimeout(entranceTimer);
  }, [outfitCombinationsByPalette, loading]);

  const handleAddToCart = (e, productId, type = "single") => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Added product ${productId} (${type}) to shopping bag.`);
  };

  const handleAddBundleToCart = (shirtId, trouserId) => {
    alert(`Added matching combination bundle (Top: ${shirtId} + Bottom: ${trouserId}) to bag.`);
  };

  // 📊 Compute Active Paginated Slice Arrays
  const totalItems = activeCluster?.pairs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPairs = activeCluster?.pairs?.slice(indexOfFirstItem, indexOfLastItem) || [];

  return (
    <>
      {/* ─── PREMIUM APPS-STYLE TOAST NOTIFICATION ─── */}
      {currentToast && (
        <div 
          className={`fixed z-[99999] w-[92%] sm:w-[350px] bg-white/95 backdrop-blur-md border border-neutral-200 p-4 shadow-[0_15px_50px_rgba(0,0,0,0.08)] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform top-6 right-4 sm:right-6 rounded-xl border-l-4 ${
            currentToast.isHotDeal ? 'border-l-emerald-500' : 'border-l-black'
          } ${isToastVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
        >
          <div className="flex gap-3 items-start">
            <div className={`p-2 rounded-full shrink-0 ${currentToast.isHotDeal ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-50 text-neutral-800'}`}>
              {currentToast.isHotDeal ? <Flame size={14} className="animate-pulse" /> : <Sparkles size={14} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[8.5px] font-bold tracking-wider uppercase ${currentToast.isHotDeal ? 'text-emerald-600' : 'text-neutral-400'}`}>
                  {currentToast.isHotDeal ? '🔥 Limited Price Drop Match' : '🔥 Trending Style Combination'}
                </span>
                <button onClick={() => setIsToastVisible(false)} className="text-neutral-400 hover:text-black transition-colors">
                  <X size={12} />
                </button>
              </div>
              
              <p className="text-[11.5px] text-neutral-600 leading-normal">
                Combine the trending{' '}
                <Link href={generateSlugUrl(currentToast.shirt)} className="font-semibold text-black underline hover:text-neutral-600 transition-colors">
                  {currentToast.shirt.title}
                </Link>{' '}
                and matching{' '}
                <Link href={generateSlugUrl(currentToast.trouser)} className="font-semibold text-black underline hover:text-neutral-600 transition-colors">
                  {currentToast.trouser.title}
                </Link>
                .
              </p>
              
              <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-neutral-100 text-[9px]">
                <button 
                  onClick={() => { setIsToastVisible(false); setModalOpen(true); }} 
                  className="text-black font-bold tracking-wider uppercase hover:opacity-60 transition-opacity flex items-center gap-1"
                >
                  Explore Mix Studio <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING ACTION CONTROL ─── */}
      <button 
        onClick={() => setModalOpen(true)} 
        className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 uppercase text-[9px] font-bold tracking-[0.2em] hover:bg-neutral-900 transition-all duration-300 shadow-2xl flex items-center gap-2 rounded-full transform hover:scale-105"
      >
        <Palette size={11} /> Lookbook Studio
      </button>

      {/* ─── LOOKBOOK STUDIO CANVAS MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-xs p-2 md:p-4">
          <div className="bg-white w-full max-w-6xl h-[90vh] md:h-[85vh] border border-neutral-200/60 flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-xl">
            
            {/* SIDEBAR */}
            <div className="w-full md:w-56 bg-[#fcfcfc] border-b md:border-b-0 md:border-r border-neutral-200/60 p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-900 mb-1">Style Matrix</h3>
                  <p className="text-[9px] text-neutral-400 leading-relaxed">Smart multi-item setups coordinated automatically from active collections.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Aesthetic Archetypes</span>
                  <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    {palettes.map((palette) => (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setActivePaletteId(palette.id)}
                        className={`p-2 text-[9px] uppercase tracking-wider font-bold transition-all rounded-md flex items-center gap-2 w-full text-left border cursor-pointer shrink-0 md:shrink
                          ${activePaletteId === palette.id ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200/60 hover:bg-neutral-50'}`}
                      >
                        <span className="flex gap-0.5 shrink-0">
                          <span className="w-2 h-2 block border border-neutral-300" style={{ backgroundColor: palette.hexA }} />
                          <span className="w-2 h-2 block border border-neutral-300" style={{ backgroundColor: palette.hexB }} />
                        </span>
                        <span className="truncate flex-1">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[7.5px] font-mono text-neutral-300 tracking-widest hidden md:block border-t border-neutral-100 pt-2">IBNA ARCHITECT SYSTEM</div>
            </div>

            {/* MAIN WORKSPACE CANVAS */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              <div className="p-3 border-b border-neutral-100 flex justify-between items-center px-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Layers size={11} className="text-neutral-400" />
                  <h3 className="font-bold text-[9px] uppercase tracking-[0.15em] text-black">Curated Pair Coordinates</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black p-1 transition-colors"><X size={14} /></button>
              </div>

              {/* DYNAMIC VIEWPORT SCROLL SPACE */}
              <div className="flex-1 p-3 md:p-5 overflow-y-auto bg-[#fafafa] flex flex-col justify-between">
                <div>
                  {loading ? (
                    <div className="text-center text-neutral-400 text-[9px] uppercase tracking-widest py-20">
                      <RefreshCw size={12} className="animate-spin mx-auto text-neutral-300 mb-2" />
                      <span>Syncing lookbook matrix streams...</span>
                    </div>
                  ) : paginatedPairs.length > 0 ? (
                    <div className="max-w-5xl mx-auto">
                      
                      {/* INSTAGRAM-STYLE HORIZONTAL SLIDER FOR MOBILE / DUAL-COLUMN GRID FOR DESKTOP */}
                      <div className="flex overflow-x-auto pb-4 pt-1 gap-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 md:overflow-x-visible md:pb-0 md:gap-4">
                        {paginatedPairs.map((pair, index) => {
                          const shirtDiscount = pair.shirt.compare_at_price > pair.shirt.price;
                          const trouserDiscount = pair.trouser.compare_at_price > pair.trouser.price;
                          const hasHotDeal = shirtDiscount || trouserDiscount;
                          const trueIndex = indexOfFirstItem + index + 1;

                          return (
                            <div 
                              key={pair.id} 
                              className="w-[88%] sm:w-[48%] md:w-full shrink-0 snap-center bg-white border border-neutral-200 p-3.5 rounded-xl transition-all duration-300 hover:border-neutral-400 shadow-3xs flex flex-col justify-between group/row relative"
                            >
                              
                              {/* Header Label Bar */}
                              <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono font-bold bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded-sm">Look #{trueIndex}</span>
                                  {hasHotDeal && (
                                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tight flex items-center gap-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" /> Deal Active
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] font-mono font-bold text-neutral-900">
                                  ${(Number(pair.shirt.price) + Number(pair.trouser.price)).toFixed(2)}
                                </span>
                              </div>

                              {/* PAIR DISPLAY BLOCK */}
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                
                                {/* 👚 TOP (SHIRT) CARD */}
                                <div className="group/card cursor-pointer w-full border border-neutral-100/70 p-1.5 bg-white rounded-lg transition-all">
                                  <Link href={generateSlugUrl(pair.shirt)} className="block w-full text-inherit no-underline">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-1.5 rounded-md">
                                      {pair.shirt.images?.[0] ? (
                                        <img src={pair.shirt.images[0]} alt={pair.shirt.title} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-in-out" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[7px] text-neutral-400">No Img</div>
                                      )}
                                      
                                      {/* PERFECT BADGES */}
                                      <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
                                        <span className="bg-black text-white text-[6px] font-bold px-1.5 py-0.5 uppercase tracking-widest rounded-sm">Top</span>
                                        {shirtDiscount && (
                                          <span className="bg-emerald-600 text-white text-[5.5px] font-bold px-1.5 py-0.5 uppercase tracking-wide rounded-sm">OFF</span>
                                        )}
                                      </div>
                                      
                                      {/* Slide Up Overlay Hook */}
                                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent z-20 translate-y-3 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                                        <button onClick={(e) => handleAddToCart(e, pair.shirt.id, "Top")} className="w-full bg-white text-black text-[8.5px] font-bold py-1 uppercase hover:bg-black hover:text-white transition-colors rounded-sm shadow-sm">Shop Top</button>
                                      </div>
                                    </div>

                                    <h4 className="text-[9.5px] font-bold uppercase tracking-wider truncate text-neutral-800">{pair.shirt.title}</h4>
                                    
                                    {/* NEAT & CLEAN COLOR DISPLAY FIELD */}
                                    {pair.shirt.colors && (
                                      <p className="text-[8px] text-neutral-400 uppercase tracking-wide font-medium mt-0.5 truncate">
                                        Color: {pair.shirt.colors.split(',').join(' / ')}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-1 mt-1">
                                      <p className={`text-[9.5px] font-mono font-bold ${shirtDiscount ? 'text-emerald-600' : 'text-neutral-900'}`}>${Number(pair.shirt.price).toFixed(2)}</p>
                                      {shirtDiscount && <p className="text-[7.5px] text-neutral-400 line-through font-mono">${Number(pair.shirt.compare_at_price).toFixed(2)}</p>}
                                    </div>
                                  </Link>
                                </div>

                                {/* 👖 BOTTOM (TROUSER) CARD */}
                                <div className="group/card cursor-pointer w-full border border-neutral-100/70 p-1.5 bg-white rounded-lg transition-all">
                                  <Link href={generateSlugUrl(pair.trouser)} className="block w-full text-inherit no-underline">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-1.5 rounded-md">
                                      {pair.trouser.images?.[0] ? (
                                        <img src={pair.trouser.images[0]} alt={pair.trouser.title} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-in-out" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[7px] text-neutral-400">No Img</div>
                                      )}
                                      
                                      {/* PERFECT BADGES */}
                                      <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
                                        <span className="bg-neutral-800 text-white text-[6px] font-bold px-1.5 py-0.5 uppercase tracking-widest rounded-sm">Bottom</span>
                                        {trouserDiscount && (
                                          <span className="bg-emerald-600 text-white text-[5.5px] font-bold px-1.5 py-0.5 uppercase tracking-wide rounded-sm">OFF</span>
                                        )}
                                      </div>
                                      
                                      {/* Slide Up Overlay Hook */}
                                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent z-20 translate-y-3 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                                        <button onClick={(e) => handleAddToCart(e, pair.trouser.id, "Bottom")} className="w-full bg-white text-black text-[8.5px] font-bold py-1 uppercase hover:bg-black hover:text-white transition-colors rounded-sm shadow-sm">Shop Bottom</button>
                                      </div>
                                    </div>

                                    <h4 className="text-[9.5px] font-bold uppercase tracking-wider truncate text-neutral-800">{pair.trouser.title}</h4>
                                    
                                    {/* NEAT & CLEAN COLOR DISPLAY FIELD */}
                                    {pair.trouser.colors && (
                                      <p className="text-[8px] text-neutral-400 uppercase tracking-wide font-medium mt-0.5 truncate">
                                        Color: {pair.trouser.colors.split(',').join(' / ')}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-1 mt-1">
                                      <p className={`text-[9.5px] font-mono font-bold ${trouserDiscount ? 'text-emerald-600' : 'text-neutral-900'}`}>${Number(pair.trouser.price).toFixed(2)}</p>
                                      {trouserDiscount && <p className="text-[7.5px] text-neutral-400 line-through font-mono">${Number(pair.trouser.compare_at_price).toFixed(2)}</p>}
                                    </div>
                                  </Link>
                                </div>

                              </div>

                              {/* PREMIUM MINIMAL BUNDLE TRIGGER BUTTON (FIT-CONTENT) */}
                              <div className="w-full flex justify-center mt-auto pt-1">
                                <button 
                                  onClick={() => handleAddBundleToCart(pair.shirt.id, pair.trouser.id)}
                                  className="w-fit bg-black text-white px-4 py-2 text-[8px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-center gap-1.5 rounded-sm shadow-3xs"
                                >
                                  <ShoppingBag size={9} /> Add Full Look
                                </button>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-neutral-400 text-[8.5px] uppercase tracking-widest py-16 border border-dashed border-neutral-200 rounded-sm bg-white">No style pairings currently parsed.</div>
                  )}
                </div>

                {/* PAGINATION ANCHOR BLOCKS */}
                {totalPages > 1 && (
                  <div className="mt-6 border-t border-neutral-100 pt-4 flex items-center justify-center gap-2 px-4 shrink-0 bg-white">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-neutral-200 rounded-md text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 text-[9.5px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
                              currentPage === pageNum 
                                ? 'bg-black text-white border-black shadow-3xs' 
                                : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-neutral-200 rounded-md text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};