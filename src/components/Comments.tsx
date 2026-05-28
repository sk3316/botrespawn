'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Comment = {
  id: string
  content: string
  created_at: string
  users: { username: string }
}

export default function Comments({ postId }: { postId: string }) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, users!comments_author_id_fkey(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (data) setComments(data as Comment[])
  }, [postId, supabase])

  useEffect(() => {
    const loadComments = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      await fetchComments()
    }

    loadComments()
  }, [fetchComments, supabase])

  async function handleSubmit() {
    if (!content.trim() || !user) return
    setLoading(true)
    await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      content,
    })
    setContent('')
    await fetchComments()
    setLoading(false)
  }

  function getInitial(username: string | undefined) {
    if (!username) return 'A'
    return username[0].toUpperCase()
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="mt-16 border-t border-gray-800/60 pt-10 animate-fade-in">
      <h3 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-2">
        <span>💬</span> Comments <span className="text-sm bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700/50">{comments.length}</span>
      </h3>

      {comments.length > 0 ? (
        <div className="flex flex-col gap-4 mb-8">
          {comments.map((comment, idx) => (
            <div
              key={comment.id}
              className="glass-card p-5 animate-fade-in-up hover:translate-y-0"
              style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs text-green-400 font-black shrink-0">
                  {getInitial(comment.users?.username)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm font-bold text-white">
                    {comment.users?.username ?? 'Anonymous'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    • {formatDate(comment.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pl-1">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-10 text-center mb-8 hover:translate-y-0">
          <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {user ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts on this post..."
            rows={3}
            className="w-full bg-gray-950 border border-gray-850 focus:border-green-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-green-500/20 resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="btn-glow bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:pointer-events-none text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-all duration-200"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 text-center hover:translate-y-0">
          <p className="text-gray-400 text-sm mb-4">Sign in to join the conversation</p>
          <a
            href="/login"
            className="btn-glow bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-all duration-200 inline-block"
          >
            Sign in
          </a>
        </div>
      )}
    </div>
  )
}