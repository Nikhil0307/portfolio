import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 text-white">
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">

        <div className="flex justify-center md:justify-start">
          <Image
            src="/images/avatar.jpeg"
            alt="Nikhil Baskar"
            width={200}  
            height={200}
            className="rounded-lg object-cover w-full max-w-[200px]"
          />
        </div>


        <div className="md:col-span-2 flex flex-col justify-center">
          <p className="text-lg mb-2">Hey 👋🏻 This is ...</p>
          <h1 className="text-4xl font-bold mb-4">Nikhil Baskar</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
          Software Engineer specializing in distributed systems 
          and high-performance infrastructure.Software Engineer with
          ~3 years of experience in designing and scaling distributed systems
          and caching architectures. Proven ability to build low-latency,
          high-throughput systems and resolve performance bottlenecks.
          Great passion for system design skills, and backend engineering where scale and reliability matter.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/about"
              className="bg-blue-300 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-blue-400 transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="bg-zinc-800 px-6 py-2 font-bold rounded-lg hover:bg-zinc-700 transition"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>


      <section>
        <h2 className="text-2xl font-bold mb-6">What I&apos;ve Been Upto...</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
          <div className="bg-zinc-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Professional Journey</h3>
              <span className="text-2xl">💼</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
            I’m a Backend Engineer at Zoho, building scalable distributed systems 
            and high-performance infrastructure. My work spans gRPC services, 
            Kubernetes orchestration, caching layers, and event-driven architectures—all 
            optimized for reliability, speed, and scale.
            </p>
          </div>


          <div className="bg-zinc-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Personal Projects</h3>
              <span className="text-2xl">💻</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
            Beyond my professional role, 
            I explore systems engineering by prototyping LRU caches, 
            browser-based ML inference, and ONNX model deployment pipelines. 
            These projects help me stay sharp and continuously push the limits of performance and design.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
