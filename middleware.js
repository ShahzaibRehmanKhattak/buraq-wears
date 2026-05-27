import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // 1. Create an initial response object so we can mutate headers safely
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Initialize Supabase Server Client to manage auth session cookies cleanly
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) { 
          return request.cookies.get(name)?.value 
        },
        set(name, value, options) {
          // Sync with the request object to pass downstream
          request.cookies.set({ name, value, ...options })
          // Instantiate a fresh response object to carry the mutated cookie definitions downstream
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Fetch the session user securely from Supabase Auth
  // This explicitly ensures the middleware refreshes expired auth cookies if needed.
  const { data: { user } } = await supabase.auth.getUser()
  const currentPath = request.nextUrl.pathname

  // 4. Define Route Layout Groupings
  const isAuthPage = currentPath === '/login' || currentPath === '/register'
  
  // Admin Panel Paths
  const isAdminPage = currentPath.startsWith('/dashboard') || 
                      currentPath.startsWith('/products') || 
                      currentPath.startsWith('/orders') || 
                      currentPath.startsWith('/settings')

  // Customer Account Paths
  const isCustomerPage = currentPath.startsWith('/my-orders') || 
                         currentPath.startsWith('/my-cart') || 
                         currentPath.startsWith('/my-wishlist')

  // RULE A: User is NOT logged in
  if (!user) {
    if (isAdminPage || isCustomerPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return response
  }

  // RULE B: User IS logged in -> Fetch their security role from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'customer'

  // RULE C: Block authenticated sessions from backtracking to login or register
  if (isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = userRole === 'admin' ? '/dashboard' : '/my-orders'
    return NextResponse.redirect(url)
  }

  // RULE D: If a 'customer' tries to break into the Admin backend paths
  if (isAdminPage && userRole !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/my-orders'
    return NextResponse.redirect(url)
  }

  // RULE E: If an 'admin' tries to jump into Customer-facing profile interfaces
  if (isCustomerPage && userRole === 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Return response containing updated cookie mutations
  return response
}

// 5. Matcher configuration tracking all relevant route segments
export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/products/:path*',
    '/orders/:path*',
    '/settings/:path*',
    '/my-orders/:path*',
    '/my-cart/:path*',
    '/my-wishlist/:path*',
  ],
}