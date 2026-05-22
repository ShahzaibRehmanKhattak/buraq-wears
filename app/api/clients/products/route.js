import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// We use the standard Supabase client for public read access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function GET() {
  try {
    // Fetch only active products
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve catalog" }, 
      { status: 500 }
    );
  }
}