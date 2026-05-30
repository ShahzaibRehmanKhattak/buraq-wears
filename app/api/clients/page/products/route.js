import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Secure internal helper to assert admin user identity
async function getAuthenticatedAdmin(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Active login session required.");
  }
  const role = user.user_metadata?.role || user.app_metadata?.role;
  if (role !== "admin") {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") {
      throw new Error("Forbidden: This endpoint requires an admin role.");
    }
  }
  return user;
}

// 1. GET: Unified pipeline for page filtering, search, and infinite pagination
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Fetching..." });
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

    // Parse incoming system search queries and query ranges
    const { searchParams } = new URL(request.url);
    const targetPage = searchParams.get("page");
    const searchQuery = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Use a lightweight reference to build conditions cleanly
    let query = supabase.from("products").select("*", { count: "exact" });

    // Condition A: Route Isolation Filter
    if (targetPage) {
      query = query.eq("page", targetPage.toLowerCase().trim());
    }

    // Condition B: Targeted ILIKE Search (matches title pattern inside the isolated channel page)
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery.trim()}%`);
    }

    // Condition C: Offset Pagination Matrix
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Returns data along with a metadata tracker to verify if more items remain to be loaded
    return new NextResponse(
      JSON.stringify({
        success: true,
        data,
        meta: {
          totalCount: count,
          hasMore: offset + limit < count
        }
      }),
      { status: 200, headers: response.headers }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. POST: Create a brand new product catalog node entry
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Processing creation..." });
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

    const adminUser = await getAuthenticatedAdmin(supabase);
    const body = await request.json();

    const payload = {
      title: body.title,
      slug: body.slug,
      sku: body.sku,
      page: body.page ? String(body.page).toLowerCase().trim() : null,
      barcode: body.barcode || null,
      brand: body.brand || null,
      description: body.description,
      short_description: body.short_description || null,
      price: Number(body.price) || 0,
      compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : null,
      cost_per_item: body.cost_per_item ? Number(body.cost_per_item) : null,
      discount_price: body.discount_price ? Number(body.discount_price) : null,
      badge_text: body.badge_text ? String(body.badge_text).trim() : null,
      stock_qty: Number(body.stock_qty) || 0,
      availability: body.availability || 'In Stock',
      category_id: body.category_id || null,
      sub_category: body.sub_category || null,
      tags: body.tags || null,
      colors: body.colors || null,
      sizes: body.sizes || null,
      weight: body.weight || null,
      length: body.length || null,
      width: body.width || null,
      height: body.height || null,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      warranty: body.warranty || null,
      material: body.material || null,
      specifications: body.specifications || null,
      images: body.images || [], 
      is_active: Boolean(body.is_active),
      is_featured: Boolean(body.is_featured),
      created_by_admin_id: adminUser.id,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from("products").insert([payload]).select();
    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), { status: 201, headers: response.headers });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// 3. PUT: Modify / Update structural values of an existing record model node
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Processing modification..." });
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

    const adminUser = await getAuthenticatedAdmin(supabase);
    const body = await request.json();

    if (!body.id) throw new Error("Missing required body parameters element target: id");

    const payload = {
      title: body.title,
      slug: body.slug,
      sku: body.sku,
      page: body.page ? String(body.page).toLowerCase().trim() : null,
      barcode: body.barcode || null,
      brand: body.brand || null,
      description: body.description,
      short_description: body.short_description || null,
      price: Number(body.price) || 0,
      compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : null,
      cost_per_item: body.cost_per_item ? Number(body.cost_per_item) : null,
      discount_price: body.discount_price ? Number(body.discount_price) : null,
      badge_text: body.badge_text ? String(body.badge_text).trim() : null,
      stock_qty: Number(body.stock_qty) || 0,
      availability: body.availability || 'In Stock',
      category_id: body.category_id || null,
      sub_category: body.sub_category || null,
      tags: body.tags || null,
      colors: body.colors || null,
      sizes: body.sizes || null,
      weight: body.weight || null,
      length: body.length || null,
      width: body.width || null,
      height: body.height || null,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      warranty: body.warranty || null,
      material: body.material || null,
      specifications: body.specifications || null,
      images: body.images || [], 
      is_active: Boolean(body.is_active),
      is_featured: Boolean(body.is_featured),
      created_by_admin_id: adminUser.id, 
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from("products").update(payload).eq("id", body.id).select();
    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), { status: 200, headers: response.headers });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// 4. DELETE: Clear an item from records using targeted item parameter configurations
export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Processing cleanup node..." });
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

    await getAuthenticatedAdmin(supabase);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Missing required query element parameter: id");

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: response.headers });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}