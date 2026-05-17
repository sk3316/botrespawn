/**
 * User dashboard — lists all posts (drafts + published) for the signed-in author.
 * Route: /dashboard
 * Protected: redirects to /login if not authenticated.
 */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch only this user's posts, newest first
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your posts on BotReSpawn</p>
        </div>
        <Link
          href="/write"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-lg transition text-sm"
        >
          + New Post
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{post.title}</h3>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    post.post_type === 'review'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-purple-900 text-purple-300'
                  }`}>
                    {post.post_type === 'review' ? '⭐ Review' : '📝 Blog'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    post.status === 'published'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {post.status === 'published' ? '✅ Published' : '📄 Draft'}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 shrink-0">
                {new Date(post.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-white font-bold text-xl mb-2">No posts yet</h2>
          <p className="text-gray-400 text-sm">Hit the button above and write your first post!</p>
        </div>
      )}
    </main>
  )
}