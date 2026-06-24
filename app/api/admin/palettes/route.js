import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  );
}

// GET: Fetch all saved custom palettes for the active user
export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { data: palettes, error } = await supabase
      .from('saved_palettes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: palettes }, { status: 200 });
  } catch (err) {
    console.error("Error fetching palettes bank:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add a new palette profile to the bank list array
export async function POST(request) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();

    const payload = {
      user_id: user.id,
      name: body.name,
      raw_text: body.raw_text,
      tokens: body.tokens || {},
      primary_color: body.primary_color,
      accent_color: body.accent_color,
      button_bg_color: body.button_bg_color,
      button_text_color: body.button_text_color,
      heading_text_color: body.heading_text_color,
      body_text_color: body.body_text_color
    };

    const { data, error } = await supabase
      .from('saved_palettes')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Error saving palette to history bank:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a template from the palette list configuration
export async function DELETE(request) {
  try {
    const supabase = await getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing palette ID reference parameter.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_palettes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Guard check to prevent deleting others' profiles

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting palette profile instance:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}