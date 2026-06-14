import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Secure admin bypass client to query logistics safely across guest or profile sessions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request, { params }) {
  try {
    const { id } = await params; 
    const orderTrackingId = id.toUpperCase().trim();

    // 1. Fetch the master order row using exact SQL columns from public.orders
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total_amount,
        customer_name,
        customer_email,
        shipping_address,
        city,
        postal_code,
        payment_method
      `)
      .eq('id', orderTrackingId)
      .single();

    if (orderError || !order) {
      console.error("Supabase Master Order Lookup Error:", orderError);
      return NextResponse.json({ success: false, error: "Order reference code not found." }, { status: 404 });
    }

    // 2. Fetch the corresponding items using exact columns from public.order_items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(`
        id,
        product_id,
        product_title,
        quantity,
        size,
        price,
        image_url
      `)
      .eq('order_id', orderTrackingId);

    if (itemsError) {
      console.error("Supabase Order Items Extraction Error:", itemsError);
    }

    // 3. Attach items array securely to your main order object for the UI slug component
    order.items = items || [];

    return NextResponse.json(order, { status: 200 });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}