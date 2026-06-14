import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const currentPath = request.nextUrl.pathname

  // ⚡️ ANTI-LOOP PROTECTION: Exclude static assets, core APIs, and explicit error handlers
  // This gives Next.js a clear line of sight to render loading.jsx and not-found.jsx safely.
  if (
    currentPath.startsWith('/_next') ||
    currentPath.startsWith('/api') ||
    currentPath.includes('.') || 
    currentPath === '/favicon.ico' ||
    currentPath === '/404' // ◄ Crucial: Allows Next.js to parse the custom 404 boundary unhindered
  ) {
    return NextResponse.next()
  }

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
          request.cookies.set({ name, value, ...options })
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
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Define Route Layout Groupings
  const isAuthPage = currentPath === '/login' || currentPath === '/register'
  
  // Admin Panel Paths
  const isAdminPage = currentPath.startsWith('/dashboard') || 
                      currentPath.startsWith('/products') || 
                      currentPath.startsWith('/orders') || 
                      currentPath.startsWith('/settings') ||
                      currentPath.startsWith('/categories')

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

  return response
}

// 5. Matcher configuration tracking all relevant route segments
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - explicit asset signatures
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}