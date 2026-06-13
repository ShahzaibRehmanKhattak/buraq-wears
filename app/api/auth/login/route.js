import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Robust utility to determine the actual public base URL and kill the 0.0.0.0 bug
function getPublicOrigin(request) {
  // 1. Priority 1: Use an explicit env variable if configured
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  // 2. Priority 2: Read live proxy upstream routing headers from the host platform
  const headers = request.headers;
  const host = headers.get('x-forwarded-host') || headers.get('host');
  const proto = headers.get('x-forwarded-proto') || 'https';
  
  if (host) {
    const cleanHost = host.split(',')[0].trim();
    const cleanProto = proto.split(',')[0].trim();
    return `${cleanProto}://${cleanHost}`;
  }
  
  // 3. Fallback last resort
  const { origin } = new URL(request.url);
  return origin;
}

// ==========================================
// 1. GET HANDLER: Google OAuth Callback
// ==========================================
export async function GET(request) {
  const publicOrigin = getPublicOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(`${publicOrigin}/login?error=Missing authentication code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);

  if (authError) {
    console.error('OAuth Code Exchange Error:', authError.message);
    return NextResponse.redirect(`${publicOrigin}/login?error=${encodeURIComponent(authError.message)}`);
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user?.id)
      .single();

    // Direct user cleanly using the sanitized public domain string
    if (profile?.role === 'admin') {
      return NextResponse.redirect(`${publicOrigin}/dashboard?sync=true`);
    }
    return NextResponse.redirect(`${publicOrigin}/my-orders?sync=true`);
    
  } catch (err) {
    console.error('Profile parsing crashed on callback:', err);
    return NextResponse.redirect(`${publicOrigin}/my-orders?sync=true`);
  }
}

// ==========================================
// 2. POST HANDLER: Email & Password Sign In
// ==========================================
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();
  
    return NextResponse.json({ 
      message: 'Login successful!', 
      role: profile?.role || 'customer' 
    }, { status: 200 });

  } catch (err) {
    console.error("Login API Crash Details:", err);
    return NextResponse.json(
      { error: 'Something went wrong on our servers.' },
      { status: 500 }
    );
  }
}