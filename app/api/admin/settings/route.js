import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Dynamic security gate validating role parameters directly from DB profiles
async function verifyAdminAuthorization(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Active login session required.");
  }

  // Cross-verify status directly against your profile records schema
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileErr || !profile || profile.role !== "admin") {
    throw new Error("Forbidden: Executive administrative clearance required.");
  }

  return user;
}

// 1. GET: Fetch global active frontend parameters layout maps
export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Syncing structural values..." });
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

    // Target the absolute target single row container
    const { data, error } = await supabase
      .from("site_settings")
      .eq("id", "SYSTEM_GLOBAL_ROOT")
      .single();

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. POST: Complete payload mutation update for system changes
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Committing state matrices..." });
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

    // Enforce administrative safety verification
    const adminUser = await verifyAdminAuthorization(supabase);
    const body = await request.json();

    // Map your custom settings form variables directly to database keys
    const configurationPayload = {
      store_name: body.storeName,
      tagline: body.tagline,
      logo_url: body.logoUrl,
      favicon_url: body.faviconUrl,
      support_email: body.supportEmail,
      contact_phone: body.contactPhone,
      
      primary_color: body.primaryColor,
      accent_color: body.accentColor,
      background_color: body.backgroundColor,
      font_family: body.fontFamily,
      corner_radius: body.cornerRadius,
      enable_hero_banner: Boolean(body.enableHeroBanner),
      enable_marquee_announcement: Boolean(body.enableMarqueeAnnouncement),
      announcement_text: body.announcementText,
      
      currency: body.currency,
      tax_rate: Number(body.taxRate) || 0.00,
      enable_guest_checkout: Boolean(body.enableGuestCheckout),
      require_phone_for_shipping: Boolean(body.requirePhoneForShipping),
      free_shipping_threshold: Number(body.freeShippingThreshold) || 0.00,
      flat_shipping_rate: Number(body.flatShippingRate) || 0.00,
      enable_stock_warnings: Boolean(body.enableStockWarnings),
      low_stock_threshold: Number(body.lowStockThreshold) || 0,
      
      updated_at: new Date().toISOString(),
      updated_by_admin_id: adminUser.id
    };

    // Use an upsert mechanism matching the locked core primary identifier string
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: "SYSTEM_GLOBAL_ROOT", ...configurationPayload });

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, message: "Configurations committed cleanly." }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}