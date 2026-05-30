"use client";
import { useState, useEffect, useCallback } from "react";

export function usePageProducts(pageName, itemsPerPage = 12) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // 1. Handle search query input changes with implicit debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400); // 400ms delay protects your database from being flooded with network requests on every keystroke
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Base Fetch Execution Function
  const fetchProducts = useCallback(async (currentOffset, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      // Construct dynamic API search query route string
      let url = `/api/clients/page/products?limit=${itemsPerPage}&offset=${currentOffset}`;
      if (pageName) url += `&page=${encodeURIComponent(pageName)}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;

      const res = await fetch(url);
      const result = await res.json();

      if (result.success) {
        setProducts((prev) => (isLoadMore ? [...prev, ...result.data] : result.data));
        setHasMore(result.meta.hasMore);
      } else {
        console.error("API error response matrix rejected:", result.error);
      }
    } catch (err) {
      console.error("Failed executing core network fetch cycle:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [pageName, debouncedSearch, itemsPerPage]);

  // 3. Trigger initial layout fetch when page context changes or user finishes typing
  useEffect(() => {
    setOffset(0);
    fetchProducts(0, false);
  }, [debouncedSearch, pageName, fetchProducts]);

  // 4. Load More pipeline handler
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    const nextOffset = offset + itemsPerPage;
    setOffset(nextOffset);
    fetchProducts(nextOffset, true);
  }, [hasMore, loadingMore, offset, itemsPerPage, fetchProducts]);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    loadMore,
    refresh: () => fetchProducts(0, false)
  };
}