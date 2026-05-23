/**
 * Blog index — public list of published blog posts (not reviews).
 * Route: /blog
 * Joins author username from users table via posts_author_id_fkey.
 */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";


export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
  *,
  users!posts_author_id_fkey(username, avatar_url)
`,
    )
    .eq("status", "published")
    .eq("post_type", "blog")
    .order("published_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Blog</h1>
        <p className="text-gray-400">
          Latest posts from the BotReSpawn community
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/40 transition group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-purple-900 text-purple-300 font-bold px-2 py-1 rounded-full">
                  📝 Blog
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-xl font-black text-white mb-2 group-hover:text-green-400 transition">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-2 mt-4">
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-400 font-bold">
                  {post.users?.username?.[0]?.toUpperCase() ?? "A"}
                </div>
                <Link
                  href={`/profile/${post.users?.username}`}
                  className="text-xs text-gray-500 hover:text-green-400 transition"
                >
                  {post.users?.username ?? "Anonymous"}
                </Link>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-white font-bold text-xl mb-2">No posts yet</h2>
          <p className="text-gray-400 text-sm mb-6">
            Be the first to write on BotReSpawn!
          </p>
          <Link
            href="/write"
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-lg transition text-sm"
          >
            Write a Post
          </Link>
        </div>
      )}
    </main>
  );
}
