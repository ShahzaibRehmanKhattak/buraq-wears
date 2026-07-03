"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/FavoritesContext';
import { useCart } from '@/hooks/useCart';
import { getTheme } from "@/components/themes";

export default function WishlistPage() {
    const Theme = getTheme("default");
  const { favoriteItems: contextItems, loading: isLoading, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (contextItems) {
      setItems(contextItems);
    }
  }, [contextItems]);

  // ⚡ REMOVE HANDLER
  const handleRemoveFavorite = async (productData, fallbackRowId) => {
    // 1. Find the parent item row in our current list state
    const parentItem = items.find(i => i.id === fallbackRowId || i.products?.id === productData?.id);
    
    // 2. Get the absolute real product_id stored by Supabase
    const exactProductId = parentItem?.product_id || productData?.id;
    
    if (!exactProductId) {
      console.error("Cannot remove: unable to isolate a valid product identity.");
      return;
    }
    
    // UI Update: Instantly remove from screen view
    setItems(prev => prev.filter(item => item.id !== fallbackRowId && item.products?.id !== exactProductId));

    try {
      // Pass an object where 'id' matches the 'product_id' stored in context favorite rows
      await toggleFavorite({ ...productData, id: exactProductId });
    } catch (err) {
      console.error("Wishlist database deletion failed, rolling back:", err);
      if (contextItems) setItems(contextItems);
    }
  };

  // ⚡ BAG TRANSFER HANDLER
  const handleMoveToBag = async (item) => {
    // Read the exact product_id straight from the root database row item record
    const trueProductId = item?.product_id || item?.products?.id;
    const productData = item.products || {};
    
    if (!trueProductId) {
      console.error("Cannot move item to bag: Missing core product database keys.");
      return;
    }

    try {
      // 1. Resolve variant defaults strings cleanly
      const defaultColor = productData?.colors ? productData.colors.split(',')[0].trim() : "Standard";
      const defaultSize = productData?.sizes ? productData.sizes.split(',')[0].trim() : "Free Size";

      // 2. Add into active cart collection state table
      await addItem(trueProductId, 1, defaultColor, defaultSize);
      
      // 3. Clear from backend database favorites table instantly
      await toggleFavorite({ ...productData, id: trueProductId });

      // 4. Update core navbar checkout bag numbers dynamically
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }

      // 5. VISUAL PAUSE DELAY: Show the "Added to Bag" checked state before animating away
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== item.id));
      }, 1000);

    } catch (err) {
      console.error("Cross-context transition pipeline failure:", err);
      if (contextItems) setItems(contextItems);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pb-16 md:pb-0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        input:focus { outline: none !important; box-shadow: none !important; }
        .premium-scroll::-webkit-scrollbar { width: 4px; }
        .premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .premium-scroll::-webkit-scrollbar-thumb { background: rgba(17, 17, 17, 0.08); border-radius: 20px; }
      `}</style>

      <main className="pt-8 md:pt-20 pb-24 md:pb-32 px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="mb-8 md:mb-16 border-b border-black/[0.06] pb-4 md:pb-8">
          <h1 className="font-semibold text-[28px] md:text-[38px] uppercase tracking-[-0.02em] leading-none mb-2 text-black">Wishlist</h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">
            {items.length} {items.length === 1 ? 'Saved Selection' : 'Saved Selections'}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 lg:col-span-7 flex flex-col max-h-[640px] overflow-y-auto pr-4 premium-scroll">
            {isLoading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
                <span className="material-symbols-outlined text-[24px] animate-spin">refresh</span>
                <p className="text-[9px] font-bold uppercase tracking-widest">Querying Storage Matrix...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-neutral-400 border border-dashed border-neutral-200 rounded-sm">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-3">Your wishlist selection is empty</p>
                <Link href="/" className="text-[10px] bg-black text-white px-4 py-2 uppercase font-bold tracking-wider rounded-sm no-underline hover:bg-neutral-800 transition-colors">
                  Shop Collections
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <Theme.WishlistItem 
                  key={item.id} 
                  item={item} 
                  onRemove={handleRemoveFavorite}
                  onMoveToBag={handleMoveToBag}
                />
              ))
            )}
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-black/[0.04] p-6 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-3 pb-2 border-b border-black/[0.04]">Wishlist Curation</h2>
              <p className="text-[11px] text-neutral-500 leading-relaxed uppercase tracking-wide text-justify">
                Items saved inside your wishlist stage are synced to your account workspace securely. Transferring items to your active bag moves configurations into checking rows seamlessly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}