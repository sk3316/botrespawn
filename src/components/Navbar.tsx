/**
 * Site navigation bar — shown on every page via layout.tsx.
 * Client component: reads auth state and toggles Sign in vs Write / Sign out.
 * Features: glassmorphism, sticky, mobile hamburger menu with animation.
 */
'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import { User } from '@supabase/supabase-js'
import Notifications from './Notifications'

export default function Navbar() {
  // Single client instance per mount (avoids useEffect dependency warnings)
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /** Clears Supabase session and sends user to the home page */
  async function signOut() {
    await supabase.auth.signOut()
    setMobileOpen(false)
    window.location.href = '/'
  }

  return (
    <>
      <nav
        id="main-nav"
        className="glass-nav sticky top-0 z-50 border-b border-gray-800/60 px-4 sm:px-6 py-3 flex items-center justify-between"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tight group"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-green-400 group-hover:text-green-300 transition-colors duration-300">
            BOT
          </span>
          <span className="text-white group-hover:text-gray-200 transition-colors duration-300">
            RE
          </span>
          <span className="text-green-400 group-hover:text-green-300 transition-colors duration-300">
            SPAWN
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/reviews">Reviews</NavLink>

          {user ? (
            <div className="flex items-center gap-4">
              <Notifications userId={user.id} />
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/write"
                className="btn-glow bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-200"
              >
                + Write
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-glow bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 group"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-gray-400 group-hover:bg-white rounded-full transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-400 group-hover:bg-white rounded-full transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-400 group-hover:bg-white rounded-full transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="mobile-menu-backdrop md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-[53px] left-0 right-0 z-50 md:hidden glass-nav border-b border-gray-800/60 transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-6 gap-2">
          <MobileNavLink
            href="/blog"
            onClick={() => setMobileOpen(false)}
            delay="stagger-1"
          >
            📝 Blog
          </MobileNavLink>
          <MobileNavLink
            href="/reviews"
            onClick={() => setMobileOpen(false)}
            delay="stagger-2"
          >
            ⭐ Reviews
          </MobileNavLink>

          {user ? (
            <>
              <MobileNavLink
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                delay="stagger-3"
              >
                📊 Dashboard
              </MobileNavLink>
              <MobileNavLink
                href="/write"
                onClick={() => setMobileOpen(false)}
                delay="stagger-4"
              >
                ✍️ Write
              </MobileNavLink>
              <div className="border-t border-gray-800 my-2" />
              <button
                onClick={signOut}
                className="text-left text-sm text-gray-400 hover:text-red-400 py-3 px-4 rounded-lg hover:bg-gray-900/50 transition-all duration-200 animate-fade-in-up stagger-5"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 btn-glow bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-6 py-3 rounded-lg transition-colors duration-200 text-center animate-fade-in-up stagger-3"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

/** Desktop nav link with hover underline animation */
function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative text-sm text-gray-400 hover:text-white transition-colors duration-200 group py-1"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300 rounded-full" />
    </Link>
  )
}

/** Mobile nav link with animation */
function MobileNavLink({
  href,
  onClick,
  delay,
  children,
}: {
  href: string
  onClick: () => void
  delay: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-900/50 transition-all duration-200 animate-fade-in-up ${delay}`}
    >
      {children}
    </Link>
  )
}
