// hooks/useProductData.js
import { useState, useEffect } from 'react';

export function useProductData(slugId) {
  const [product, setProduct] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugId) return;

    async function loadWorkspaceData() {
      setLoading(true);
      try {
        // 🎯 BULLETPROOF UUID EXTRACTION
        let productId = slugId;
        
        // Match a standard 36-character UUID at the end of your route string
        // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
        const match = slugId.match(uuidRegex);
        
        if (match) {
          productId = match[1]; // Grabs 'f99178c7-d5f1-4f4d-903d-8982176d12c0' cleanly
        }

        console.log("🎯 Extracted Target API ID:", productId);

        // 1. Fetch data from your specific clients endpoint format
        const productResponse = await fetch(`/api/clients/products/${productId}`);
        if (!productResponse.ok) throw new Error("Product details fetch failed");
        
        const productData = await productResponse.json();
        // Check for common data wrappers securely
        const targetProduct = productData?.product || productData?.data || productData;
        setProduct(targetProduct);

        // 2. Map gallery images dynamically from the real database properties
        if (targetProduct) {
          const images = Array.isArray(targetProduct.gallery_images) && targetProduct.gallery_images.length > 0
            ? targetProduct.gallery_images
            : targetProduct.image_url 
              ? [targetProduct.image_url] 
              : ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"];
          setGalleryImages(images);
        }

        // 3. Fetch global catalog for the dynamic related products grid
        const catalogResponse = await fetch('/api/clients/products');
        const catalogData = await catalogResponse.json();
        const rawCatalog = Array.isArray(catalogData) 
          ? catalogData 
          : catalogData?.products || catalogData?.data || [];
        setAllProducts(rawCatalog);

        // 4. Run your title matching engine
        if (targetProduct && rawCatalog.length > 0) {
          const currentId = targetProduct.id || targetProduct._id;
          const currentTitle = (targetProduct.title || "").toLowerCase();
          
          const keywords = currentTitle
            .split(/[^a-z0-9]+/g)
            .filter(word => word.length > 2);

          const calculatedMatches = rawCatalog
            .filter(item => (item.id || item._id) !== currentId)
            .map(item => {
              const compareTitle = (item.title || "").toLowerCase();
              let matchScore = 0;
              
              keywords.forEach(keyword => {
                if (compareTitle.includes(keyword)) matchScore++;
              });
              
              return { item, matchScore };
            })
            .filter(entry => entry.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .map(entry => entry.item)
            .slice(0, 4);

          setRelatedProducts(calculatedMatches);
        }

      } catch (error) {
        console.error("Error inside your product data hook processing pipeline:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceData();
  }, [slugId]);

  return {
    product,
    galleryImages,
    relatedProducts,
    allProducts,
    loading
  };
}