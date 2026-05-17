'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Youtube from '@tiptap/extension-youtube'

export default function WritePage() {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [postType, setPostType] = useState<'blog' | 'review'>('blog')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Review fields
  const [gameName, setGameName] = useState('')
  const [score, setScore] = useState<number>(8)
  const [platform, setPlatform] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [verdict, setVerdict] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Link.configure({ openOnClick: false }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    content: '<p>Start writing...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] focus:outline-none p-6',
      },
    },
  })

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      return data.url ?? null
    } catch {
      alert('Upload failed. Try again.')
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file)
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file)
    if (url) {
      editor?.chain().focus().insertContent(
        `<video controls style="width:100%;border-radius:8px;margin:12px 0" src="${url}"></video><p></p>`
      ).run()
    }
  }

  function handleVideoEmbed() {
    if (!videoUrl.trim()) return
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (ytMatch) {
      editor?.commands.setYoutubeVideo({
        src: videoUrl,
        width: 640,
        height: 360,
      })
      setVideoUrl('')
      return
    }
    alert('Currently only YouTube URLs are supported for embedding.')
  }

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
                placeholder={"Great story\nSmooth gameplay"} rows={3}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Cons (one per line)</label>
              <textarea value={cons} onChange={(e) => setCons(e.target.value)}
                placeholder={"Too long\nRepetitive missions"} rows={3}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Verdict</label>
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

        {/* Divider */}
        <div className="w-px bg-gray-700 mx-1" />

        {/* Image upload */}
        <button
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 rounded text-xs font-mono bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition disabled:opacity-40"
        >
          {uploading ? '⏳' : '🖼️ Image'}
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        {/* Video upload */}
        <button
          onClick={() => videoInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 rounded text-xs font-mono bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition disabled:opacity-40"
        >
          {uploading ? '⏳' : '🎬 Video'}
        </button>
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
      </div>

      {/* YouTube/Twitch embed */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Paste YouTube or Twitch URL to embed..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleVideoEmbed}
          disabled={!videoUrl.trim()}
          className="px-3 py-1.5 rounded text-xs font-mono bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition disabled:opacity-40"
        >
          Embed ↗
        </button>
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