import { createBrowserClient } from '@supabase/ssr'
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  console.log("📡 [CATEGORIES API]: Fetching categories table entries.");

  try {
    // Query your dedicated categories table directly
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true });

    if (error) {
      console.error("❌ [CATEGORIES DB ERROR]:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    console.log(`✅ [CATEGORIES API SUCCESS]: Found ${data?.length || 0} categories.`);
    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });

  } catch (err) {
    console.error("💥 [CATEGORIES API CRASH]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Failure" }, 
      { status: 500 }
    );
  }
}