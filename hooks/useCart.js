'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  // 🍞 Toast management trigger
  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 4500);
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients/cart');
      
      if (res.status === 401 || res.status === 403) {
        setCartItems([]);
        return;
      }

      const json = await res.json().catch(() => ({}));
      
      // If guest user session state matches safely exit without throwing crashes
      if (json.success === false && (json.error?.toLowerCase().includes('session') || json.error?.toLowerCase().includes('unauthorized'))) {
        setCartItems([]);
        return; 
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not fetch cart items.");
      }

      setCartItems(json.data || []);
    } catch (err) {
      console.error("Fetch cart error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1, color = null, size = null) => {
    try {
      const payload = {
        product_id: productId,
        quantity: Number(quantity) || 1,
        selected_color: color || "Standard",
        selected_size: size || "Free Size"
      };

      const res = await fetch('/api/clients/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json().catch(() => ({}));

      // Intercept authentication or session blocks instantly
      if (
        res.status === 401 || 
        res.status === 403 || 
        res.status === 400 ||
        json.error?.toLowerCase().includes('unauthorized') ||
        json.error?.toLowerCase().includes('session')
      ) {
        showToast("Please login or register an account to add items to your cart.");
        return { success: false, unauthorized: true };
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server returned code ${res.status}`);
      }
      
      await fetchCart();
      
      // ✨ SUCCESS TOAST: Notifies user of a successful cart addition
      showToast("Item successfully added to your shopping bag!");
      
      return { success: true };
    } catch (err) {
      console.error("Add item server error handled:", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateQuantity = async (cartItemId, targetQuantity) => {
    if (targetQuantity <= 0) {
      return removeItem(cartItemId);
    }

    const previousItems = [...cartItems];
    
    // Optimistic Update: Changes UI list instantly to stop layout refetch flashes
    setCartItems(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity: targetQuantity } : item
    ));

    try {
      const res = await fetch('/api/clients/cart', {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_item_id: cartItemId, 
          id: cartItemId,
          quantity: targetQuantity  
        })
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403 || json.error?.toLowerCase().includes('unauthorized')) {
        setCartItems(previousItems);
        showToast("Please login to update item quantities.");
        return { success: false, unauthorized: true };
      }

      if (!res.ok || !json.success) throw new Error(json.error || "Server parameters rejected.");
      return { success: true };
    } catch (err) {
      console.error("Quantity sync error:", err.message);
      setCartItems(previousItems); 
      return { success: false, error: err.message };
    }
  };

  const updateSize = async (item, newSize) => {
    const previousItems = [...cartItems];
    setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, selected_size: newSize } : i));

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

      const json = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403 || json.error?.toLowerCase().includes('unauthorized')) {
        setCartItems(previousItems);
        showToast("Please login to switch options.");
        return { success: false, unauthorized: true };
      }

      if (!res.ok || !json.success) throw new Error(json.error || "Server error.");
      return { success: true };
    } catch (err) {
      console.error("Size variant update sync error:", err.message);
      setCartItems(previousItems);
      return { success: false, error: err.message };
    }
  };

  const removeItem = async (cartItemId) => {
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));

    try {
      const res = await fetch(`/api/clients/cart?id=${cartItemId}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403 || json.error?.toLowerCase().includes('unauthorized')) {
        setCartItems(previousItems);
        showToast("Authentication required to remove items.");
        return { success: false, unauthorized: true };
      }

      if (!res.ok || !json.success) throw new Error(json.error || "Delete parameters rejected.");
      return { success: true };
    } catch (err) {
      setError(err.message);
      setCartItems(previousItems);
      return { success: false, error: err.message };
    }
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + ((item.products?.price || 0) * item.quantity), 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, loading, error, addItem, updateQuantity, updateSize, removeItem, refreshCart: fetchCart, cartSubtotal, totalItemCount, showToast
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
        /* ✨ FLOATING TOAST MOUNTED PERFECTLY AT BOTTOM-LEFT */
        <div className="native-toast-animate fixed bottom-6 left-6 z-[100000] bg-neutral-900 border border-neutral-800 text-white p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-sm text-left">
          <div className="flex-1">
            <p className="text-[11px] uppercase font-bold tracking-wider leading-relaxed text-neutral-300">
              {toast.message}
            </p>
          </div>
          
          {/* Only render action links if user is NOT authenticated */}
          {toast.message.toLowerCase().includes('login') && (
            <div className="flex gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
              <a href="/login" className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-200 transition-colors rounded shadow-sm no-underline inline-block">Sign In</a>
              <a href="/register" className="border border-neutral-700 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-800 transition-colors rounded no-underline inline-block">Join</a>
            </div>
          )}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be executed within a CartProvider.');
  }
  return context;
}