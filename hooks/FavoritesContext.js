'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext(undefined);

export function FavoritesProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 4500);
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients/favorites');
      
      if (res.status === 401 || res.status === 403) {
        setFavoriteItems([]);
        return;
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error);

      setFavoriteItems(json.data || []);
    } catch (err) {
      console.error("Fetch favorites error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Helper to instantly see if a specific product is favorited
  const isFavorited = useCallback((productId) => {
    return favoriteItems.some(item => item.product_id === productId);
  }, [favoriteItems]);

  const toggleFavorite = async (product) => {
    const productId = product.id;
    const alreadySaved = isFavorited(productId);
    const previousFavorites = [...favoriteItems];

    // 🚀 OPTIMISTIC UPDATE: Change state immediately for instant UI feedback
    if (alreadySaved) {
      setFavoriteItems(prev => prev.filter(item => item.product_id !== productId));
    } else {
      setFavoriteItems(prev => [...prev, { product_id: productId, products: product }]);
    }

    try {
      const method = alreadySaved ? 'DELETE' : 'POST';
      const url = alreadySaved ? `/api/clients/favorites?product_id=${productId}` : '/api/clients/favorites';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: alreadySaved ? null : JSON.stringify({ product_id: productId })
      });

      const json = await res.json().catch(() => ({}));

      // Catch unauthorized guests
      if (res.status === 401 || json.error?.toLowerCase().includes('unauthorized')) {
        setFavoriteItems(previousFavorites); // Rollback
        showToast("Please login or register to save items to your favorites.");
        return { success: false, unauthorized: true };
      }

      if (!res.ok || !json.success) throw new Error(json.error);
      
      if (!alreadySaved) showToast("Added to your wishlist!");
      return { success: true };

    } catch (err) {
      console.error("Favorite toggle error:", err.message);
      setFavoriteItems(previousFavorites); // Rollback on hardware/server failure
      return { success: false, error: err.message };
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteItems, loading, toggleFavorite, isFavorited, showToast }}>
      {children}

      {toast.visible && (
        <div className="native-toast-animate fixed bottom-6 left-6 z-[100000] bg-neutral-900 border border-neutral-800 text-white p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-sm text-left">
          <div className="flex-1">
            <p className="text-[11px] uppercase font-bold tracking-wider leading-relaxed text-neutral-300">
              {toast.message}
            </p>
          </div>
          {toast.message.toLowerCase().includes('login') && (
            <div className="flex gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
              <a href="/login" className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-200 transition-colors rounded shadow-sm no-underline inline-block">Sign In</a>
              <a href="/register" className="border border-neutral-700 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-neutral-800 transition-colors rounded no-underline inline-block">Join</a>
            </div>
          )}
        </div>
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be executed within a FavoritesProvider.');
  }
  return context;
}