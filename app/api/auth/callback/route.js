import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 🎯 KEEP THIS: Handles the initial click redirect from email
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/login/forgot-password/confirm'

  if (code) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('Server Session Exchange Failed:', error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid or expired recovery credentials`)
}

// 🎯 NEW ADDITION: Handles the password saving form submission securely using server cookies
export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
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

    // Securely update user details on the server side using the session cookie
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Clean up cookies by logging the user out safely after changing the password
    await supabase.auth.signOut()

    return NextResponse.json({ success: true, message: 'Password updated successfully!' })
  } catch (err) {
    console.error('Password API submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}