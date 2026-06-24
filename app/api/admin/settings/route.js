import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map endpoint module keys to target Supabase tables
const targetTableMap = {
  general: 'shops',
  branding: 'shops',
  homepage: 'shops',
  social: 'shops',
  seo: 'shops',
  contact: 'shops',
  shipping: 'shipping_settings',
  payment: 'payment_settings',
  features: 'shop_features'
};

export async function GET() {
  try {
    // Fetch entire configuration map for ID 1 simultaneously
    const [shopRes, shippingRes, paymentRes, featuresRes] = await Promise.all([
      supabase.from('shops').select('*').eq('id', 1).single(),
      supabase.from('shipping_settings').select('*').eq('id', 1).single(),
      supabase.from('payment_settings').select('*').eq('id', 1).single(),
      supabase.from('shop_features').select('*').eq('id', 1).single()
    ]);

    if (shopRes.error) throw shopRes.error;

    return NextResponse.json({
      success: true,
      data: {
        general: shopRes.data,
        branding: shopRes.data,
        homepage: shopRes.data,
        social: shopRes.data,
        seo: shopRes.data,
        contact: shopRes.data,
        shipping: shippingRes.data || {},
        payment: paymentRes.data || {},
        features: featuresRes.data || {}
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetModule = searchParams.get('module');
    const payload = await req.json();

    if (!targetModule) {
      return NextResponse.json({ success: false, error: "Target configurations parameter absent." }, { status: 400 });
    }

    const dbTableName = targetTableMap[targetModule];
    if (!dbTableName) {
      return NextResponse.json({ success: false, error: "Invalid module path execution layout." }, { status: 400 });
    }

    // Enforce mutations securely strictly to Row ID 1
    const { error } = await supabase
      .from(dbTableName)
      .update({ ...payload, updated_at: new Date() })
      .eq('id', 1);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}