"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<"blog" | "review">("blog");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[400px] focus:outline-none p-6",
      },
    },
  });

  async function handleSave(status: "draft" | "published") {
    if (!title.trim() || !editor) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      title,
      slug,
      content: editor.getJSON(),
      excerpt: editor.getText().slice(0, 160),
      post_type: postType,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    setSaving(false);
    if (!error) router.push("/dashboard");
    else alert("Something went wrong. Try again.");
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value as "blog" | "review")}
          className="bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="blog">📝 Blog Post</option>
          <option value="review">⭐ Game Review</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving || !title.trim()}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 px-4 py-2 rounded-lg text-sm transition"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving || !title.trim()}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-bold px-4 py-2 rounded-lg text-sm transition"
          >
            {saving ? "Publishing..." : "Publish ↗"}
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

      {/* Toolbar */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          {
            label: "B",
            title: "Bold",
            action: () => editor?.chain().focus().toggleBold().run(),
            active: editor?.isActive("bold"),
          },
          {
            label: "I",
            title: "Italic",
            action: () => editor?.chain().focus().toggleItalic().run(),
            active: editor?.isActive("italic"),
          },
          {
            label: "H2",
            title: "Heading 2",
            action: () =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            active: editor?.isActive("heading", { level: 2 }),
          },
          {
            label: "H3",
            title: "Heading 3",
            action: () =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            active: editor?.isActive("heading", { level: 3 }),
          },
          {
            label: "• List",
            title: "Bullet List",
            action: () => editor?.chain().focus().toggleBulletList().run(),
            active: editor?.isActive("bulletList"),
          },
          {
            label: "1. List",
            title: "Ordered List",
            action: () => editor?.chain().focus().toggleOrderedList().run(),
            active: editor?.isActive("orderedList"),
          },
          {
            label: '" Quote',
            title: "Blockquote",
            action: () => editor?.chain().focus().toggleBlockquote().run(),
            active: editor?.isActive("blockquote"),
          },
          {
            label: "— Line",
            title: "Divider",
            action: () => editor?.chain().focus().setHorizontalRule().run(),
            active: false,
          },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            title={btn.title}
            className={`px-3 py-1.5 rounded text-xs font-mono transition ${
              btn.active
                ? "bg-green-500 text-black font-bold"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl min-h-[400px] focus-within:border-green-500/50 transition">
        <EditorContent editor={editor} />
      </div>

      <p className="text-gray-600 text-xs mt-4">
        💡 Tip: You need a title before you can save or publish.
      </p>
    </main>
  );
}
