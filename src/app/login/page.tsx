'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            BOT<span className="text-green-400">RE</span>SPAWN
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to write, review, and connect
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-white font-bold text-lg mb-6 text-center">
            Welcome back 👾
          </h2>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-gray-600 text-xs text-center mt-6">
            By signing in you agree to our terms. <br />
            No spam. Ever.
          </p>
        </div>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1L6 33.2C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C40.9 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}