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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-gray-800/60">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Your posts on BotReSpawn</p>
        </div>
        <Link
          href="/write"
          className="btn-glow bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span>+</span> New Post
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up"
              style={{ animationDelay: `${Math.min(idx * 70, 500)}ms` }}
            >
              <div className="space-y-3 min-w-0">
                <h3 className="text-white font-bold text-lg leading-snug truncate">
                  {post.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-all duration-300 ${
                    post.post_type === 'review'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                  }`}>
                    {post.post_type === 'review' ? '⭐ Review' : '📝 Blog'}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-all duration-300 ${
                    post.status === 'published'
                      ? 'bg-green-500/10 text-green-300 border-green-500/20 animate-pulse-glow'
                      : 'bg-gray-800 text-gray-400 border-gray-700/50'
                  }`}>
                    {post.status === 'published' ? '✅ Published' : '📄 Draft'}
                  </span>
                </div>
              </div>
              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 border-t border-gray-800/40 sm:border-0 pt-3 sm:pt-0 shrink-0">
                <span className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {post.status === 'published' && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs text-green-400 hover:text-green-300 transition-colors duration-200 underline decoration-dotted underline-offset-4"
                  >
                    View Post
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center animate-fade-in-up">
          <div className="text-5xl mb-4 animate-float">🎮</div>
          <h2 className="text-white font-bold text-xl mb-2">No posts yet</h2>
          <p className="text-gray-400 text-sm max-w-sm mb-6">Hit the button above and write your first post!</p>
          <Link
            href="/write"
            className="btn-glow bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-all duration-200"
          >
            Create Your First Post
          </Link>
        </div>
      )}
    </main>
  )
}