'use client';

import { useState, useEffect } from 'react';

export const useLookbook = (currentProduct = null) => {
  const [data, setData] = useState({ combinations: {}, palettes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServerLookbook = async () => {
      try {
        setLoading(true);
        let url = '/api/clients/lookbook';
        if (currentProduct?.id) {
          url += `?excludeId=${currentProduct.id}`;
        }

        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          setData({
            combinations: json.combinations || {},
            palettes: json.palettes || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch lookbook matrix:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServerLookbook();
  }, [currentProduct?.id]);

  return {
    outfitCombinationsByPalette: data.combinations,
    palettes: data.palettes,
    loading
  };
};