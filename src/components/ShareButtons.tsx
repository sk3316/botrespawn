'use client'

import { useState } from 'react'

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://botrespawn.vercel.app/blog/${slug}`
  const encoded = encodeURIComponent(url)
  const titleEncoded = encodeURIComponent(title)
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-800/60">
      <div className="text-[10px] text-gray-500 font-bold tracking-widest mb-4 uppercase">SHARE THIS POST</div>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
        <a
          href={`https://twitter.com/intent/tweet?text=${titleEncoded}&url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on X`}
          className="flex items-center justify-center sm:justify-start gap-2 bg-gray-900/60 hover:bg-black border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300"
        >
          <span>𝕏</span> <span className="hidden xs:inline">X</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Facebook`}
          className="flex items-center justify-center sm:justify-start gap-2 bg-gray-900/60 hover:bg-blue-950 border border-gray-800 hover:border-blue-800 text-gray-400 hover:text-blue-400 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300"
        >
          <span>👥</span> <span className="hidden xs:inline">Facebook</span>
        </a>
        <a
          href={`https://wa.me/?text=${titleEncoded}%20${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on WhatsApp`}
          className="flex items-center justify-center sm:justify-start gap-2 bg-gray-900/60 hover:bg-green-950 border border-gray-800 hover:border-green-800 text-gray-400 hover:text-green-400 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300"
        >
          <span>💬</span> <span className="hidden xs:inline">WhatsApp</span>
        </a>
        <a
          href={`https://www.reddit.com/submit?url=${encoded}&title=${titleEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Reddit`}
          className="flex items-center justify-center sm:justify-start gap-2 bg-gray-900/60 hover:bg-orange-950 border border-gray-800 hover:border-orange-850 text-gray-400 hover:text-orange-450 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300"
        >
          <span>🔴</span> <span className="hidden xs:inline">Reddit</span>
        </a>
        <a
          href={`https://t.me/share/url?url=${encoded}&text=${titleEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Telegram`}
          className="flex items-center justify-center sm:justify-start gap-2 bg-gray-900/60 hover:bg-blue-950 border border-gray-800 hover:border-blue-850 text-gray-400 hover:text-blue-400 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300"
        >
          <span>✈️</span> <span className="hidden xs:inline">Telegram</span>
        </a>
        <button
          onClick={copyLink}
          className={`flex items-center justify-center sm:justify-start gap-2 border px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
            copied
              ? 'bg-green-500/10 border-green-500 text-green-400'
              : 'bg-gray-900/60 border-gray-800 hover:border-green-500/40 text-gray-400 hover:text-green-400'
          }`}
        >
          <span>🔗</span> <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  )
}