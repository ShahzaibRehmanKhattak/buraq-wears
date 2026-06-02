"use client";
import React from 'react';
import { useCart } from '@/hooks/useCart'; // Ensure this matches your actual context folder path
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';

export default function ShoppingBagPage() {
  // ✨ CONNECT DIRECTLY TO GLOBAL TRUTH MATRIX
  const { 
    cartItems, 
    loading: isLoading, 
    updateQuantity, 
    updateSize, 
    removeItem, 
    cartSubtotal: subtotal, 
    totalItemCount: totalItemsCount 
  } = useCart();

  // ⚡ STABLE QUANTITY MUTATION
  const handleQuantityMutation = async (id, absoluteTargetQty, item) => {
    try {
      // The CartItem component passes the calculated absolute value directly now
      await updateQuantity(id, absoluteTargetQty);
    } catch (err) {
      console.error("Quantity sync exception caught gracefully:", err);
    }
  };

  // ⚡ STABLE SIZE VARIANT MUTATION
  const handleSizeMutation = async (item, targetSize) => {
    try {
      await updateSize(item, targetSize);
    } catch (err) {
      console.error("Size variant mutation exception caught gracefully:", err);
    }
  };

  // ⚡ STABLE ELIMINATION DELEGATE
  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeItem(cartItemId);
    } catch (err) {
      console.error("Item removal exception caught gracefully:", err);
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

      {/* Layout Grid Area Workspace */}
      <main className="pt-8 md:pt-20 pb-24 md:pb-32 px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="mb-8 md:mb-16 border-b border-black/[0.06] pb-4 md:pb-8">
          <h1 className="font-semibold text-[28px] md:text-[38px] uppercase tracking-[-0.02em] leading-none mb-2 text-black">Shopping Bag</h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">{totalItemsCount} Selection Items</p>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Scrollable Main Segment Selection Stage */}
          <div className="col-span-12 lg:col-span-7 flex flex-col max-h-[640px] overflow-y-auto pr-4 premium-scroll">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
                <span className="material-symbols-outlined text-[24px] animate-spin">refresh</span>
                <p className="text-[9px] font-bold uppercase tracking-widest">Querying Inventory...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-neutral-400 border border-dashed border-neutral-200 rounded-sm">
                <p className="text-[11px] font-semibold uppercase tracking-widest">Your bag selection is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateSize={handleSizeMutation}
                  onUpdateQuantity={handleQuantityMutation} 
                  onRemove={handleRemoveItem}
                  isUpdating={isLoading}
                />
              ))
            )}
          </div>

          {/* Sidebar Area Column */}
          <div className="col-span-12 lg:col-span-5">
            <OrderSummary subtotal={subtotal} isDisabled={cartItems.length === 0 || isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}