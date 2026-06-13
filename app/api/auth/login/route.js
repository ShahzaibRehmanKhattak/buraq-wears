import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ==========================================
// 1. GET HANDLER: Google OAuth Callback
// ==========================================
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=Missing authentication code`)
  }

  const cookieStore = await cookies()
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
  )

  const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

  if (authError) {
    console.error('OAuth Code Exchange Error:', authError.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(authError.message)}`)
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user?.id)
      .single()

    // 🎯 APPEND ?sync=true to force client-side layout synchronization
    if (profile?.role === 'admin') {
      return NextResponse.redirect(`${origin}/dashboard?sync=true`)
    }
    return NextResponse.redirect(`${origin}/my-orders?sync=true`)
    
  } catch (err) {
    console.error('Profile parsing crashed on callback:', err)
    return NextResponse.redirect(`${origin}/my-orders?sync=true`)
  }
}

// ==========================================
// 2. POST HANDLER: Email & Password Sign In
// ==========================================
export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const cookieStore = await cookies()
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
    )

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()
  
    return NextResponse.json({ 
      message: 'Login successful!', 
      role: profile?.role || 'customer' 
    }, { status: 200 })

  } catch (err) {
    console.error("Login API Crash Details:", err)
    return NextResponse.json(
      { error: 'Something went wrong on our servers.' },
      { status: 500 }
    )
  }
}