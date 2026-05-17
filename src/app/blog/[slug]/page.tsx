import { createClient } from '@/lib/supabase/server'
import { tiptapJsonToHtml, type TiptapDocument } from '@/lib/tiptap-html'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({
  params,
}: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, users(username, avatar_url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-purple-900 text-purple-300 font-bold px-2 py-1 rounded-full">
            📝 Blog
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.published_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-4xl font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 pb-8 border-b border-gray-800">
          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-sm text-green-400 font-bold">
            {post.users?.username?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <span className="text-sm text-gray-400">
            {post.users?.username ?? 'Anonymous'}
          </span>
        </div>
      </div>

      <div
        className="prose prose-invert max-w-none prose-headings:font-black prose-a:text-green-400"
        dangerouslySetInnerHTML={{
          __html: tiptapJsonToHtml(post.content as TiptapDocument),
        }}
      />
    </main>
  )
}
