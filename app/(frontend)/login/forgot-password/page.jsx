'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const currentOrigin = window.location.origin
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Redirects straight to your actual api route location path
        redirectTo: `${currentOrigin}/api/auth/callback?next=/login/forgot-password/confirm`,
      })
      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: 'A password recovery link has been dispatched! Please check your email inbox to update your password.' 
      })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fafafa] text-black min-h-screen flex items-center justify-center py-16 px-5 font-sans antialiased">
      <div className="bg-white text-black w-full max-w-[440px] rounded-lg shadow-2xl border border-black/[0.08] p-6 md:p-8 flex flex-col mx-auto">
        
        <div className="mb-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs text-[#4c4546] hover:text-black transition-colors font-medium">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-700">
            <ShieldCheck size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-black mb-1.5">Recover Password</h3>
          <p className="text-xs text-[#6e6566] max-w-[290px] mx-auto leading-relaxed">
            Provide your account email address to receive a secure recovery verification link.
          </p>
        </div>

        {message.text && (
          <div className={`mb-5 p-4 rounded text-xs font-medium border leading-relaxed ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-[#4c4546] uppercase tracking-widest">Account Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-neutral-400">
                <Mail size={16} strokeWidth={1.5} />
              </span>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-11 pr-4 border border-[#cfc4c5] bg-white text-black focus:border-black focus:ring-0 transition-colors outline-none text-sm placeholder-[#9e9596]" 
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-black text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity active:scale-[0.98] mt-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'DISPATCHING...' : 'SEND RECOVERY LINK'}
          </button>
        </form>
      </div>
    </div>
  )
}