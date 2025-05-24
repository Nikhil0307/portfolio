"use client";

import {
  Briefcase,
  Code,
  Rocket,
  GraduationCap,
  Terminal,
} from "lucide-react";
import Link from "next/link";

export default function Work() {
  return (
    <main className="text-white max-w-5xl mx-auto px-4 py-8">
      <div className="mb-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
          Professional Journey
        </h1>

        <div className="relative border-l border-zinc-700 sm:ml-4 ml-2">

          {/* Zoho MTS */}
          <div className="mb-12 relative sm:pl-8 pl-4">
            <div className="absolute sm:w-4 sm:h-4 w-3 h-3 bg-blue-300 rounded-full sm:-left-[9px] -left-[6px] top-1" />
            <div className="flex items-center gap-4 mb-4">
              <Briefcase className="w-6 h-6 text-blue-300" />
              <h2 className="text-xl lg:text-2xl font-bold">Zoho Corporation</h2>
            </div>
            <div className="bg-zinc-800 rounded-xl p-6 mb-4 leading-relaxed">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-md lg:text-xl font-semibold">
                    Member Technical Staff
                  </h3>
                  <p className="text-zinc-400 text-sm lg:text-md">
                    Chennai, IN | June 2023 – Present
                  </p>
                </div>
                <Rocket className="w-6 h-6 text-blue-300" />
              </div>
              <ul className="list-disc pl-6 space-y-3 text-zinc-300 text-sm lg:text-md">
                <li>
                  <strong>Orchestration & Scalability:</strong> Designed a Kubernetes-based orchestration layer for AI/ML workloads—cutting deployment time by 40%, reducing manual config by 60%, and boosting productivity by 50%.
                </li>
                <li>
                  <strong>Infrastructure & Deployment:</strong> Migrated a monolithic service to microservices with Kubernetes—achieving auto-scaling, rolling updates, 3× scalability improvement, and 90% downtime reduction.
                </li>
                <li>
                  <strong>High-Performance Distributed Storage:</strong> Built a gRPC-based distributed database (with cache layers) supporting 1M+ requests/day—featuring similarity caching, TTL, pre-fetching, and write-back, reducing cache misses by 35% and improving read speeds by 70%.
                </li>
                <li>
                  <strong>Optimized Docker Workflows:</strong> Adopted multi-stage Docker builds—shrinking image size by 40%, cutting build time from 10 to 4 minutes, and improving deployment efficiency 3×.
                </li>
                <li>
                  <strong>Message Queue Orchestration:</strong> Developed a dynamic RabbitMQ consumer manager that scaled based on queue metrics—eliminated OOMs, improved throughput by 2.5×, and sustained 99.9% delivery reliability.
                </li>
              </ul>
            </div>
          </div>

          {/* Zoho Project Trainee */}
          <div className="mb-12 relative sm:pl-8 pl-4">
            <div className="absolute sm:w-4 sm:h-4 w-3 h-3 bg-blue-300 rounded-full sm:-left-[9px] -left-[6px] top-1" />
            <div className="flex items-center gap-4 mb-4">
              <Code className="w-6 h-6 text-blue-300" />
              <h2 className="text-xl lg:text-2xl font-bold">Zoho Corporation</h2>
            </div>
            <div className="bg-zinc-800 rounded-xl p-6 mb-4 leading-relaxed">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-md lg:text-xl font-semibold">
                    Project Trainee
                  </h3>
                  <p className="text-zinc-400 text-sm lg:text-md">
                    Chennai, IN | August 2022 – May 2023
                  </p>
                </div>
                <Terminal className="w-6 h-6 text-blue-300" />
              </div>
              <ul className="list-disc pl-6 space-y-3 text-zinc-300 text-sm lg:text-md">
                <li>
                  <strong>ML Model Optimization:</strong> Led ONNX adoption for 150+ models, resolving dependency issues and reducing deployment time by 30%, improving response times by 25%.
                </li>
                <li>
                  <strong>Low-Latency Model Serving:</strong> Converted models to ONNX, cutting inference latency from 150ms to 100ms for 200K+ requests/day while maintaining 99.8% accuracy.
                </li>
                <li>
                  <strong>In-Browser ML Inference:</strong> Enabled client-side ML by loading ONNX models in browsers—reducing server load by 50% and doubling response speeds.
                </li>
                <li>
                  <strong>Efficient In-Memory Caching:</strong> Built a high-performance LRU cache that cut datastore queries by 40%, reduced latency by over 50%, and sustained a 99.9% hit rate across 2M+ lookups/day.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center mb-12">
          <Link
            href="/"
            className="bg-zinc-800 hover:bg-zinc-700 px-8 py-3 rounded-lg transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
