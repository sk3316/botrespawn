/**
 * Write / edit page — TipTap rich-text editor for blogs and game reviews.
 * Route: /write
 * Client component: saves to posts (+ reviews row when post_type is 'review').
 */
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function WritePage() {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [postType, setPostType] = useState<'blog' | 'review'>('blog')
  const [saving, setSaving] = useState(false)

  // Review-specific fields
  const [gameName, setGameName] = useState('')
  const [score, setScore] = useState<number>(8)
  const [platform, setPlatform] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [verdict, setVerdict] = useState('')

  // TipTap editor instance — StarterKit provides headings, lists, bold, etc.
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] focus:outline-none p-6',
      },
    },
  })

  /**
   * Saves post to Supabase. Creates slug from title + timestamp.
   * For reviews, also inserts into reviews table linked by post_id.
   */
  async function handleSave(status: 'draft' | 'published') {
    if (!title.trim() || !editor) return
    if (postType === 'review' && !gameName.trim()) {
      alert('Please enter a game name for your review.')
      return
    }
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

    // Insert main post row (content stored as TipTap JSON)
    const { data: post, error } = await supabase.from('posts').insert({
      author_id: user.id,
      title,
      slug,
      content: editor.getJSON(),
      excerpt: editor.getText().slice(0, 160),
      post_type: postType,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    }).select().single()

    if (error || !post) {
      alert('Something went wrong. Try again.')
      setSaving(false)
      return
    }

    // If review, save review details too
    if (postType === 'review') {
      const { error: reviewError } = await supabase.from('reviews').insert({
        post_id: post.id,
        game_name: gameName,
        score,
        platform: platform ? [platform] : [],
        pros: pros.split('\n').filter(Boolean),
        cons: cons.split('\n').filter(Boolean),
        verdict,
      })
      if (reviewError) {
        alert('Review details error: ' + reviewError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    router.push('/dashboard')
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value as 'blog' | 'review')}
          className="bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="blog">📝 Blog Post</option>
          <option value="review">⭐ Game Review</option>
        </select>

        <div className="flex gap-3">
          <button onClick={() => handleSave('draft')} disabled={saving || !title.trim()}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 px-4 py-2 rounded-lg text-sm transition">
            Save Draft
          </button>
          <button onClick={() => handleSave('published')} disabled={saving || !title.trim()}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-bold px-4 py-2 rounded-lg text-sm transition">
            {saving ? 'Publishing...' : 'Publish ↗'}
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-black bg-transparent text-white placeholder-gray-700 outline-none mb-6 border-b border-gray-800 pb-4"
      />

      {/* Review fields */}
      {postType === 'review' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm tracking-widest uppercase">⭐ Review Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Game Name *</label>
              <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)}
                placeholder="e.g. Elden Ring"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Platform</label>
              <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. PC, PS5, Xbox"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Score: <span className="text-green-400 font-bold">{score}/10</span></label>
            <input type="range" min="0" max="10" step="0.5" value={score}
              onChange={(e) => setScore(parseFloat(e.target.value))}
              className="w-full accent-green-500" />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0</span><span>5</span><span>10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pros (one per line)</label>
              <textarea value={pros} onChange={(e) => setPros(e.target.value)}
                placeholder={"Great story\nSmooth gameplay"}
                rows={3}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Cons (one per line)</label>
              <textarea value={cons} onChange={(e) => setCons(e.target.value)}
                placeholder={"Too long\nRepetitive missions"}
                rows={3}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Verdict (one line summary)</label>
            <input type="text" value={verdict} onChange={(e) => setVerdict(e.target.value)}
              placeholder="e.g. A must-play for any RPG fan"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
          { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
          { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
          { label: 'H3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }) },
          { label: '• List', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
          { label: '1. List', action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
          { label: '" Quote', action: () => editor?.chain().focus().toggleBlockquote().run(), active: editor?.isActive('blockquote') },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.action}
            className={`px-3 py-1.5 rounded text-xs font-mono transition ${
              btn.active ? 'bg-green-500 text-black font-bold' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl min-h-[300px] focus-within:border-green-500/50 transition">
        <EditorContent editor={editor} />
      </div>

      <p className="text-gray-600 text-xs mt-4">
        💡 Tip: You need a title before you can save or publish.
      </p>
    </main>
  )
}