import Link from 'next/link'

export default async function DashboardPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to BotReSpawn 👾</p>
        </div>
        <Link
          href="/write"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-lg transition text-sm"
        >
          + New Post
        </Link>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <h2 className="text-white font-bold text-xl mb-2">You're in!</h2>
        <p className="text-gray-400 text-sm">
          Your posts will appear here once you start writing.
        </p>
      </div>
    </main>
  )
}
