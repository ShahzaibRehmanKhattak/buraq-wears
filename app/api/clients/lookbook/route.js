import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const PROFESSIONAL_PALETTES = [
  { id: 'p1', name: 'Classic Noir & Light', primary: 'black', secondary: 'white', hexA: '#171717', hexB: '#fafafa', advice: 'A sharp contrast pairing using absolute tones. Clean, minimalist, and universally professional.' },
  { id: 'p2', name: 'Deep Midnight Coast', primary: 'navy', secondary: 'white', hexA: '#1e293b', hexB: '#ffffff', advice: 'Balances sharp maritime Navy tones against crisp white elements for an elegant, structured profile.' },
  { id: 'p3', name: 'Earth & Espresso', primary: 'brown', secondary: 'tan', hexA: '#78350f', hexB: '#d97706', advice: 'Warm organic tones. Mixing rich browns with tan elements builds a high-end, premium look.' },
  { id: 'p4', name: 'Downtown Slate Mix', primary: 'blue', secondary: 'gray', hexA: '#2563eb', hexB: '#6b7280', advice: 'An urban layout mixing industrial grays with structural blues to remain low-key yet distinct.' },
  { id: 'p5', name: 'Shadow Tan Balance', primary: 'black', secondary: 'tan', hexA: '#0a0a0a', hexB: '#b45309', advice: 'Anchors bright earthly tan components against raw dark bases for an intentional silhouette look.' }
];

const checkColorMatch = (dbColorsString, targetColor) => {
  if (!dbColorsString) return false;
  return dbColorsString
    .toLowerCase()
    .split(',')
    .map(c => c.trim())
    .includes(targetColor.toLowerCase().trim());
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("excludeId");

    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, slug, price, compare_at_price, images, colors, category_id, sub_category, tags, is_featured")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(120);

    if (error) throw error;

    const shirts = [];
    const trousers = [];

    products.forEach((item) => {
      if (excludeId && item.id === excludeId) return;

      const cat = (item.category_id || '').toLowerCase();
      const subCat = (item.sub_category || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      const tags = (item.tags || '').toLowerCase();

      const isTop = cat.includes('shirt') || cat.includes('top') || subCat.includes('shirt') || 
                    tags.includes('top') || tags.includes('shirt') ||
                    title.match(/(shirt|top|jacket|tee|polo|hoodie|sweat|outerwear)/);

      const isBottom = cat.includes('trouser') || cat.includes('pant') || cat.includes('bottom') || 
                       subCat.includes('pant') || subCat.includes('trouser') || subCat.includes('bottom') || 
                       tags.includes('pant') || tags.includes('bottom') ||
                       title.match(/(pant|trouser|jean|slacks|chino|lower|cargo|short)/);

      if (isTop) shirts.push(item);
      else if (isBottom) trousers.push(item);
    });

    const multiOutfitCombinations = {};

    PROFESSIONAL_PALETTES.forEach((palette) => {
      // Collect ALL tops matching this palette matrix setup
      const matchingShirts = shirts.filter(s => 
        checkColorMatch(s.colors, palette.primary) || checkColorMatch(s.colors, palette.secondary)
      );

      // Collect ALL bottoms matching this palette matrix setup
      const matchingTrousers = trousers.filter(t => 
        checkColorMatch(t.colors, palette.secondary) || checkColorMatch(t.colors, palette.primary)
      );

      // Fallback arrays to avoid leaving options empty
      const finalShirts = matchingShirts.length > 0 ? matchingShirts : shirts.slice(0, 4);
      const finalTrousers = matchingTrousers.length > 0 ? matchingTrousers : trousers.slice(0, 4);

      // Map combinations as paired arrays up to 4 variations per style preset
      const iterations = Math.max(finalShirts.length, finalTrousers.length);
      const pairGroup = [];

      for (let i = 0; i < Math.min(iterations, 4); i++) {
        const shirt = finalShirts[i % finalShirts.length];
        const trouser = finalTrousers[i % finalTrousers.length];
        
        if (shirt && trouser) {
          pairGroup.push({
            id: `${palette.id}-group-${i}`,
            shirt,
            trouser
          });
        }
      }

      if (pairGroup.length > 0) {
        multiOutfitCombinations[palette.id] = {
          palette,
          pairs: pairGroup
        };
      }
    });

    return NextResponse.json({
      success: true,
      palettes: PROFESSIONAL_PALETTES,
      combinations: multiOutfitCombinations
    }, { status: 200 });

  } catch (err) {
    console.error("💥 [Lookbook Multi-Engine Crash]:", err.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}