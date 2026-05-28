/**
 * Reviews index — public list of published game reviews.
 * Route: /reviews
 * Joins posts + reviews table (score, game_name, platform, verdict) + author.
 */
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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Reviews</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Honest game reviews from the BotReSpawn community
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-4 sm:gap-6">
          {posts.map((post, i) => {
            // reviews is a one-to-one relation; Supabase returns it as an array
            const review = post.reviews?.[0]
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`glass-card card-hover p-5 sm:p-6 group animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs bg-blue-500/15 text-blue-300 font-bold px-2.5 py-1 rounded-full border border-blue-500/20">
                        ⭐ Review
                      </span>
                      {review?.platform && (
                        <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full border border-gray-700">
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

                    <h2 className="text-lg sm:text-xl font-black text-white mb-1 group-hover:text-green-400 transition-colors duration-300">
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
                  {review?.score != null && (
                    <div className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-2xl border-2 transition-all duration-300 group-hover:scale-110 ${
                      review.score >= 8
                        ? 'bg-green-900/50 border-green-500 text-green-400 score-high'
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
        <div className="glass-card p-12 sm:p-16 text-center animate-fade-in-up">
          <div className="text-4xl sm:text-5xl mb-4 animate-float">⭐</div>
          <h2 className="text-white font-bold text-xl mb-2">No reviews yet</h2>
          <p className="text-gray-400 text-sm mb-6">Be the first to review a game!</p>
          <Link
            href="/write"
            className="btn-glow bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-xl transition-all duration-300 text-sm inline-block"
          >
            Write a Review
          </Link>
        </div>
      )}
    </main>
  )
}