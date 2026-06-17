import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
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
            });
          }
        }
      }
    );

    // Grab user profile token context parameters
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Access Denied: Session unauthorized" }, { status: 401 });
    }

    // Pull database order items alongside their relational inner items rows mapping
    const { data: databaseOrders, error: fetchError } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total_amount,
        customer_email,
        order_items (
          id,
          product_title,
          quantity,
          size,
          price,
          image_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // Format fields cleanly to stream directly to dashboard viewports
    const formattedOrders = (databaseOrders || []).map(order => ({
      id: order.id,
      created_at: order.created_at,
      status: order.status, // Directly channels your database status ("Pending", "Cancelled", etc.)
      total_amount: order.total_amount,
      customer_email: order.customer_email,
      items: order.order_items || []
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });

  } catch (error) {
    console.error("Orders collection process failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}