/**
 * Root layout — wraps every page with fonts, global CSS, and the Navbar.
 * Route: applies to all routes under src/app/
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

/** SEO title and description for the whole site */
export const metadata: Metadata = {
  title: 'BotReSpawn',
  description: 'A gaming community for bloggers, reviewers and players',
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
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
