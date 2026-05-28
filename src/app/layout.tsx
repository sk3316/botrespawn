/**
 * Root layout — wraps every page with fonts, global CSS, and the Navbar.
 * Route: applies to all routes under src/app/
 */
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

/** SEO title and description for the whole site */
export const metadata: Metadata = {
  title: 'BotReSpawn — Gaming Community for Bloggers & Reviewers',
  description:
    'Write reviews, publish blogs, and connect with gamers. Every post reaches Discord, X, Instagram and more — automatically.',
}

/** Viewport configuration (Next.js 16 best practice) */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

/**
 * RootLayout — shared shell: html/body, Inter font, dark theme, Navbar + page content.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-950 text-white min-h-screen antialiased`}
      >
        <Navbar />
        <div className="animate-fade-in">{children}</div>
      </body>
    </html>
  )
}
