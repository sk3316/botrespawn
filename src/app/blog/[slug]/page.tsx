import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { tiptapJsonToHtml } from '@/lib/tiptap-html'
import Comments from '@/components/Comments'
import Reactions from '@/components/Reactions'
import ShareButtons from '@/components/ShareButtons'

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
    <main className="max-w-2xl mx-auto px-6 py-12">

      {/* Post header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            post.post_type === 'review'
              ? 'bg-blue-900 text-blue-300'
              : 'bg-purple-900 text-purple-300'
          }`}>
            {post.post_type === 'review' ? '⭐ Review' : '📝 Blog'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.published_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-4xl font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 pb-8 border-b border-gray-800">
          <div className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-sm text-green-400 font-black">
            {post.users?.username?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <div className="text-sm text-white font-bold">
              {post.users?.username ?? 'Anonymous'}
            </div>
            <div className="text-xs text-gray-500">Author</div>
          </div>
        </div>
      </div>

      {/* Review score card */}
      {review && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">GAME</div>
              <div className="text-xl font-black text-white">🎮 {review.game_name}</div>
              {review.platform?.[0] && (
                <div className="text-xs text-gray-400 mt-1">Platform: {review.platform[0]}</div>
              )}
            </div>
            <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center font-black text-3xl border-2 ${
              review.score >= 8
                ? 'bg-green-900/50 border-green-500 text-green-400'
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
            <div className="grid grid-cols-2 gap-4 mb-4">
              {review.pros?.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-green-400 mb-2">✅ PROS</div>
                  <ul className="flex flex-col gap-1">
                    {review.pros.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-green-500 shrink-0">+</span>{pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons?.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-red-400 mb-2">❌ CONS</div>
                  <ul className="flex flex-col gap-1">
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
            <div className="border-t border-gray-800 pt-4">
              <div className="text-xs text-gray-500 mb-1">VERDICT</div>
              <p className="text-white font-bold italic">&quot;{review.verdict}&quot;</p>
            </div>
          )}
        </div>
      )}


      {/* Post content */}
      <div
        className="prose prose-invert max-w-none
        prose-headings:font-black
          prose-a:text-green-400
          prose-img:rounded-xl
          prose-img:w-full
          prose-blockquote:border-green-500
          prose-blockquote:text-gray-400"
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