/**
 * OAuth callback route — exchanges Google auth code for a Supabase session.
 * Route: GET /auth/callback?code=...
 * Redirects to /dashboard on success, /login?error=auth_failed on failure.
 */
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/** Handles redirect from Google OAuth after user signs in on /login */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}