'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 4500);
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients/cart');
      
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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1, color = null, size = null) => {
    try {
      const res = await fetch('/api/clients/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
          selected_color: color,
          selected_size: size
        })
      });

      if (res.status === 401 || res.status === 403) {
        showToast("Please login or register an account to add items to your cart.");
        return { success: false, unauthorized: true };
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      await fetchCart();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateQuantity = async (cartItemId, targetQuantity) => {
    if (targetQuantity <= 0) {
      return removeItem(cartItemId);
    }

    try {
      // ✨ COMPATIBILITY FIX: Pass fallback 'id' along with 'cart_item_id' to satisfy both strict routing logic points
      const res = await fetch('/api/clients/cart', {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_item_id: cartItemId, 
          id: cartItemId,
          quantity: targetQuantity  
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      await fetchCart(); // Sync context state cleanly
      return { success: true };
    } catch (err) {
      console.error("Quantity sync error:", err.message);
      return { success: false, error: err.message };
    }
  };

  // ✨ ADDED: Core contextual implementation for updating structural variant options safely via POST intercept logic
  const updateSize = async (item, newSize) => {
    try {
      const res = await fetch('/api/clients/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          cart_item_id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          selected_color: item.selected_color,
          selected_size: newSize,
          actionType: 'absolute',
          isAbsolute: true
        })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error("Size variant update sync error:", err.message);
      return { success: false, error: err.message };
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const res = await fetch(`/api/clients/cart?id=${cartItemId}`, {
        method: 'DELETE'
      });

      if (res.status === 401 || res.status === 403) {
        showToast("Authentication required to complete operation.");
        return { success: false, unauthorized: true };
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const cartSubtotal = cartItems.reduce((acc, item) => {
    const livePrice = item.products?.price || 0;
    return acc + (livePrice * item.quantity);
  }, 0);

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addItem,
      updateQuantity,
      updateSize, // Provided to stop parent component lookup crashes
      removeItem,
      refreshCart: fetchCart,
      cartSubtotal,
      totalItemCount
    }}>
      {children}

      <style>{`
        @keyframes customSlideUp {
          0% { transform: translateY(24px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .native-toast-animate { animation: customSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {toast.visible && (
        <div className="native-toast-animate fixed bottom-6 right-6 z-[100000] bg-neutral-900 border border-neutral-800 text-white p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-sm">
          <p className="text-[11px] uppercase font-bold tracking-wider leading-relaxed text-neutral-300 flex-1">
            {toast.message}
          </p>
          <div className="flex gap-2 shrink-0 self-end sm:self-center">
            <a href="/login" className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-200 transition-colors rounded shadow-sm">Sign In</a>
            <a href="/register" className="border border-neutral-700 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-800 transition-colors rounded">Join</a>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be executed cleanly within a bounded CartProvider canvas context.');
  }
  return context;
}