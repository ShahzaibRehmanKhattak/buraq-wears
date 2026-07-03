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
      setLoading(true);
      setError(null);
      setHasMore(true);

      try {
        const params = new URLSearchParams();
        
        // 🎯 FIX: Matches parameter key checked in your API route.js
        if (category) {
          params.append("category", category.toLowerCase().trim());
        }
        
        if (search) {
          params.append("search", search.trim());
        }

        params.append("from", "0");
        params.append("to", String(batchSize - 1));

        const res = await fetch(`/api/clients/products?${params.toString()}`);
        const json = await res.json();

        if (!isMounted) return;

        if (json.success) {
          setProducts(json.data || []);
          if ((json.data || []).length < batchSize) {
            setHasMore(false);
          }
        } else {
          throw new Error(json.error || "Failed fetching dynamic data streams");
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
  }, [category, search, batchSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const fromIndex = products.length;
      const toIndex = fromIndex + batchSize - 1;

      const params = new URLSearchParams();
      // 🎯 FIX: Changed key from category_id to category
      if (category) params.append("category", category.toLowerCase().trim());
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
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [category, search, products.length, batchSize, loadingMore, hasMore]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error
  };
}