"use client";
import { useState, useEffect } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategoriesList() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/clients/categories");
        
        if (!res.ok) {
          throw new Error("Network response failed reaching categories endpoint.");
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Failed to successfully retrieve categories.");
        }

        if (isMounted) {
          // Pass the structured array data directly down to the UI loop
          setCategories(json.data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("❌ [useCategories Hook Catch]:", err.message);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategoriesList();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
}