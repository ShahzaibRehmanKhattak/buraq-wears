'use client';

import React, { useState, useEffect } from 'react';
import { X, Palette, Layers, RefreshCw, ShoppingBag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLookbook } from '@/hooks/useLookbook';

const PsychologicalNudge = ({ currentProduct = null }) => {
  const { outfitCombinationsByPalette, palettes, loading } = useLookbook(currentProduct);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activePaletteId, setActivePaletteId] = useState('p1');
  const [currentToast, setCurrentToast] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  // 🔢 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Tightened density for refined enterprise rows

  const activeCluster = outfitCombinationsByPalette[activePaletteId];

  useEffect(() => {
    setCurrentPage(1);
  }, [activePaletteId]);

  useEffect(() => {
    if (!activeCluster && Object.keys(outfitCombinationsByPalette).length > 0) {
      setActivePaletteId(Object.keys(outfitCombinationsByPalette)[0]);
    }
  }, [outfitCombinationsByPalette, activeCluster]);

  // ⚡ Dynamic Slug Generator matching platform parameters
  const generateSlugUrl = (productItem) => {
    const title = productItem?.title || productItem?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${productItem?.id || 0}`;
  };

  // 🔔 Social-App Style Notification Loop
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
      {/* Immersive Keyframe Animation Injection */}
      <style>{`
        @keyframes luxurySlideUp {
          0% { transform: translateY(16px) scale(0.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .luxury-toast-entry { animation: luxurySlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* ─── PREMIUM DARK ENTERPRISE TOAST ALERT ─── */}
      {currentToast && isToastVisible && (
        <div className="luxury-toast-entry fixed bottom-20 left-6 z-[100000] bg-[#1b284f] border border-white/10 text-white p-3.5 rounded-xl shadow-[0_12px_40px_rgba(27,40,79,0.16)] flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-sm text-left antialiased">
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${currentToast.isHotDeal ? 'bg-amber-400 animate-pulse' : 'bg-[#00b4d8]'}`} />
              <span className="text-[9px] uppercase font-black tracking-widest text-neutral-300">
                {currentToast.isHotDeal ? 'Limited Curated Match' : 'Trending Architecture'}
              </span>
            </div>
            <p className="text-[12px] tracking-wide text-neutral-200 font-medium leading-normal">
              Combine the classic{' '}
              <Link href={generateSlugUrl(currentToast.shirt)} className="text-[#00b4d8] font-bold hover:underline transition-all">
                {currentToast.shirt.title}
              </Link>{' '}
              with the complementary{' '}
              <Link href={generateSlugUrl(currentToast.trouser)} className="text-[#00b4d8] font-bold hover:underline transition-all">
                {currentToast.trouser.title}
              </Link>.
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0 self-end sm:self-center mt-1 sm:mt-0">
            <button 
              onClick={() => { setIsToastVisible(false); setModalOpen(true); }} 
              className="bg-white text-[#1b284f] text-[9px] font-bold uppercase tracking-wider px-3 py-2 hover:bg-neutral-100 transition-colors rounded-lg shadow-sm cursor-pointer"
            >
              Mix Studio
            </button>
            <button 
              onClick={() => setIsToastVisible(false)} 
              className="bg-white/10 text-white/70 hover:text-white p-2 transition-colors rounded-lg border border-white/5 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ─── FLOATING CONTROL BUTTON ─── */}
      <button 
        onClick={() => setModalOpen(true)} 
        className="fixed bottom-6 right-6 z-50 bg-[#1b284f] text-white px-4 py-3 uppercase text-[10px] font-extrabold tracking-[0.15em] hover:bg-[#4f46e5] transition-all duration-300 shadow-[0_8px_24px_rgba(27,40,79,0.15)] flex items-center gap-2 rounded-xl active:scale-95 cursor-pointer"
      >
        <Palette size={13} className="text-[#00b4d8]" /> Lookbook Studio
      </button>

      {/* ─── LOOKBOOK STUDIO ACTIVE CANVAS MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 md:p-6 antialiased">
          <div className="bg-white w-full max-w-5xl h-[85vh] border border-neutral-200/60 flex flex-col md:flex-row shadow-[0_24px_64px_rgba(27,40,79,0.12)] overflow-hidden rounded-xl animate-in fade-in zoom-in-95 duration-300">
            
            {/* STYLED APP SIDEBAR */}
            <div className="w-full md:w-60 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200/60 p-4.5 flex flex-col justify-between shrink-0">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={12} className="text-[#4f46e5]" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#1b284f]">Style Matrix</h3>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-medium">
                    Automated coordinates synthesized across current brand drop archives.
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-bold uppercase tracking-widest text-neutral-400 block px-1">
                    Aesthetic Archetypes
                  </span>
                  <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    {palettes.map((palette) => (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setActivePaletteId(palette.id)}
                        className={`p-2.5 text-[10px] uppercase tracking-wider font-bold transition-all rounded-lg flex items-center gap-2.5 w-full text-left border cursor-pointer shrink-0 md:shrink
                          ${activePaletteId === palette.id 
                            ? 'bg-[#1b284f] text-white border-[#1b284f] shadow-sm' 
                            : 'bg-white text-neutral-600 border-neutral-200/50 hover:bg-neutral-100/50'}`}
                      >
                        <span className="flex gap-0.5 shrink-0 p-0.5 rounded-sm bg-neutral-100">
                          <span className="w-2.5 h-2.5 block rounded-xs border border-white/20 shadow-xs" style={{ backgroundColor: palette.hexA }} />
                          <span className="w-2.5 h-2.5 block rounded-xs border border-white/20 shadow-xs" style={{ backgroundColor: palette.hexB }} />
                        </span>
                        <span className="truncate flex-1 tracking-wide">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[8px] font-mono font-bold text-neutral-300 tracking-widest hidden md:block border-t border-neutral-200/40 pt-3">
                IBNA ARCHITECT SYSTEM
              </div>
            </div>

            {/* MAIN DATA WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              <div className="p-3.5 border-b border-neutral-100 flex justify-between items-center px-5 shrink-0">
                <div className="flex items-center gap-2">
                  <Layers size={13} className="text-[#4f46e5]" />
                  <h3 className="font-extrabold text-[10px] uppercase tracking-[0.15em] text-[#1b284f]">Curated Pair Coordinates</h3>
                </div>
                <button 
                  onClick={() => setModalOpen(false)} 
                  className="text-neutral-400 hover:text-[#1b284f] p-1.5 hover:bg-neutral-50 transition-all rounded-lg cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* VIEWPORT SCROLL PANEL */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-neutral-50/50 flex flex-col justify-between">
                <div>
                  {loading ? (
                    <div className="text-center text-neutral-400 text-[10px] uppercase tracking-widest py-24">
                      <RefreshCw size={14} className="animate-spin mx-auto text-[#4f46e5] mb-2.5" />
                      <span className="font-medium">Syncing lookbook matrix streams...</span>
                    </div>
                  ) : paginatedPairs.length > 0 ? (
                    <div className="max-w-5xl mx-auto">
                      
                      {/* TIGHT SYSTEMATIC ROW MATRIX */}
                      <div className="flex overflow-x-auto pb-4 pt-1 gap-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 md:overflow-x-visible md:pb-0 md:gap-5">
                        {paginatedPairs.map((pair, index) => {
                          const shirtDiscount = pair.shirt.compare_at_price > pair.shirt.price;
                          const trouserDiscount = pair.trouser.compare_at_price > pair.trouser.price;
                          const hasHotDeal = shirtDiscount || trouserDiscount;
                          const trueIndex = indexOfFirstItem + index + 1;

                          return (
                            <div 
                              key={pair.id} 
                              className="w-[88%] sm:w-[48%] md:w-full shrink-0 snap-center bg-white border border-neutral-200/60 p-3 rounded-xl transition-all duration-300 hover:border-neutral-300 shadow-[0_2px_8px_rgba(27,40,79,0.02)] flex flex-col justify-between group/row relative"
                            >
                              {/* Content Metadata Strip */}
                              <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-2.5 px-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono font-bold bg-[#1b284f]/5 text-[#1b284f] px-2 py-0.5 rounded-md">Look #{trueIndex}</span>
                                  {hasHotDeal && (
                                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" /> Offer Active
                                    </span>
                                  )}
                                </div>
                                <span className="text-[12px] font-black tracking-tight text-[#1b284f]">
                                  ${(Number(pair.shirt.price) + Number(pair.trouser.price)).toFixed(2)}
                                </span>
                              </div>

                              {/* CONDENSED MEDIA DUAL-GRID */}
                              <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                                
                                {/* SHIRT SEGMENT */}
                                <div className="group/card cursor-pointer w-full border border-neutral-100 p-1 bg-white rounded-lg transition-all hover:bg-neutral-50/40">
                                  <Link href={generateSlugUrl(pair.shirt)} className="block w-full text-inherit no-underline">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-1.5 rounded-md">
                                      {pair.shirt.images?.[0] ? (
                                        <img src={pair.shirt.images[0]} alt={pair.shirt.title} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-500 ease-out" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-400 font-bold uppercase">No Image</div>
                                      )}
                                      
                                      <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
                                        <span className="bg-[#1b284f] text-white text-[7px] font-black px-1.5 py-0.5 uppercase tracking-widest rounded-sm">Top</span>
                                        {shirtDiscount && (
                                          <span className="bg-emerald-600 text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm">Sale</span>
                                        )}
                                      </div>
                                      
                                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent z-20 translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                                        <button onClick={(e) => handleAddToCart(e, pair.shirt.id, "Top")} className="w-full bg-white text-[#1b284f] text-[8.5px] font-black py-1 uppercase hover:bg-[#4f46e5] hover:text-white transition-colors rounded-sm shadow-sm cursor-pointer">Shop Top</button>
                                      </div>
                                    </div>

                                    <div className="px-0.5">
                                      <h4 className="text-[10px] font-bold text-neutral-800 tracking-wide truncate">{pair.shirt.title}</h4>
                                      <div className="flex items-baseline gap-1.5 mt-0.5">
                                        <p className={`text-[10.5px] font-bold font-mono ${shirtDiscount ? 'text-emerald-600' : 'text-neutral-900'}`}>${Number(pair.shirt.price).toFixed(2)}</p>
                                        {shirtDiscount && <p className="text-[8px] text-neutral-400 line-through font-mono">${Number(pair.shirt.compare_at_price).toFixed(2)}</p>}
                                      </div>
                                    </div>
                                  </Link>
                                </div>

                                {/* TROUSER SEGMENT */}
                                <div className="group/card cursor-pointer w-full border border-neutral-100 p-1 bg-white rounded-lg transition-all hover:bg-neutral-50/40">
                                  <Link href={generateSlugUrl(pair.trouser)} className="block w-full text-inherit no-underline">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-1.5 rounded-md">
                                      {pair.trouser.images?.[0] ? (
                                        <img src={pair.trouser.images[0]} alt={pair.trouser.title} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-500 ease-out" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-400 font-bold uppercase">No Image</div>
                                      )}
                                      
                                      <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
                                        <span className="bg-neutral-800 text-white text-[7px] font-black px-1.5 py-0.5 uppercase tracking-widest rounded-sm">Bottom</span>
                                        {trouserDiscount && (
                                          <span className="bg-emerald-600 text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm">Sale</span>
                                        )}
                                      </div>
                                      
                                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent z-20 translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                                        <button onClick={(e) => handleAddToCart(e, pair.trouser.id, "Bottom")} className="w-full bg-white text-[#1b284f] text-[8.5px] font-black py-1 uppercase hover:bg-[#4f46e5] hover:text-white transition-colors rounded-sm shadow-sm cursor-pointer">Shop Bottom</button>
                                      </div>
                                    </div>

                                    <div className="px-0.5">
                                      <h4 className="text-[10px] font-bold text-neutral-800 tracking-wide truncate">{pair.trouser.title}</h4>
                                      <div className="flex items-baseline gap-1.5 mt-0.5">
                                        <p className={`text-[10.5px] font-bold font-mono ${trouserDiscount ? 'text-emerald-600' : 'text-neutral-900'}`}>${Number(pair.trouser.price).toFixed(2)}</p>
                                        {trouserDiscount && <p className="text-[8px] text-neutral-400 line-through font-mono">${Number(pair.trouser.compare_at_price).toFixed(2)}</p>}
                                      </div>
                                    </div>
                                  </Link>
                                </div>

                              </div>

                              {/* BUNDLE CONTEXT CONTROLLER */}
                              <div className="w-full flex justify-center mt-auto pt-0.5">
                                <button 
                                  onClick={() => handleAddBundleToCart(pair.shirt.id, pair.trouser.id)}
                                  className="w-full bg-[#1b284f] hover:bg-[#4f46e5] text-white py-2 text-[8.5px] font-bold uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
                                >
                                  <ShoppingBag size={10} /> Add Full Look
                                </button>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-neutral-400 text-[9px] uppercase tracking-widest py-20 border border-dashed border-neutral-200 rounded-xl bg-white font-medium">
                      No style pairings currently parsed.
                    </div>
                  )}
                </div>

                {/* SYSTEM PAGINATION STEPS */}
                {totalPages > 1 && (
                  <div className="mt-8 border-t border-neutral-100 pt-4 flex items-center justify-center gap-2 px-4 shrink-0 bg-transparent">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-neutral-200 rounded-lg text-neutral-600 bg-white hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-white transition-all cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                              currentPage === pageNum 
                                ? 'bg-[#1b284f] text-white border-[#1b284f] shadow-sm' 
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
                      className="p-1.5 border border-neutral-200 rounded-lg text-neutral-600 bg-white hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-white transition-all cursor-pointer"
                    >
                      <ChevronRight size={14} />
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

export default PsychologicalNudge;