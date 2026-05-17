/**
 * Site navigation bar — shown on every page via layout.tsx.
 * Client component: reads auth state and toggles Sign in vs Write / Sign out.
 */
'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  // Single client instance per mount (avoids useEffect dependency warnings)
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)

  // Load current user and subscribe to login/logout changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  /** Clears Supabase session and sends user to the home page */
  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-black text-green-400 tracking-tight">
        BOT<span className="text-white">RE</span>SPAWN
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition">
          Blog
        </Link>
        <Link href="/reviews" className="text-sm text-gray-400 hover:text-white transition">
          Reviews
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/write"
              className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition">
              + Write
            </Link>
            <button onClick={signOut}
              className="text-sm text-gray-400 hover:text-white transition">
              Sign out
            </button>
          </div>
        ) : (
          <Link href="/login"
            className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
