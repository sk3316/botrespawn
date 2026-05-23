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
    <div className="mt-16 border-t border-gray-800 pt-10">
      <h3 className="text-xl font-black text-white mb-8">
        💬 Comments ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div className="flex flex-col gap-4 mb-10">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-400 font-black">
                  {getInitial(comment.users?.username)}
                </div>
                <span className="text-sm font-bold text-white">
                  {comment.users?.username ?? 'Anonymous'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 mb-8 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-gray-500 text-sm">No comments yet. Be the first! 👇</p>
        </div>
      )}

      {user ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-bold px-6 py-2 rounded-lg text-sm transition"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-4">Sign in to leave a comment</p>
          <a href="/login" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-lg text-sm transition"
          >
            Sign in
          </a>
        </div>
      )}
    </div>
  )
}