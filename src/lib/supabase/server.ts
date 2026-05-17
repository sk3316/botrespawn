/**
 * Server-side Supabase client for App Router.
 * Use in Server Components, Route Handlers, and Server Actions.
 * Syncs auth session via HTTP cookies so RLS and getUser() work on the server.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client bound to the current request's cookies.
 * setAll may throw in Server Components (read-only); that is expected—session refresh
 * happens in middleware or route handlers where cookies can be written.
 */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored when called from a Server Component without mutable cookies
          }
        },
      },
    }
  )
}
