"use client"
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  title: string;
  description: string;
  url: string;
  date: string;
  image?: string;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/hashnode"); // server route remains api/hashnode
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        // Optionally: setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="text-white max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-900 bg-clip-text text-transparent">
          Recent Blog Posts
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
            <p>Could not load posts: {error}</p>
            <p className="mt-2 text-sm">
              Please try again later. You can also visit my Hashnode directly:
              <a
                href="https://nikhil-baskar.hashnode.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline ml-1"
              >
                nikhil-baskar.hashnode.dev
              </a>
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-zinc-400">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={post.url || index}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-blue-300 transition-all flex flex-col"
              >
                {post.image ? (
                  <div className="mb-4 overflow-hidden rounded-lg aspect-video">
                    <img
                      src={post.image}
                      alt={post.title || "post cover image"}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                ) : (
                  <div className="mb-4 aspect-video bg-zinc-800 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-zinc-600" />
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-2">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors line-clamp-2"
                    >
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-zinc-400 mb-3 text-sm flex-grow line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm text-zinc-500 mt-auto pt-3 border-t border-zinc-700/50">
                  <span>{post.date}</span>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="https://nikhil-baskar.hashnode.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition mr-4"
          >
            View All on Hashnode <BookOpen className="w-4 h-4" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
