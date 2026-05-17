/**
 * Browser-side Supabase client.
 * Use in Client Components ('use client') for auth, realtime, and client mutations.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local.
 */
import { createBrowserClient } from '@supabase/ssr'

/** Creates a Supabase client that runs in the browser (login, write editor, navbar). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
