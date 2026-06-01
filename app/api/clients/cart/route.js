import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Internal Secure Helper to fetch current customer identity via authorization headers
async function getAuthenticatedUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Active session required.");
  }
  return user;
}

// 1. GET: Fetch active bag rows joined with real-time inventory status values
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Syncing..." });
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

    // Relational Join fetching catalog specs alongside user items
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        selected_color,
        selected_size,
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
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. POST: Upsert an item combination directly or update active quantity counts
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Updating bag state..." });
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

    if (!body.product_id) throw new Error("Missing targeted parameter identity: product_id");

    const payload = {
      user_id: user.id,
      product_id: body.product_id, // Handled seamlessly as a UUID string
      quantity: Number(body.quantity) || 1,
      selected_color: body.selected_color || null,
      selected_size: body.selected_size || null,
      updated_at: new Date().toISOString()
    };

    // Leverage Postgres constraint definitions directly via Supabase upsert options
    const { data, error } = await supabase
      .from("cart_items")
      .upsert(payload, { 
        onConflict: "user_id, product_id, selected_color, selected_size" 
      })
      .select();

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// 3. DELETE: Target and eliminate specific database item entries
export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Purging selection entry..." });
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
    const cartItemId = searchParams.get("id");

    if (!cartItemId) throw new Error("Missing row parameters selector: id");

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", user.id); // Validates customer access authority bounds

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}