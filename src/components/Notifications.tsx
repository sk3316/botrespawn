'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Notification = {
  id: string
  type: 'comment' | 'reaction' | 'follow'
  read: boolean
  created_at: string
  actor_id: string
  post_id: string | null
  users: { username: string } | null
  posts: { title: string; slug: string } | null
}

export default function Notifications({ userId }: { userId: string }) {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from('notifications')
      .select(`
        *,
        users!notifications_actor_id_fkey(username),
        posts!notifications_post_id_fkey(title, slug)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setNotifications(data as Notification[])
  }, [userId, supabase])

  useEffect(() => {
    fetchNotifications()

    // Realtime subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, () => {
        fetchNotifications()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchNotifications, supabase, userId])

  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
    fetchNotifications()
  }

  async function markRead(id: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    fetchNotifications()
  }

  function getMessage(n: Notification) {
    const actor = n.users?.username ?? 'Someone'
    const title = n.posts?.title ?? 'your post'
    switch (n.type) {
      case 'comment': return `💬 ${actor} commented on "${title}"`
      case 'reaction': return `🔥 ${actor} reacted to "${title}"`
      case 'follow': return `👥 ${actor} started following you`
      default: return 'New notification'
    }
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 border border-gray-700 hover:border-green-500 transition"
      >
        <span className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-black text-xs font-black rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-white font-black text-sm">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-green-400 hover:text-green-300 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No notifications yet 🔔
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markRead(n.id)
                    if (n.posts?.slug) window.location.href = `/blog/${n.posts.slug}`
                    setOpen(false)
                  }}
                  className={`px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition ${
                    !n.read ? 'bg-green-500/5 border-l-2 border-l-green-500' : ''
                  }`}
                >
                  <p className="text-sm text-gray-300 leading-relaxed">{getMessage(n)}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(n.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}