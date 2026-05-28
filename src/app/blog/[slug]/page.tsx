import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { tiptapJsonToHtml } from '@/lib/tiptap-html'
import Comments from '@/components/Comments'
import Reactions from '@/components/Reactions'
import ShareButtons from '@/components/ShareButtons'
import AffiliateLinks from '@/components/AffiliateLinks'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      users!posts_author_id_fkey(username, avatar_url),
      reviews(score, game_name, platform, pros, cons, verdict)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const review = post.reviews?.[0]

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Post header */}
      <div className="mb-8 sm:mb-10 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            post.post_type === 'review'
              ? 'bg-blue-500/15 text-blue-300 border-blue-500/20'
              : 'bg-purple-500/15 text-purple-300 border-purple-500/20'
          }`}>
            {post.post_type === 'review' ? '⭐ Review' : '📝 Blog'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.published_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 pb-6 sm:pb-8 border-b border-gray-800/60">
          <div className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-sm text-green-400 font-black">
            {post.users?.username?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <Link
              href={`/profile/${post.users?.username}`}
              className="text-sm text-white font-bold hover:text-green-400 transition-colors duration-200"
            >
              {post.users?.username ?? 'Anonymous'}
            </Link>
            <div className="text-xs text-gray-500">Author</div>
          </div>
        </div>
      </div>

      {/* Review score card */}
      {review && (
        <>
          <div className="glass-card p-5 sm:p-6 mb-8 sm:mb-10 animate-fade-in-up stagger-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-1">GAME</div>
                <div className="text-lg sm:text-xl font-black text-white">🎮 {review.game_name}</div>
                {review.platform?.[0] && (
                  <div className="text-xs text-gray-400 mt-1">Platform: {review.platform[0]}</div>
                )}
              </div>
              <div className={`shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-3xl border-2 transition-all duration-300 ${
                review.score >= 8
                  ? 'bg-green-900/50 border-green-500 text-green-400 score-high'
                  : review.score >= 6
                  ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400'
                  : 'bg-red-900/50 border-red-500 text-red-400'
              }`}>
                {review.score}
                <span className="text-xs font-normal opacity-60">/10</span>
              </div>
            </div>

            {/* Pros & Cons */}
            {(review.pros?.length > 0 || review.cons?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {review.pros?.length > 0 && (
                  <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                    <div className="text-xs font-bold text-green-400 mb-3">✅ PROS</div>
                    <ul className="flex flex-col gap-1.5">
                      {review.pros.map((pro: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-green-500 shrink-0">+</span>{pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons?.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                    <div className="text-xs font-bold text-red-400 mb-3">❌ CONS</div>
                    <ul className="flex flex-col gap-1.5">
                      {review.cons.map((con: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-red-500 shrink-0">−</span>{con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {review.verdict && (
              <div className="border-t border-gray-800/60 pt-4">
                <div className="text-xs text-gray-500 mb-1">VERDICT</div>
                <p className="text-white font-bold italic">&quot;{review.verdict}&quot;</p>
              </div>
            )}
          </div>

          {/* Affiliate links */}
          <AffiliateLinks gameName={review.game_name} />
        </>
      )}


      {/* Post content */}
      <div
        className="prose prose-invert max-w-none
        prose-headings:font-black
          prose-a:text-green-400
          prose-img:rounded-xl
          prose-img:w-full
          prose-blockquote:border-green-500
          prose-blockquote:text-gray-400
          animate-fade-in-up stagger-2"
        dangerouslySetInnerHTML={{ __html: tiptapJsonToHtml(post.content) }}
      />

      {/* Reactions */}
      <Reactions postId={post.id} />

      {/* Share buttons */}
      <ShareButtons title={post.title} slug={post.slug} />

      {/* Comments */}
      <Comments postId={post.id} />
  
    </main>
  )
}