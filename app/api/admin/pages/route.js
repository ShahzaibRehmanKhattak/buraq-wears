import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a standard client using cookies and the Publishable Key.
 * This ensures Supabase enforces the logged-in user's RLS policies.
 */
async function getAdminSupabaseClient() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, // Enforces RLS via user session
    {
      cookies: {
        getAll() { return allCookies; },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Safe fallback inside execution lifecycles
          }
        }
      }
    }
  );
}

// Helper function to safely parse incoming stringified JSON columns
function parseJsonFields(record) {
  if (!record) return record;
  
  const parsed = { ...record };
  const jsonFields = [
    'home_carousel_slides',
    'standard_heroes_matrix', 
    'sizing_matrix_imperial',
    'sizing_matrix_metric',
    'returns_directives',
    'returns_faqs',
    'master_faqs_list'
  ];

  jsonFields.forEach(field => {
    if (parsed[field]) {
      try {
        parsed[field] = typeof parsed[field] === 'string' ? JSON.parse(parsed[field]) : parsed[field];
      } catch (e) {
        console.error(`Failed to parse field ${field}:`, e);
        parsed[field] = []; 
      }
    } else {
      parsed[field] = []; 
    }
  });

  return parsed;
}

/**
 * GET Method: Fetches configuration parameters scoped to the authenticated admin
 */
export async function GET(request) {
  try {
    const supabase = await getAdminSupabaseClient();
    
    // Extract the authenticated admin user from session cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication Breach: Valid administrative credentials missing." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeModule = searchParams.get('module');

    if (!activeModule) {
      return NextResponse.json(
        { success: false, error: "Validation Failure: Module parameter identifier missing." },
        { status: 400 }
      );
    }

    // Fetch data matching BOTH page_slug and admin_id
    const { data, error } = await supabase
      .from('store_pages')
      .select('*')
      .eq('page_slug', activeModule)
      .eq('admin_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Clean data before sending to client
    const clientData = data 
      ? parseJsonFields(data)
      : { 
          page_slug: activeModule, 
          page_title: `${activeModule.toUpperCase()} Module Config`,
          admin_id: user.id,
          home_carousel_slides: [], 
          standard_heroes_matrix: [], 
          sizing_matrix_imperial: [],
          sizing_matrix_metric: [],
          returns_directives: [],
          returns_faqs: [],
          master_faqs_list: []
        };

    return NextResponse.json({ success: true, data: clientData });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Database Transaction Aborted: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST Method: Commits state changes with enforced admin identity verification
 */
export async function POST(request) {
  try {
    const supabase = await getAdminSupabaseClient();
    
    // Extract the authenticated admin user from session cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication Breach: Operation forbidden for unverified administrators." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeModule = searchParams.get('module');
    const payload = await request.json();

    if (!activeModule) {
      return NextResponse.json(
        { success: false, error: "Validation Failure: Target module slice undefined." },
        { status: 400 }
      );
    }

    const { id, updated_at, admin_id, ...cleanPayload } = payload;

    const updatedRecord = {
      page_slug: activeModule,
      admin_id: user.id, // Enforce current logged-in user ID
      page_title: cleanPayload.page_title || `${activeModule.toUpperCase()} Architecture Canvas`,
      hero_name: cleanPayload.hero_name,
      hero_description: cleanPayload.hero_description,
      hero_image: cleanPayload.hero_image,
      hero_btn_text: cleanPayload.hero_btn_text,
      hero_btn_url: cleanPayload.hero_btn_url,

      home_carousel_slides: cleanPayload.home_carousel_slides ? JSON.stringify(cleanPayload.home_carousel_slides) : '[]',
      standard_heroes_matrix: cleanPayload.standard_heroes_matrix ? JSON.stringify(cleanPayload.standard_heroes_matrix) : '[]',
      sizing_matrix_imperial: cleanPayload.sizing_matrix_imperial ? JSON.stringify(cleanPayload.sizing_matrix_imperial) : '[]',
      sizing_matrix_metric: cleanPayload.sizing_matrix_metric ? JSON.stringify(cleanPayload.sizing_matrix_metric) : '[]',
      sizing_fit_profile_text: cleanPayload.sizing_fit_profile_text,
      returns_directives: cleanPayload.returns_directives ? JSON.stringify(cleanPayload.returns_directives) : '[]',
      returns_faqs: cleanPayload.returns_faqs ? JSON.stringify(cleanPayload.returns_faqs) : '[]',
      contact_hub_location: cleanPayload.contact_hub_location,
      contact_receiver_email: cleanPayload.contact_receiver_email,
      contact_support_phone: cleanPayload.contact_support_phone,
      contact_operational_hours: cleanPayload.contact_operational_hours,
      master_faqs_list: cleanPayload.master_faqs_list ? JSON.stringify(cleanPayload.master_faqs_list) : '[]',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('store_pages')
      .upsert(updatedRecord, { onConflict: 'admin_id,page_slug' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Canvas matrices for [/${activeModule}] integrated successfully.`,
      data: parseJsonFields(data)
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Transactional Engine Error: ${error.message}` },
      { status: 500 }
    );
  }
}