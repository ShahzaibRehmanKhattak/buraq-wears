import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let categoryParam = searchParams.get("category");
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

    // Advanced Flexible Category Parsing (.or syntax matching category_id or sub_category)
    if (categoryParam) {
      let stage1 = categoryParam.replace(/\+/g, " ");
      let stage2 = decodeURIComponent(stage1);
      let cleanCategoryName = stage2.replace(/\+/g, " ").trim();
      
      if (cleanCategoryName !== "") {
        const words = cleanCategoryName.split(/\s+/).filter(word => word.length > 0);

        if (words.length > 0) {
          const conditions = [];
          words.forEach(word => {
            conditions.push(`category_id.ilike."%${word}%"`);
            conditions.push(`sub_category.ilike."%${word}%"`);
          });

          const orQueryCondition = conditions.join(",");
          query = query.or(orQueryCondition);
        }
      }
    }

    // Maps directly to your 'tags' text column
    if (tag) {
      query = query.ilike("tags", `%${tag}%`);
    }

    // Maps directly to your 'is_featured' boolean column
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    // Maps directly to your 'title' text column
    if (search) {
      query = query.ilike("title", `%${search}%`);
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

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (err) {
    console.error("💥 [Catalog Endpoint Crash]:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve catalog" }, 
      { status: 500 }
    );
  }
}