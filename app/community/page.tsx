"use client"
import { Medal, Mic, Users, BookOpen } from 'lucide-react';
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

  useEffect(() => {
    // This is a placeholder - you'll need to implement actual Substack API fetching
    // or use RSS feed parsing to get your posts
    const fetchSubstackPosts = async () => {
      try {
        // Replace with actual API call or RSS parsing
        const mockPosts: SubstackPost[] = [
          {
            title: "Demystifying Python Pickle",
            description: " Serialization and Deserialization Made Easy",
            url: "https://nikhilbaskar.substack.com/p/demystifying-python-pickle-serialization",
            date: "Nov 20, 2024",
            image: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F25217427-c2e2-4ebb-bb4e-9d699a3db4de_612x408.jpeg"
          },
          {
            title: "Double Clicking Python Pickle : Internal Working",
            description: "Unveiling the Mysteries of Python's Pickle: How Does It Really Work?",
            url: "https://nikhilbaskar.substack.com/p/double-clicking-python-pickle-internal",
            date: "SEP 20, 2024",
            image: "https://substackcdn.com/image/fetch/w_320,h_213,c_fill,f_webp,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcc59981b-d814-4b5f-bc0d-671f3f49d023_772x550.gif"
          },          
          {
            title: "From Bottlenecks to Breakthroughs: Shared Nothing Architecture",
            description: "The role of Shared Nothing Architecture in Building Flexible, High-Performance Systems",
            url: "http://nikhilbaskar.substack.com/p/shared-nothing-architecture",
            date: "Nov 14, 2024",
            image: "https://substackcdn.com/image/fetch/w_320,h_213,c_fill,f_webp,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8d2c16d4-f735-4595-b6b8-5b013c8ba9b7_600x400.jpeg"
          },
          {
            title: "Case Studies: Real-World Implementations of Shared Nothing Architecture 🌍✨",
            description: "How Tech Giants Leverage Shared Nothing for Scale and Speed...",
            url: "https://nikhilbaskar.substack.com/p/sna-case-studies",
            date: "Nov 20, 2024",
            image: "https://substackcdn.com/image/fetch/w_520,h_272,c_fill,f_webp,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F54b56c0d-6180-487a-bb7b-3fa628928251_1595x971.png"
          },                    
        ];
        
        setPosts(mockPosts);
      } catch (error) {
        console.error("Error fetching Substack posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubstackPosts();
  }, []);

  return (
    <main className="text-white max-w-6xl mx-auto px-4 py-8 h-screen">
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-900 bg-clip-text text-transparent">
          Recent Blog Posts
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div 
                key={index} 
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-blue-300 transition-all"
              >
                {post.image && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </a>
                </h2>
                <p className="text-zinc-400 mb-3">{post.description}</p>
                <div className="flex justify-between items-center text-sm text-zinc-500">
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