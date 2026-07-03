"use client";

import React from 'react';
import { useCart } from '@/hooks/useCart'; 
import {getTheme} from "@/components/themes";
import { useRouter } from 'next/navigation';

export default function ShoppingBagPage() {
    const Theme = getTheme("luxury"); // Dynamically switch between "default" and "luxury" themes based on user preference or context
  const router = useRouter();
  const { 
    cartItems, 
    loading: isLoading, 
    updateQuantity, 
    updateSize, 
    removeItem, 
    cartSubtotal: subtotal, 
    totalItemCount: totalItemsCount,
    clearCart 
  } = useCart();

  const handleQuantityMutation = async (id, absoluteTargetQty, item) => {
    try { await updateQuantity(id, absoluteTargetQty); } catch (err) { console.error(err); }
  };

  const handleSizeMutation = async (item, targetSize) => {
    try { await updateSize(item, targetSize); } catch (err) { console.error(err); }
  };

  const handleRemoveItem = async (cartItemId) => {
    try { await removeItem(cartItemId); } catch (err) { console.error(err); }
  };

  const handleSuccessfulCheckout = async (orderId) => {
    if (clearCart) await clearCart();
    
    // Fixed: Using the correct function argument 'orderId' instead of the undefined 'result' object
    if (orderId) {
      router.push(`/my-orders/${orderId}`);
    } else {
      router.push('/my-orders');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pb-16 md:pb-0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <main className="pt-8 md:pt-20 pb-24 md:pb-32 px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="mb-8 md:mb-16 border-b border-black/[0.06] pb-4 md:pb-8">
          <h1 className="font-semibold text-[28px] md:text-[38px] uppercase tracking-[-0.02em] leading-none mb-2 text-black">Shopping Bag</h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">{totalItemsCount} Selection Items</p>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
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
                <Theme.CartItem 
                  key={item.id} item={item} 
                  onUpdateSize={handleSizeMutation} onUpdateQuantity={handleQuantityMutation} 
                  onRemove={handleRemoveItem} isUpdating={isLoading}
                />
              ))
            )}
          </div>

          <div className="col-span-12 lg:col-span-5">
            <Theme.OrderSummary 
              subtotal={subtotal} 
              isDisabled={cartItems.length === 0 || isLoading} 
              cartItems={cartItems}
              onOrderSuccess={handleSuccessfulCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}