import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let categoryParam = searchParams.get("category_id") || searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const featured = searchParams.get("is_featured"); 
    const is_active = searchParams.get("is_active");
    const limit = searchParams.get("limit");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Initialize base query stream mapping your schema flags
    let query = supabase.from("products").select("*");

    // Apply Active Visibility filter flag (Defaults to true if not specified)
    if (is_active !== null) {
      if (is_active === "true") query = query.eq("is_active", true);
    } else {
      query = query.eq("is_active", true);
    }

    // 1. Category Constraint Scope (Isolated block)
    if (categoryParam && categoryParam.trim() !== "" && categoryParam.toLowerCase() !== "all") {
      let stage1 = categoryParam.replace(/\+/g, " ");
      let cleanCategory = stage1.trim();

      if (cleanCategory.length > 0) {
        const words = cleanCategory.split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          const conditions = [];
          words.forEach((word) => {
            let baseWord = word.toLowerCase();
            if (baseWord.endsWith('s') && baseWord.length > 4) {
              baseWord = baseWord.slice(0, -1); // root word singular conversion
            }
            conditions.push(`category_id.ilike.%${baseWord}%`);
            conditions.push(`sub_category.ilike.%${baseWord}%`);
          });
          // Locks down the category parameters
          query = query.or(conditions.join(","));
        }
      }
    }

    // Maps directly to your 'tags' text column
    if (tag && tag.trim() !== "") {
      query = query.ilike("tags", `%${tag}%`);
    }

    // Maps directly to your 'is_featured' boolean column
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    // 2. 🎯 SEARCH CONSTRAINTS SCOPE (Isolated block allows digging down into categories!)
    if (search && search.trim() !== "") {
      const searchWords = search.trim().split(/\s+/).filter(Boolean);
      if (searchWords.length > 0) {
        const searchConditions = [];
        searchWords.forEach((word) => {
          let rootWord = word.toLowerCase();
          if (rootWord.endsWith('s') && rootWord.length > 4) {
            rootWord = rootWord.slice(0, -1);
          }
          searchConditions.push(`title.ilike.%${rootWord}%`);
          searchConditions.push(`description.ilike.%${rootWord}%`);
          searchConditions.push(`tags.ilike.%${rootWord}%`);
        });
        // Layers on top of the selected category, narrowing down the results!
        query = query.or(searchConditions.join(","));
      }
    }

    // Handle default ordering using your 'created_at' timestamp column
    query = query.order("created_at", { ascending: false });

    // Explicit Range Pagination checks take total precedence over static limits
    if (from !== null && to !== null && from !== "" && to !== "") {
      query = query.range(Number(from), Number(to));
    } else if (limit && limit !== "") {
      query = query.limit(Number(limit));
    } else {
      query = query.limit(12); 
    }

    // Execute constructed PostgREST query
    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}