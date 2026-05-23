'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const EMOJIS = ['🔥', '👍', '❤️', '😂', '😮']

type ReactionCount = {
  emoji: string
  count: number
  reacted: boolean
}

export default function Reactions({ postId }: { postId: string }) {
  const supabase = createClient()
  const [reactions, setReactions] = useState<ReactionCount[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchReactions = useCallback(async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    setUser(currentUser)

    const { data } = await supabase
      .from('reactions')
      .select('emoji, user_id')
      .eq('post_id', postId)

    const counts = EMOJIS.map((emoji) => ({
      emoji,
      count: data?.filter((r) => r.emoji === emoji).length ?? 0,
      reacted: data?.some((r) => r.emoji === emoji && r.user_id === currentUser?.id) ?? false,
    }))

    setReactions(counts)
  }, [postId, supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchReactions()
  }, [fetchReactions])

  async function handleReaction(emoji: string) {
    if (!user) {
      window.location.assign('/login')
      return
    }
    setLoading(true)

    const existing = reactions.find((r) => r.emoji === emoji)

    if (existing?.reacted) {
      await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)
    } else {
      await supabase.from('reactions').insert({
        post_id: postId,
        user_id: user.id,
        emoji,
      })
    }

    await fetchReactions()
    setLoading(false)
  }

  return (
    <div className="flex flex-wrap gap-2 my-8">
      {reactions.map(({ emoji, count, reacted }) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          disabled={loading}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition border ${
            reacted
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
          }`}
        >
          <span>{emoji}</span>
          {count > 0 && <span>{count}</span>}
        </button>
      ))}
    </div>
  )
}