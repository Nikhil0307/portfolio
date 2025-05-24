
import Link from "next/link";
import {
  Code,
  Github,
  Globe,
  Gamepad,
  Database,
  MessageSquare,
  Bot,
  Earth,
  House,
  ChefHat,
  CarTaxiFront,
  HelpingHand,
} from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "CookBook - Recipe Web Application",
      tech: ["Spring", "ELK Stack", "Java"],
      description:
        "Recipe web app for browsing, searching, and managing cooking recipes online",
      icon: <ChefHat className="w-6 h-6" />,
    },
    {
      title: "Book cabs",
      tech: ["PHP", "Laravel", "MapBoxAPI"],
      description:
        "Cab booking requesting rides and managing transportation services",
      icon: <CarTaxiFront className="w-6 h-6" />,
    },
    {
      title: "Online Food Order",
      tech: ["Python", "FastAPI"],
      description:
        "Online food ordering app for browsing menus and placing delivery orders",      
      icon: <HelpingHand className="w-6 h-6" />,
    },
  ];

  return (
    <main className="text-white max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-900 bg-clip-text text-transparent">
          Creative Experiments
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative group bg-zinc-900 rounded-xl p-6 border border-zinc-800 
                         hover:border-blue-500 transition-all duration-300 
                         hover:shadow-2xl hover:shadow-blue-900/20"
            >
 
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg text-blue-400">
                    {project.icon}
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {project.title}
                  </h2>
                </div>
              </div>

         
              <div className="mb-4 flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 text-xs sm:text-sm bg-zinc-800 rounded-full text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

       
              <p className="text-zinc-400 text-sm sm:text-base mb-6">
                {project.description}
              </p>
            </div>
          ))}
        </div>


        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
