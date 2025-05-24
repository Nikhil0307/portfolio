import Link from "next/link";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center justify-center max-w-3xl mx-auto px-4 py-16 text-white min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
        Let&apos;s Connect!
      </h1>
      <p className="text-zinc-400 text-center mb-8 text-sm sm:text-base leading-relaxed">
        Whether you have questions about distributed systems, high-performance infrastructure, 
        or want to discuss backend engineering challenges, I'm always open to conversations. 
        Reach out via email or connect with me on social platforms.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-blue-300 transition-all flex flex-col items-center text-center">
          <Mail className="w-8 h-8 text-blue-300 mb-2" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Email</h2>
          <Link
            href="mailto:vishalnikhil0307@gmail.com"
            className="text-gray-400 hover:underline text-sm sm:text-base"
          >
            vishalnikhil0307@gmail.com
          </Link>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-blue-300 transition-all flex flex-col items-center text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Find me on</h2>
          <div className="flex space-x-6">
            <Link href="https://github.com/Nikhil0307" target="_blank">
              <Github className="w-6 h-6 text-blue-300 hover:text-blue-400 transition" />
            </Link>
            <Link href="https://www.linkedin.com/in/nikhil0307/" target="_blank">
              <Linkedin className="w-6 h-6 text-blue-300 hover:text-blue-400 transition" />
            </Link>
            <Link href="https://nikhilbaskar.substack.com/" target="_blank">
              <SubstackIcon className="w-6 h-6 text-blue-300 hover:text-blue-400 transition" />
            </Link>            
          </div>
        </div>
      </div>

      <p className="text-zinc-500 mt-12 text-center text-sm sm:text-base leading-relaxed">
        Fun fact: I optimize systems like I optimize my coffee breaks - for maximum efficiency.
        <br />
        Let's chat about distributed systems, caching architectures, or Kubernetes!
      </p>

      <div className="mt-12">
        <Link
          href="/"
          className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg transition text-sm sm:text-base"
        >
          &larr; Back to Home
        </Link>
      </div>
    </main>
  );
}


function SubstackIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path d="M64 64v64h384V64H64zm0 128v64h384v-64H64zm0 128v64h384v-64H64z" />
    </svg>
  );
}
