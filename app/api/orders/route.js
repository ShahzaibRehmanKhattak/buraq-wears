import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Syncing dashboard order stream..." });
    const allCookies = cookieStore.getAll();

    const supabaseSession = createServerClient(
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

    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Access Denied: Session signature invalid" }, { status: 401 });
    }

    // Pull historic orders cleanly with a joining select statement via Admin bypass client
    const { data: databaseOrders, error: fetchError } = await supabaseAdmin
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

    const formattedOrders = (databaseOrders || []).map(order => ({
      id: order.id,
      created_at: order.created_at,
      status: order.status,
      total_amount: order.total_amount,
      customer_email: order.customer_email,
      items: order.order_items || []
    }));

    return new NextResponse(JSON.stringify({ success: true, orders: formattedOrders }), {
      status: 200,
      headers: response.headers
    });

  } catch (error) {
    console.error("Orders historical array construction failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}