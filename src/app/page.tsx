import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-800 px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest">
            GAMING COMMUNITY
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Reviews. Blogs. <br />
            <span className="text-green-400">Your Voice. Every Platform.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            BotReSpawn is where gamers write, review, and connect. 
            Every post reaches Discord, X, Instagram and more — automatically.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login"
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-lg transition text-sm">
              Join the Community
            </Link>
            <Link href="/reviews"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-bold px-8 py-3 rounded-lg transition text-sm">
              Browse Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '✍️',
              title: 'Write & Blog',
              desc: 'A powerful editor built for gamers. Write reviews, guides, hot takes — whatever you want.',
            },
            {
              icon: '⭐',
              title: 'Review Games',
              desc: 'Score games, list pros & cons, track your playtime. Your reviews, your criteria.',
            },
            {
              icon: '🌐',
              title: 'Reach Every Platform',
              desc: 'Every post auto-publishes to X, Discord, Instagram and more. One post, everywhere.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/30 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 px-6 py-20 text-center">
        <h2 className="text-3xl font-black text-white mb-4">
          Ready to <span className="text-green-400">Respawn?</span>
        </h2>
        <p className="text-gray-400 mb-8">Join BotReSpawn and start writing today. It's free.</p>
        <Link href="/login"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-lg transition text-sm">
          Get Started Free
        </Link>
      </section>
    </main>
  )
}