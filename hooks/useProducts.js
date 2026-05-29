"use client";

import { useState, useEffect, useCallback } from "react";

export function useProducts({ category = "", search = "", limit = 12 } = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const batchSize = Number(limit) || 12;

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      // 🎯 FORCE TRIGGER THE LOADING EFFECT IMMEDIATELY
      setLoading(true);
      setError(null);
      setHasMore(true);

      try {
        const params = new URLSearchParams();
        
        // 🎯 MAP FRONTEND KEYS TO BACKEND SCHEMA: 
        // If 'category' exists, map it to 'category_id' which your database/API expects
        if (category) {
          params.append("category_id", category.toLowerCase().trim());
        }
        
        if (search) {
          params.append("search", search.trim());
        }

        // Setup base pagination range
        params.append("from", "0");
        params.append("to", String(batchSize - 1));

        const [filteredRes, masterRes] = await Promise.all([
          fetch(`/api/clients/products?${params.toString()}`),
          fetch("/api/clients/products") // Static backend unique categories collector
        ]);

        const filteredJson = await filteredRes.json();
        const masterJson = await masterRes.json();

        if (!filteredJson.success) throw new Error(filteredJson.error || "Failed filtering archives");
        if (!masterJson.success) throw new Error(masterJson.error || "Failed indexing global metrics");

        if (isMounted) {
          setProducts(filteredJson.data || []);
          
          if ((filteredJson.data || []).length < batchSize) {
            setHasMore(false);
          }

          // Gather unique categories dynamically from the complete stock response list
          const uniqueCats = [
            ...new Set(masterJson.data?.map((p) => p.category_id || p.category).filter(Boolean))
          ];
          setCategories(uniqueCats);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isMounted = false;
    };
    // 🎯 RE-RUN ON PREDICTABLE CHANGES (Primitives, not an unstable object reference)
  }, [category, search, batchSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const fromIndex = products.length;
      const toIndex = fromIndex + batchSize - 1;

      const params = new URLSearchParams();
      if (category) params.append("category_id", category.toLowerCase().trim());
      if (search) params.append("search", search.trim());
      
      params.append("from", String(fromIndex));
      params.append("to", String(toIndex));

      const res = await fetch(`/api/clients/products?${params.toString()}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Failed parsing next chunk");

      if (json.data && json.data.length > 0) {
        setProducts((prev) => [...prev, ...json.data]);
        if (json.data.length < batchSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("💥 Infinite pagination engine failed:", err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [products.length, category, search, loadingMore, hasMore, batchSize]);

  return { products, categories, loading, loadingMore, hasMore, loadMore, error };
}