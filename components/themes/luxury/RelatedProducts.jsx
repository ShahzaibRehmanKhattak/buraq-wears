// components/RelatedProducts.jsx
import React from 'react';
import  ProductCard  from './ProductCard';

export default function RelatedProducts({ items = [], currentProduct, allProducts = [] }) {
  
  // ⚡ DYNAMIC SIMILARITY ENGINE
  const getDynamicRecommendations = () => {
    // If backend already successfully returned structured recommendations, use them!
    if (items && items.length > 0) return items;

    // Safety check: if no current context or global list exists, break cleanly
    if (!currentProduct || !allProducts || allProducts.length === 0) return [];

    const currentId = currentProduct.id || currentProduct._id;
    const currentTitle = (currentProduct.title || "").toLowerCase();
    
    // Break down the title into standalone keyword tokens (ignoring short fill words)
    const keywords = currentTitle
      .split(/[^a-z0-9]+/g)
      .filter(word => word.length > 2); 

    return allProducts
      // Filter out the active main product itself
      .filter(prod => {
        const prodId = prod.id || prod._id;
        return prodId !== currentId;
      })
      // Score products based on how many keywords match their title
      .map(prod => {
        const compareTitle = (prod.title || "").toLowerCase();
        let matchScore = 0;

        keywords.forEach(keyword => {
          if (compareTitle.includes(keyword)) matchScore++;
        });

        return { prod, matchScore };
      })
      // Only keep items that have at least one matching keyword thread
      .filter(item => item.matchScore > 0)
      // Sort from highest keyword match concentration to lowest
      .sort((a, b) => b.matchScore - a.matchScore)
      // Strip score wrappers and slice to match a clean 4-card enterprise grid row
      .map(item => item.prod)
      .slice(0, 4);
  };

  const finalDisplayItems = getDynamicRecommendations();

  // Hide the section entirely if no similar keyword relationships exist
  if (finalDisplayItems.length === 0) return null;

  return (
    <section className="mt-20 border-t border-neutral-200/60 pt-12">
      <div className="space-y-0.5 mb-8 text-center">
        <h2 className="text-[20px] font-bold tracking-[0.2em] text-neutral-900 uppercase">
          Complete The Look
        </h2>
        <p className="text-[13px] text-neutral-400 tracking-wide">
          Handpicked pairings dynamically synced via title attribute mapping.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {finalDisplayItems.map((productItem) => (
          <ProductCard key={productItem.id || productItem._id} item={productItem} />
        ))}
      </div>
    </section>
  );
}