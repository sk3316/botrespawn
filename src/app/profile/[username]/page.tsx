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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-10 pb-10 border-b border-gray-800/60 text-center sm:text-left">
        <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-green-500 to-teal-400 p-[2px] shadow-lg shadow-green-500/15 animate-pulse-glow">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.username}
              className="w-full h-full rounded-full object-cover bg-gray-950"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center text-3xl sm:text-4xl text-green-400 font-black">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1 truncate">
            {profile.display_name ?? profile.username}
          </h1>
          <div className="text-gray-400 text-sm font-semibold tracking-wide">@{profile.username}</div>
          {profile.bio && (
            <p className="text-gray-300 mt-3 text-sm leading-relaxed max-w-xl mx-auto sm:mx-0">{profile.bio}</p>
          )}

          <div className="grid grid-cols-2 md:flex md:flex-row gap-3 sm:gap-4 mt-6">
            <div className="glass-card p-3 min-w-[80px] sm:min-w-[100px] text-center shadow-sm hover:translate-y-0">
              <div className="text-white font-black text-xl leading-none">{posts?.length ?? 0}</div>
              <div className="text-gray-500 text-[10px] mt-1.5 font-bold uppercase tracking-wider">Posts</div>
            </div>
            <div className="glass-card p-3 min-w-[80px] sm:min-w-[100px] text-center shadow-sm hover:translate-y-0">
              <div className="text-white font-black text-xl leading-none">{blogs.length}</div>
              <div className="text-gray-500 text-[10px] mt-1.5 font-bold uppercase tracking-wider">Blogs</div>
            </div>
            <div className="glass-card p-3 min-w-[80px] sm:min-w-[100px] text-center shadow-sm hover:translate-y-0">
              <div className="text-white font-black text-xl leading-none">{reviews.length}</div>
              <div className="text-gray-500 text-[10px] mt-1.5 font-bold uppercase tracking-wider">Reviews</div>
            </div>
            <div className="glass-card p-3 min-w-[80px] sm:min-w-[100px] text-center border-green-500/20 shadow-sm hover:translate-y-0">
              <div className="text-green-400 font-black text-xl leading-none">{profile.xp ?? 0}</div>
              <div className="text-gray-500 text-[10px] mt-1.5 font-bold uppercase tracking-wider">XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white mb-4 tracking-tight">Published Posts</h2>
          <div className="flex flex-col gap-4">
            {posts.map((post, idx) => {
              const review = post.reviews?.[0]
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="glass-card card-hover p-5 group flex items-center justify-between gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(idx * 70, 500)}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        post.post_type === 'review'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                      }`}>
                        {post.post_type === 'review' ? '⭐ Review' : '📝 Blog'}
                      </span>
                      {review?.game_name && (
                        <span className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                          🎮 {review.game_name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-snug group-hover:text-green-400 transition-colors duration-200 truncate">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(post.published_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </div>
                  </div>
                  {review?.score != null && (
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-xl border-2 shrink-0 transition-all duration-300 group-hover:scale-105 ${
                      review.score >= 8
                        ? 'bg-green-900/50 border-green-500 text-green-400 score-high'
                        : review.score >= 6
                        ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400'
                        : 'bg-red-900/50 border-red-500 text-red-400'
                    }`}>
                      {review.score}
                      <span className="text-[10px] font-normal opacity-60">/10</span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card p-16 text-center animate-fade-in-up">
          <div className="text-5xl mb-4 animate-float">🎮</div>
          <h2 className="text-white font-bold text-xl mb-2">No posts yet</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">This user has not published anything yet.</p>
        </div>
      )}
    </main>
  )
}