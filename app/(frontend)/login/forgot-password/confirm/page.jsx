'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, Eye, EyeOff } from 'lucide-react'

export default function ConfirmPasswordPage() {
  const router = useRouter()

  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleApplyNewPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // 🎯 Send the update request directly to our server-side handler via API fetch
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to update your password profile configuration.')
      }

      setMessage({
        type: 'success',
        text: 'Password updated successfully! Redirecting you back to sign in...'
      })
      
      setNewPassword('')

      // Redirect back to login screen smoothly
      setTimeout(() => {
        router.push('/login')
      }, 2500)

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fafafa] text-black min-h-screen flex items-center justify-center py-16 px-5 font-sans antialiased">
      <div className="bg-white text-black w-full max-w-[440px] rounded-lg shadow-2xl border border-black/[0.08] p-6 md:p-8 flex flex-col mx-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-700">
            <KeyRound size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-black mb-1.5">Set New Password</h3>
          <p className="text-xs text-[#6e6566] max-w-[290px] mx-auto leading-relaxed">
            Your verification link has been authorized. Enter your new account password below to finish the setup.
          </p>
        </div>

        {message.text && (
          <div className={`mb-5 p-4 rounded text-xs font-medium border leading-relaxed ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            {message.text}
          </div>
        )}

        {message.type !== 'success' && (
          <form onSubmit={handleApplyNewPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-[#4c4546] uppercase tracking-widest">New Password Configuration</label>
              <div className="relative flex items-center">
                <input 
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-11 border border-[#cfc4c5] bg-white text-black focus:border-black focus:ring-0 transition-colors outline-none text-sm placeholder-[#9e9596]" 
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 text-neutral-400 hover:text-black transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-black text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity active:scale-[0.98] mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'SAVING CHANGES...' : 'CONFIRM NEW PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}