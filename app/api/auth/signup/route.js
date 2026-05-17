import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // 1. Basic field validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    // 2. Double-check your exact environment keys are present on the server
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      console.error("CRITICAL CONFIG ERROR: Missing Supabase keys in your environment variables.")
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      )
    }

    // 3. Initialize the client using your exact variable naming convention
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    )

    // 4. Submit registration directly with full metadata payloads
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          fullname: name,
          name: name,
          role: 'customer'
        }
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 5. Catch duplicate email attempts gracefully
    if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
      return NextResponse.json(
        { error: 'A user with this email address has already been registered.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Account created successfully! Please visit the login page to login.' },
      { status: 200 }
    )

  } catch (err) {
    console.error("Signup Endpoint Crash:", err)
    return NextResponse.json(
      { error: 'Something went wrong on our servers. Please try again later.' },
      { status: 500 }
    )
  }
}