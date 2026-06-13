import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    
    // Initialize Supabase SSR Client using your standard pattern
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

    // Revoke the session tokens on Supabase auth servers
    await supabase.auth.signOut()

    // TARGETED COOKIE WIPE: Shred all active Auth/Supabase session chunks from the browser
    const allCookies = cookieStore.getAll()
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-') || cookie.name.includes('auth')) {
        cookieStore.set({
          name: cookie.name,
          value: '',
          maxAge: -1, // Tells the browser to destroy the cookie immediately
          path: '/',
        })
      }
    })

    return NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 })

  } catch (err) {
    console.error('Logout API Crash Details:', err)
    return NextResponse.json({ error: 'Failed to destroy secure cookie block session' }, { status: 500 })
  }
}