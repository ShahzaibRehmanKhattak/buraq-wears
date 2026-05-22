import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Secure internal helper to assert admin user identity and return account details
async function getAuthenticatedAdmin(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized: Active login session required.");
  }

  const role = user.user_metadata?.role || user.app_metadata?.role;
  
  if (role !== "admin") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      throw new Error("Forbidden: This endpoint requires an admin role.");
    }
  }

  return user;
}

// 1. GET: Fetch all category classification nodes
export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Fetching..." });
    const allCookies = cookieStore.getAll();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, // Swapped to your correct key
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

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_priority", { ascending: false });

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. POST: Create or Update a Category Node
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Processing..." });
    const allCookies = cookieStore.getAll();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, // Swapped to your correct key
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
      name: body.name,
      slug: body.slug,
      description: body.description,
      volume_units: Number(body.volume_units) || 0,
      is_active: Boolean(body.is_active),
      is_featured: Boolean(body.is_featured),
      image_url: body.image_url,
      classification_node: body.classification_node || 'Parent Category',
      display_priority: Number(body.display_priority) || 0,
      target_audience: body.target_audience || 'Unisex',
      seo_keywords: body.seo_keywords,
      seo_description: body.seo_description,
      created_by_admin_id: adminUser.id,
      updated_at: new Date().toISOString()
    };

    let result;
    if (body.id) {
      result = await supabase
        .from("categories")
        .update(payload)
        .eq("id", body.id);
    } else {
      result = await supabase
        .from("categories")
        .insert([payload]);
    }

    if (result.error) throw result.error;

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// 3. DELETE: Drop a target row node
export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ message: "Processing..." });
    const allCookies = cookieStore.getAll();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, // Swapped to your correct key
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

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}