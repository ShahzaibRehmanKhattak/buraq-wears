import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getAdminSupabaseClient() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() { return allCookies; },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {}
        }
      }
    }
  );
}

export async function GET(request) {
  try {
    const supabase = await getAdminSupabaseClient();
    
    // Attempting to log active developer parameters to avoid session drops
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn("Auth check failed, attempting direct table select under RLS rules...");
    }

    // Explicitly query exactly how your schema is designed
    const { data: databaseOrders, error: fetchError } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        updated_at,
        status,
        total_amount,
        customer_name,
        customer_email,
        phone,
        shipping_address,
        city,
        postal_code,
        payment_method,
        order_items (
          id,
          product_id,
          product_title,
          quantity,
          size,
          price,
          image_url
        )
      `)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("Supabase Database Error Details:", fetchError);
      throw fetchError;
    }

    return NextResponse.json({ success: true, orders: databaseOrders || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const supabase = await getAdminSupabaseClient();
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) throw updateError;
    return NextResponse.json({ success: true, message: "Registry mutation completed effectively." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}