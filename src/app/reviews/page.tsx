import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ReviewsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_author_id_fkey(username, avatar_url),
      reviews(score, game_name, platform, verdict)
    `)
    .eq('status', 'published')
    .eq('post_type', 'review')
    .order('published_at', { ascending: false })

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Reviews</h1>
        <p className="text-gray-400">Honest game reviews from the BotReSpawn community</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            const review = post.reviews?.[0]
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/40 transition group"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-blue-900 text-blue-300 font-bold px-2 py-1 rounded-full">
                        ⭐ Review
                      </span>
                      {review?.platform && (
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                          {review.platform[0]}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(post.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-white mb-1 group-hover:text-green-400 transition">
                      {post.title}
                    </h2>

                    {review?.game_name && (
                      <p className="text-green-400 text-sm font-bold mb-2">
                        🎮 {review.game_name}
                      </p>
                    )}

                    {post.excerpt && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {review?.verdict && (
                      <p className="text-gray-500 text-xs mt-2 italic">
                        &quot;{review.verdict}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-400 font-bold">
                        {post.users?.username?.[0]?.toUpperCase() ?? 'A'}
                      </div>
                      <span className="text-xs text-gray-500">
                        {post.users?.username ?? 'Anonymous'}
                      </span>
                    </div>
                  </div>

                  {/* Score badge */}
                  {review?.score && (
                    <div className={`shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center font-black text-2xl border-2 ${
                      review.score >= 8
                        ? 'bg-green-900/50 border-green-500 text-green-400'
                        : review.score >= 6
                        ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400'
                        : 'bg-red-900/50 border-red-500 text-red-400'
                    }`}>
                      {review.score}
                      <span className="text-xs font-normal opacity-60">/10</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h2 className="text-white font-bold text-xl mb-2">No reviews yet</h2>
          <p className="text-gray-400 text-sm mb-6">Be the first to review a game!</p>
          <Link
            href="/write"
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-lg transition text-sm"
          >
            Write a Review
          </Link>
        </div>
      )}
    </main>
  )
}