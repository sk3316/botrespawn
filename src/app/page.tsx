/**
 * Home page (landing) — marketing hero, feature cards, and sign-up CTA.
 * Route: /
 * Static page; no database calls.
 */
import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      {/* Hero: headline and primary navigation to login / reviews */}
      <section className="hero-grid border-b border-gray-800/50 px-4 sm:px-6 py-16 sm:py-24 lg:py-32 text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Animated badge */}
          <div className="animate-fade-in-up">
            <div className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-5 py-2 rounded-full mb-6 sm:mb-8 tracking-widest animate-pulse-glow">
              🎮 GAMING COMMUNITY
            </div>
          </div>

          {/* Hero heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight animate-fade-in-up stagger-1">
            Reviews. Blogs. <br />
            <span className="gradient-text-hero">Your Voice. Every Platform.</span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
            BotReSpawn is where gamers write, review, and connect.
            Every post reaches Discord, X, Instagram and more — automatically.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up stagger-3">
            <Link
              href="/login"
              id="hero-cta-join"
              className="btn-glow bg-green-500 hover:bg-green-400 text-black font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base"
            >
              Join the Community
            </Link>
            <Link
              href="/reviews"
              id="hero-cta-browse"
              className="border border-gray-700 hover:border-green-500/50 text-gray-300 hover:text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base hover:bg-green-500/5"
            >
              Browse Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid — three value props for the product */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 lg:py-24 max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 animate-fade-in-up">
            Everything you need to <span className="gradient-text">level up</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto animate-fade-in-up stagger-1">
            Built for gamers who want to create, share, and be heard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: '✍️',
              title: 'Write & Blog',
              desc: 'A powerful editor built for gamers. Write reviews, guides, hot takes — whatever you want.',
              gradient: 'from-green-500/20 to-emerald-500/5',
              delay: 'stagger-1',
            },
            {
              icon: '⭐',
              title: 'Review Games',
              desc: 'Score games, list pros & cons, track your playtime. Your reviews, your criteria.',
              gradient: 'from-yellow-500/20 to-orange-500/5',
              delay: 'stagger-2',
            },
            {
              icon: '🌐',
              title: 'Reach Every Platform',
              desc: 'Every post auto-publishes to X, Discord, Instagram and more. One post, everywhere.',
              gradient: 'from-blue-500/20 to-cyan-500/5',
              delay: 'stagger-3',
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`glass-card card-hover p-6 sm:p-8 group animate-fade-in-up ${f.delay}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-green-400 transition-colors duration-300">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 border-t border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: '100%', label: 'Free forever' },
            { value: '5+', label: 'Platforms synced' },
            { value: '∞', label: 'Posts you can write' },
            { value: '< 1s', label: 'Auto-publish time' },
          ].map((stat, i) => (
            <div key={stat.label} className={`animate-fade-in-up stagger-${i + 1}`}>
              <div className="text-2xl sm:text-3xl font-black gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA — drives users to /login */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 lg:py-24 text-center relative">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 animate-fade-in-up">
            Ready to{' '}
            <span className="gradient-text-hero">Respawn?</span>
          </h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base animate-fade-in-up stagger-1">
            Join BotReSpawn and start writing today. It&apos;s free.
          </p>
          <Link
            href="/login"
            id="bottom-cta"
            className="btn-glow bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base inline-block animate-fade-in-up stagger-2"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 px-4 sm:px-6 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="text-lg font-black mb-1">
              <span className="text-green-400">BOT</span>
              <span className="text-white">RE</span>
              <span className="text-green-400">SPAWN</span>
            </div>
            <p className="text-gray-500 text-xs">
              A gaming community for creators.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-white transition-colors duration-200">
              Blog
            </Link>
            <Link href="/reviews" className="hover:text-white transition-colors duration-200">
              Reviews
            </Link>
            <Link href="/login" className="hover:text-white transition-colors duration-200">
              Sign in
            </Link>
          </div>
          <div className="text-gray-600 text-xs">
            © {new Date().getFullYear()} BotReSpawn
          </div>
        </div>
      </footer>
    </main>
  )
}
