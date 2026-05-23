import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, reviews(score, game_name)')
    .eq('author_id', profile.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const blogs = posts?.filter((p) => p.post_type === 'blog') ?? []
  const reviews = posts?.filter((p) => p.post_type === 'review') ?? []

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Profile header */}
      <div className="flex items-center gap-6 mb-12 pb-12 border-b border-gray-800">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center text-3xl text-green-400 font-black">
          {profile.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            {profile.display_name ?? profile.username}
          </h1>
          <div className="text-gray-400 text-sm mb-3">@{profile.username}</div>
          {profile.bio && (
            <p className="text-gray-400 text-sm max-w-md">{profile.bio}</p>
          )}
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <div className="text-white font-black text-lg">{posts?.length ?? 0}</div>
              <div className="text-gray-500 text-xs">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-white font-black text-lg">{blogs.length}</div>
              <div className="text-gray-500 text-xs">Blogs</div>
            </div>
            <div className="text-center">
              <div className="text-white font-black text-lg">{reviews.length}</div>
              <div className="text-gray-500 text-xs">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-black text-lg">{profile.xp ?? 0}</div>
              <div className="text-gray-500 text-xs">XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-white mb-2">Posts</h2>
          {posts.map((post) => {
            const review = post.reviews?.[0]
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500/40 transition group flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      post.post_type === 'review'
                        ? 'bg-blue-900 text-blue-300'
                        : 'bg-purple-900 text-purple-300'
                    }`}>
                      {post.post_type === 'review' ? '⭐ Review' : '📝 Blog'}
                    </span>
                    {review?.game_name && (
                      <span className="text-xs text-green-400 font-bold">
                        🎮 {review.game_name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold group-hover:text-green-400 transition">
                    {post.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(post.published_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </div>
                </div>
                {review?.score && (
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black text-lg border-2 shrink-0 ${
                    review.score >= 8
                      ? 'bg-green-900/50 border-green-500 text-green-400'
                      : review.score >= 6
                      ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400'
                      : 'bg-red-900/50 border-red-500 text-red-400'
                  }`}>
                    {review.score}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-white font-bold text-xl mb-2">No posts yet</h2>
          <p className="text-gray-400 text-sm">This user has not published anything yet.</p>
        </div>
      )}
    </main>
  )
}