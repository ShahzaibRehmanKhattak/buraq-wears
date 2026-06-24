import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing module configuration slug identifier." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('store_pages')
      .select('*')
      .eq('page_slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Default structural fallbacks so components never crash on null data
    const fallbackData = {
      page_slug: slug,
      page_title: `${slug.toUpperCase()} Configuration Canvas`,
      hero_name: '', hero_description: '', hero_image: '', hero_btn_text: '', hero_btn_url: '',
      home_carousel_slides: [],
      standard_heroes_matrix: [],
      sizing_matrix_imperial: [],
      sizing_matrix_metric: [],
      sizing_fit_profile_text: '',
      returns_directives: [],
      returns_faqs: [],
      contact_hub_location: '',
      contact_receiver_email: '',
      contact_support_phone: '',
      contact_operational_hours: '',
      master_faqs_list: []
    };

    const finalPayload = data ? { ...fallbackData, ...data } : fallbackData;

    // Cache the response at the edge/CDN level for 1 minute, allow background revalidation for up to 5 minutes
    return NextResponse.json(
      { success: true, data: finalPayload },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Storefront API Engine Failure: ${error.message}` },
      { status: 500 }
    );
  }
}