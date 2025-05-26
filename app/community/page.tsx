"use client"
import {BookOpen} from 'lucide-react'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SubstackPost {
  title: string;
  description: string;
  url: string;
  date: string;
  image?: string;
}

export default function Community() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubstackPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/substack');
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data: SubstackPost[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching Substack posts:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        // You could set posts to your mock data as a fallback here if you want
        // setPosts(mockPosts); 
      } finally {
        setLoading(false);
      }
    };

    fetchSubstackPosts();
  }, []);

  // Keep your mock posts if you want them as a fallback or for testing
  // const mockPosts: SubstackPost[] = [ ... ];

  return (
    <main className="text-white max-w-6xl mx-auto px-4 py-8 min-h-screen"> {/* Changed h-screen to min-h-screen */}
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
            <p className="mt-2 text-sm">Please try again later. You can also visit my Substack directly: 
              <a 
                href="https://nikhilbaskar.substack.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline ml-1"
              >
                nikhilbaskar.substack.com
              </a>
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-zinc-400">
            No posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div 
                key={post.url || index} // Use URL as key if available and unique
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-blue-300 transition-all flex flex-col"
              >
                {post.image ? (
                  <div className="mb-4 overflow-hidden rounded-lg aspect-video"> {/* aspect-video helps maintain aspect ratio */}
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover" // Ensure image fills container
                      onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
                    />
                  </div>
                ) : (
                  <div className="mb-4 aspect-video bg-zinc-800 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-zinc-600" /> {/* Placeholder Icon */}
                  </div>
                )}
                <div className="flex flex-col flex-grow"> {/* Allow text content to grow */}
                  <h2 className="text-xl font-bold mb-2">
                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors line-clamp-2" // Limit title to 2 lines
                    >
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-zinc-400 mb-3 text-sm flex-grow line-clamp-3"> {/* Limit description */}
                    {post.description}
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm text-zinc-500 mt-auto pt-3 border-t border-zinc-700/50"> {/* mt-auto pushes to bottom */}
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
            href="https://nikhilbaskar.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition mr-4"
          >
            View All on Substack <BookOpen className="w-4 h-4" />
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