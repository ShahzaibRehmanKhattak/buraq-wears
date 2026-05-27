import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function GET(request) {
  try {
    // 1. Extract search parameters from the request URL
    const { searchParams } = new URL(request.url);
    
    let categoryParam = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const featured = searchParams.get("is_featured"); 

    // 2. Initialize your Supabase base query matching your schema flags
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true); // Maps perfectly to your 'is_active' boolean column

    // 3. Apply conditional filters based on your actual schema columns
    if (categoryParam) {
      console.log(`📥 [API Raw Input]: "${categoryParam}"`);

      // Clean up the URL encoding parameters safely
      let stage1 = categoryParam.replace(/\+/g, " ");
      let stage2 = decodeURIComponent(stage1);
      let cleanCategoryName = stage2.replace(/\+/g, " ").trim();
      
      console.log(`🧼 [API Cleaned Output]: Processing search for -> "${cleanCategoryName}"`);

      if (cleanCategoryName !== "") {
        // Split phrase into words to support flexible loose searches
        const words = cleanCategoryName.split(/\s+/).filter(word => word.length > 0);

        if (words.length > 0) {
          // 🎯 THE SCHEMA FIX: 
          // We map the search terms to check 'category_id' OR 'sub_category' 
          // using valid, double-quoted PostgREST text strings.
          const conditions = [];
          words.forEach(word => {
            conditions.push(`category_id.ilike."%${word}%"`);
            conditions.push(`sub_category.ilike."%${word}%"`);
          });

          const orQueryCondition = conditions.join(",");

          console.log(`⛓️ [Generated Schema Condition]: .or("${orQueryCondition}")`);
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

    // 4. Handle default ordering using your 'created_at' timestamp column
    query = query.order("created_at", { ascending: false });

    // 5. Execute the constructed query
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