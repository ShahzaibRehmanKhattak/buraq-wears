import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Active session required.");
  }
  return user;
}

// 1. GET: Fetch active bag rows
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

// 2. POST: Used for initial additions and safe fallback updates
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

    // ✨ ULTIMATE BACKEND FAILSAFE:
    // If the frontend triggers a POST request but passes a specific cart item ID,
    // intercept it and process it directly as a surgical primary key update to prevent 400 errors.
    const targetRowId = body.cart_item_id || body.id;
    if (targetRowId) {
      const targetQuantity = Number(body.quantity);
      if (isNaN(targetQuantity) || targetQuantity < 1) {
        throw new Error("Quantity constraint check violation: must be greater than 0");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: targetQuantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", targetRowId)
        .eq("user_id", user.id)
        .select();

      if (error) throw error;
      return new NextResponse(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: response.headers
      });
    }

    // Standard routine for adding items from the Product Detail Page (PDP)
    if (!body.product_id) throw new Error("Missing parameter: product_id");

    const targetColor = body.selected_color || null;
    const targetSize = body.selected_size || null;
    const incomingQuantity = Number(body.quantity) || 1;
    
    const isAbsoluteOverride = body.actionType === "absolute" || body.isAbsolute === true;

    let finalQuery = supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", body.product_id);

    if (targetColor === null) finalQuery = finalQuery.is("selected_color", null);
    else finalQuery = finalQuery.eq("selected_color", targetColor);

    if (targetSize === null) finalQuery = finalQuery.is("selected_size", null);
    else finalQuery = finalQuery.eq("selected_size", targetSize);

    const { data: actualRows } = await finalQuery;

    if (actualRows && actualRows.length > 0) {
      const targetRow = actualRows[0];
      
      const finalCalculatedQuantity = isAbsoluteOverride 
        ? incomingQuantity 
        : (targetRow.quantity + incomingQuantity);

      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: finalCalculatedQuantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", targetRow.id)
        .select();

      if (error) throw error;
      return new NextResponse(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: response.headers
      });
    } else {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: body.product_id,
          quantity: incomingQuantity,
          selected_color: targetColor,
          selected_size: targetSize
        })
        .select();

      if (error) throw error;
      return new NextResponse(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: response.headers
      });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// 3. PATCH: Pure absolute quantity modifier for increment/decrement operations
export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Syncing direct quantity state..." });
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

    const targetRowId = body.cart_item_id || body.id;
    if (!targetRowId) throw new Error("Missing targeted item identity row field");

    const targetQuantity = Number(body.quantity);
    if (isNaN(targetQuantity) || targetQuantity < 1) {
      throw new Error("Quantity constraint check violation: must be greater than 0");
    }

    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: targetQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", targetRowId)
      .eq("user_id", user.id)
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

// 4. DELETE: Clear single cart configuration nodes
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
      .eq("user_id", user.id);

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}