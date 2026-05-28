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
  const [bouncing, setBouncing] = useState<Record<string, boolean>>({})

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

    // Trigger bounce animation
    setBouncing((prev) => ({ ...prev, [emoji]: true }))
    setTimeout(() => {
      setBouncing((prev) => ({ ...prev, [emoji]: false }))
    }, 400)

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
    <div className="flex flex-wrap items-center gap-2.5 my-8">
      {reactions.map(({ emoji, count, reacted }) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
            reacted
              ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-sm shadow-green-500/5'
              : 'bg-gray-900/60 border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-white hover:bg-gray-900'
          }`}
        >
          <span className={`inline-block ${bouncing[emoji] ? 'emoji-bounce' : ''}`}>{emoji}</span>
          {count > 0 && <span className="text-xs">{count}</span>}
        </button>
      ))}
    </div>
  )
}