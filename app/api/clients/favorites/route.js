import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Standard Auth Helper matching Cart Route architecture perfectly
async function getAuthenticatedUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Active session required.");
  }
  return user;
}

// 1. GET: Fetch active favorite items matching Cart structures
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Syncing favorites..." });
    const allCookies = cookieStore.getAll();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() { return allCookies; },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const user = await getAuthenticatedUser(supabase);

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        product_id,
        products (
          title,
          slug,
          price,
          compare_at_price,
          images,
          availability,
          stock_qty
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    const isAuthErr = err.message.toLowerCase().includes("unauthorized");
    return NextResponse.json(
      { success: false, error: err.message }, 
      { status: isAuthErr ? 401 : 500 }
    );
  }
}

// 2. POST: Unified Toggle addition entry endpoint
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Updating wishlist state..." });
    const allCookies = cookieStore.getAll();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() { return allCookies; },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const user = await getAuthenticatedUser(supabase);
    const body = await request.json();

    if (!body.product_id) throw new Error("Missing parameter: product_id");

    // Check if item already exists to ensure toggle operation safety
    const { data: existingRows } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", body.product_id);

    // If already favorited, return early safely to prevent DB unique key crashes
    if (existingRows && existingRows.length > 0) {
      return new NextResponse(JSON.stringify({ success: true, message: "Already in favorites", data: existingRows[0] }), {
        status: 200,
        headers: response.headers
      });
    }

    // Surgical insertion execution matching user session properties
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        product_id: body.product_id
      })
      .select();

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    const isAuthErr = err.message.toLowerCase().includes("unauthorized");
    return NextResponse.json(
      { success: false, error: err.message }, 
      { status: isAuthErr ? 401 : 400 }
    );
  }
}

// 3. DELETE: Drop a favorite node map via query parameter selector
export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Purging favorite item..." });
    const allCookies = cookieStore.getAll();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() { return allCookies; },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const user = await getAuthenticatedUser(supabase);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");

    if (!productId) throw new Error("Missing parameter selector: product_id");

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    const isAuthErr = err.message.toLowerCase().includes("unauthorized");
    return NextResponse.json(
      { success: false, error: err.message }, 
      { status: isAuthErr ? 401 : 400 }
    );
  }
}