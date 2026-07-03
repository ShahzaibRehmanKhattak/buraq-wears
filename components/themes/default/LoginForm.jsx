"use client"
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Field Elements
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Interface Alerts
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Intercept Google callback patterns safely across local and production origins
  useEffect(() => {
    const hasCode = searchParams.get('code')
    const hashParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.hash.slice(1)) : null
    const hasError = searchParams.get('error') || searchParams.get('error_description') || hashParams?.get('error_description')

    if (hasCode || (hashParams && hashParams.get('access_token'))) {
      setMessage({ type: 'success', text: 'Welcome back! Redirecting you securely...' })
      
      // Dynamic Production Routing: Pulls the active production protocol + domain name directly 
      // from the client browser context, cleanly bypassing local hardcoding issues.
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          // Explicitly fallback to current production domain window parameters
          const targetOrigin = window.location.origin
          window.location.href = `${targetOrigin}/` 
        }
      }, 1500)
    } else if (hasError) {
      setMessage({
        type: 'error',
        text: searchParams.get('error_description') || 'Google authentication failed.'
      })
      router.replace('/login')
    }
  }, [searchParams, router])

  // Google Social Login Provider
  const handleGoogleSignIn = async () => {
    setMessage({ type: '', text: '' })
    try {
      if (typeof window === 'undefined') return

      const currentOrigin = window.location.origin
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // 🎯 FIXED: Directs the code parameter to your API server route handler so cookies get saved perfectly
          redirectTo: `${currentOrigin}/api/auth/login`,
          queryParams: {
            prompt: 'select_account' // Forces the Google account picker to show up cleanly
          }
        },
      })
      if (error) throw error
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  // Manual Form Credentials Sign In Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials provided.')
      }

      setMessage({ type: 'success', text: 'Login successful! Redirecting...' })

      const origin = window.location.origin
      if (data.role === 'admin') {
        window.location.href = `${origin}/dashboard`
      } else {
        window.location.href = `${origin}/my-orders`
      }

    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1200px] w-full mx-auto items-center">
      
      {/* Left Column Graphic Asset */}
      <div className="hidden lg:flex lg:col-span-6 h-[520px] bg-[#e8e8e8] rounded-lg overflow-hidden relative group shadow-sm">
        <img 
          alt="Editorial high-fashion" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex flex-col justify-end p-8">
          <p className="text-xs font-semibold text-white mb-1.5 tracking-[0.2em] uppercase opacity-90">Autumn / Winter 2026</p>
          <h2 className="text-3xl font-bold text-white max-w-xs leading-tight tracking-tight">Precision in every stitch.</h2>
        </div>
      </div>

      {/* Right Column Layout Form Area */}
      <div className="lg:col-span-6 flex flex-col justify-center max-w-[400px] mx-auto w-full">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl font-semibold text-black mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-[#4c4546]">Sign in to access your dashboard, orders, and custom settings.</p>
        </div>

        {/* Dynamic Alerts Banner */}
        {message.text && (
          <div className={`mb-6 p-4 rounded text-xs font-medium border transition-all ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
          }`}>
            {message.text}
          </div>
        )}

        {/* OAuth Social Button */}
        <button 
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full h-12 border border-[#cfc4c5] bg-white flex items-center justify-center gap-3 hover:bg-[#eeeeee] transition-all duration-200 active:scale-95 text-xs font-semibold tracking-wider text-black uppercase"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span>SIGN IN WITH GOOGLE</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-[#cfc4c5]"></div>
          <span className="px-4 text-xs text-[#4c4546] uppercase tracking-widest font-medium">or</span>
          <div className="flex-grow h-px bg-[#cfc4c5]"></div>
        </div>

        {/* Credentials Form Layout */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4c4546] uppercase tracking-wider">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 border border-[#cfc4c5] bg-white text-black focus:border-black focus:ring-0 transition-colors outline-none text-sm placeholder-[#7e7576]" 
              placeholder="alexander@ibna.com" 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-[#4c4546] uppercase tracking-wider">Password</label>
              <Link href="/login/forgot-password" className="text-xs text-[#4c4546] hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 border border-[#cfc4c5] bg-white text-black focus:border-black focus:ring-0 transition-colors outline-none text-sm placeholder-[#7e7576]" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-black text-white text-sm font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity active:scale-95 transition-transform mt-2 disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4c4546]">
            Don't have an account yet?{' '}
            <Link className="text-black font-semibold hover:underline" href="/register">Create Account</Link>
          </p>
        </div>
      </div>

    </div>
  )
}