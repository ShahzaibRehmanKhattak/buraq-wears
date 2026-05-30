import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// 🎯 SECURITY BEST PRACTICE: Use service/secret key on server-side routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function GET(request, { params }) {
  try {
    const { slugId } = await params;

    if (!slugId) {
      return NextResponse.json({ success: false, error: "Identifier required" }, { status: 400 });
    }

    // 🎯 DEFENSIVE REGEX FIX: Extract the entire 36-character standard UUID string from the end of the slug
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const match = slugId.match(uuidRegex);
    
    // Fallback to the raw slugId if the URL format didn't append a valid UUID sequence
    const cleanDbId = match ? match[0] : slugId;

    // 🎯 STRUCTURAL VALIDATION: Quick sanity check before querying database
    // Ensures we aren't passing malformed strings down to the database row search index
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanDbId);
    
    if (!isValidUuid) {
      return NextResponse.json({ success: false, error: "Malformed dynamic syntax UUID identifier" }, { status: 400 });
    }

    // Query your target Supabase table using the pristine, full UUID string
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", cleanDbId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });

  } catch (err) {
    console.error("💥 [Product Detail Crash]:", err.message);
    return NextResponse.json({ success: false, error: "Internal Server Engine Error" }, { status: 500 });
  }
}