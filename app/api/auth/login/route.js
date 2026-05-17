import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    
    // Initialize the server client to handle cookie injection automatically
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

    // 1. Authenticate the user against Supabase Auth engine
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // 2. Pull the user's security role from your public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      // Fallback role if metadata synchronization is lingering
      return NextResponse.json({ 
        message: 'Login successful', 
        role: 'customer' 
      }, { status: 200 })
    }

    // 3. Return successful login status along with the verified role
    return NextResponse.json({ 
      message: 'Login successful!', 
      role: profile.role 
    }, { status: 200 })

  } catch (err) {
    console.error("Login API Crash Details:", err)
    return NextResponse.json(
      { error: 'Something went wrong on our servers. Please try again later.' },
      { status: 500 }
    )
  }
}