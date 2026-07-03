'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getTheme } from '@/components/themes'
const Theme = getTheme("premium"); // Dynamically switch between "default" and "luxury" themes based on user preference or context



export default function LoginPage() {
  return (
    <div className="bg-[#fafafa] text-black min-h-screen flex flex-col font-sans antialiased">
      <main className="flex-grow flex items-center justify-center py-16 px-5">
        <Suspense fallback={<div className="text-sm tracking-widest text-neutral-400">LOADING UI...</div>}>
          <Theme.LoginForm />
        </Suspense>
      </main>
    </div>
  )
}