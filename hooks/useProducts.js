"use client";
import { useState, useEffect } from "react";

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Holds all unique categories for navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stringify filters so useEffect can accurately compare structural changes
  const filterString = JSON.stringify(filters);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Build query parameters dynamically for the filtered products request
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });

        // 2. Fire requests concurrently: 
        // Always fetch the unfiltered master list of products to extract all unique categories,
        // while simultaneously fetching the filtered product subset for the grid display.
        const [filteredRes, masterRes] = await Promise.all([
          fetch(`/api/clients/products?${params.toString()}`),
          fetch("/api/clients/products") // Static base route to ensure pills never vanish
        ]);

        const filteredJson = await filteredRes.json();
        const masterJson = await masterRes.json();

        if (!filteredJson.success) throw new Error(filteredJson.error || "Failed to fetch filtered products");
        if (!masterJson.success) throw new Error(masterJson.error || "Failed to fetch categories list");

        if (isMounted) {
          // Set the dynamically filtered products for your grid view
          setProducts(filteredJson.data);

          // Extract all global unique categories from the unfiltered master data set
          const uniqueCats = [
            ...new Set(masterJson.data.map((p) => p.category).filter(Boolean))
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filterString]);

  return { products, categories, loading, error };
}