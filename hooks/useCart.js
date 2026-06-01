'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom toast notification microstate
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Self-cleaning toast alert display controller
  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 4500);
  };

  // 1. GET: Fetch active bag allocations from the updated clients pipeline path
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients/cart');
      
      // If the cookie is completely missing, reset local array states safely
      if (res.status === 401 || res.status === 403) {
        setCartItems([]);
        return;
      }

      const json = await res.json();
      if (json.success) {
        setCartItems(json.data || []);
      } else {
        throw new Error(json.error || "Failed to load active cart items.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync state truth maps on initial mount tracking
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 2. POST: Add Item / Upsert configuration handler
  const addItem = async (productId, quantity = 1, color = null, size = null) => {
    try {
      const existingItem = cartItems.find(item => 
        item.product_id === productId && 
        item.selected_color === color && 
        item.selected_size === size
      );

      const targetQuantity = existingItem ? existingItem.quantity + quantity : quantity;

      const res = await fetch('/api/clients/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          quantity: targetQuantity,
          selected_color: color,
          selected_size: size
        })
      });

      const json = await res.json();

      // Bulletproof Interception: Checks for standard 401 status OR a 400 containing unauthorized message text
      if (res.status === 401 || res.status === 403 || (json.error && json.error.includes("Unauthorized"))) {
        showToast("Please login or register an account to add items to your cart.");
        return { success: false, unauthorized: true };
      }

      if (!json.success) throw new Error(json.error);
      
      await fetchCart(); // Re-sync local values with DB state
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // 3. POST: Mutate quantities directly (+ / - buttons)
  const updateQuantity = async (cartItemId, targetQuantity) => {
    if (targetQuantity <= 0) {
      return removeItem(cartItemId);
    }

    try {
      const targetItem = cartItems.find(item => item.id === cartItemId);
      if (!targetItem) throw new Error("Target row mapping context unassigned.");

      const res = await fetch('/api/clients/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: targetItem.product_id,
          quantity: targetQuantity,
          selected_color: targetItem.selected_color,
          selected_size: targetItem.selected_size
        })
      });

      const json = await res.json();

      if (res.status === 401 || res.status === 403 || (json.error && json.error.includes("Unauthorized"))) {
        showToast("Authentication required. Please log in to make changes.");
        return { success: false, unauthorized: true };
      }

      if (!json.success) throw new Error(json.error);
      
      await fetchCart();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // 4. DELETE: Completely eliminate a product configuration row node
  const removeItem = async (cartItemId) => {
    try {
      const res = await fetch(`/api/clients/cart?id=${cartItemId}`, {
        method: 'DELETE'
      });

      const json = await res.json();

      if (res.status === 401 || res.status === 403 || (json.error && json.error.includes("Unauthorized"))) {
        showToast("Authentication required to complete operation.");
        return { success: false, unauthorized: true };
      }

      if (!json.success) throw new Error(json.error);
      
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Live calculated subtotal valuation properties
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const livePrice = item.products?.price || 0;
    return acc + (livePrice * item.quantity);
  }, 0);

  // Live item count accumulator tracking properties
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addItem,
      updateQuantity,
      removeItem,
      refreshCart: fetchCart,
      cartSubtotal,
      totalItemCount
    }}>
      {children}

      {/* 🥞 Embedded Keyframe Animation Style Element Block */}
      <style>{`
        @keyframes customSlideUp {
          0% {
            transform: translateY(24px) scale(0.96);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .native-toast-animate {
          animation: customSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Minimalist Notification Popup Nudge Box Panel */}
      {toast.visible && (
        <div className="native-toast-animate fixed bottom-6 right-6 z-[100000] bg-neutral-900 border border-neutral-800 text-white p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-sm">
          <p className="text-[11px] uppercase font-bold tracking-wider leading-relaxed text-neutral-300 flex-1">
            {toast.message}
          </p>
          <div className="flex gap-2 shrink-0 self-end sm:self-center">
            <a 
              href="/login" 
              className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-200 transition-colors rounded shadow-sm"
            >
              Sign In
            </a>
            <a 
              href="/register" 
              className="border border-neutral-700 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-800 transition-colors rounded"
            >
              Join
            </a>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

// Dedicated context consumption hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be executed cleanly within a bounded CartProvider canvas context.');
  }
  return context;
}