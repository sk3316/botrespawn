'use client'

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://botrespawn.vercel.app/blog/${slug}`
  const encoded = encodeURIComponent(url)
  const titleEncoded = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied!')
    } catch (err) {
      alert('Failed to copy link')
    }
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-800">
      <div className="text-xs text-gray-500 font-bold tracking-widest mb-4">SHARE THIS POST</div>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${titleEncoded}&url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on X`}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black border border-gray-700 hover:border-white text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          𝕏 Share on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Facebook`}
          className="flex items-center gap-2 bg-gray-900 hover:bg-blue-900 border border-gray-700 hover:border-blue-500 text-gray-400 hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          Facebook
        </a>
        <a
          href={`https://wa.me/?text=${titleEncoded}%20${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on WhatsApp`}
          className="flex items-center gap-2 bg-gray-900 hover:bg-green-900 border border-gray-700 hover:border-green-500 text-gray-400 hover:text-green-400 px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          💬 WhatsApp
        </a>
        <a
          href={`https://www.reddit.com/submit?url=${encoded}&title=${titleEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Reddit`}
          className="flex items-center gap-2 bg-gray-900 hover:bg-orange-900 border border-gray-700 hover:border-orange-500 text-gray-400 hover:text-orange-400 px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          🔴 Reddit
        </a>
        <a
          href={`https://t.me/share/url?url=${encoded}&text=${titleEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Telegram`}
          className="flex items-center gap-2 bg-gray-900 hover:bg-blue-900 border border-gray-700 hover:border-blue-400 text-gray-400 hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          ✈️ Telegram
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-green-500 text-gray-400 hover:text-green-400 px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          🔗 Copy Link
        </button>
      </div>
    </div>
  )
}