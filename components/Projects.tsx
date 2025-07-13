"use client";

import { useRef } from "react";
import { ExternalLink, Github, ArrowUpRight, Trophy } from "lucide-react";

const projects = [
  {
    title: "Real-Time Queueing System",
    description:
      "A local web application that manages queues in real-time for RTU's MIS Office. Built to handle hundreds of concurrent users with live updates and dynamic form generation.",
    problem:
      "Students and staff needed a better way to manage queues and appointments at the MIS office",
    solution:
      "Real-time queue management with Socket.IO, dynamic forms, and responsive UI",
    myRole:
      "Full-stack development, real-time architecture, form system design",
    tech: [
      "Next.js",
      "TypeScript",
      "Socket.IO",
      "Prisma",
      "Tailwind CSS",
      "Zustand",
    ],
    highlights: [
      "Real-time updates across all devices",
      "Dynamic form with 586K+ field combinations",
      "400% faster processing",
    ],

    featured: true,
  },
  {
    award: "Best in Thesis",
    title: "Academic Performance Predictor",
    description:
      "A data visualization tool that analyzes procrastination patterns and predicts academic performance using machine learning.",
    problem:
      "Understanding the relationship between procrastination habits and academic success",
    solution:
      "Interactive dashboard with ML model integration and real-time data visualization",
    myRole: "Frontend development, data visualization, ML model integration",
    tech: ["Next.js", "React", "Flask", "Firebase", "Chart.js", "Tailwind CSS"],
    highlights: [
      "70% user engagement rate",
      "Interactive data visualizations",
      "Real-time pattern analysis",
    ],
    github: "https://github.com/AlejandroP1028/Thesis2_NextJs-Flask.git",
    featured: true,
  },
  {
    title: "CPU Scheduling Simulator",
    description:
      "An educational tool that visualizes different CPU scheduling algorithms with interactive demonstrations.",
    problem:
      "Students needed a visual way to understand CPU scheduling algorithms",
    solution:
      "Interactive simulator with real-time visualizations and algorithm comparisons",
    myRole:
      "Frontend development, algorithm implementation, visualization design",
    tech: ["Vue.js", "TypeScript", "Canvas API", "CSS Animations"],
    highlights: [
      "Multiple algorithm support",
      "Real-time process visualization",
      "Educational resource",
    ],
    github: "https://github.com/AlejandroP1028/CPU-SCHEDULING_IMPLEMENTATION",
    featured: false,
  },
  {
    title: "Component Library",
    description:
      "A reusable Vue.js component library with comprehensive documentation and standardized design patterns.",
    problem: "Need for consistent UI components across multiple projects",
    solution:
      "Modular component library with documentation and version control",
    myRole: "Component architecture, documentation, API design",
    tech: ["Vue.js", "Storybook", "CSS", "Documentation"],
    highlights: [
      "30% faster development",
      "Comprehensive documentation",
      "Version controlled",
    ],
    github: "https://github.com/AlejandroP1028/Group-GCC_Vue-Component-Library",
    live: "group-gcc-vue-component-library.vercel.app",
    featured: false,
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="projects" ref={sectionRef} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Featured Work
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A selection of projects that showcase my approach to solving
            problems through code
          </p>
        </div>

        <div className="space-y-20">
          {projects
            .filter((project) => project.featured)
            .map((project, index) => (
              <div key={index} className="fade-in">
                <div className="grid lg:grid-cols-5 gap-12 items-start">
                  <div className="lg:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <div className="flex flex-row items-baseline mb-4">
                          <h3 className="text-2xl font-medium text-gray-900 mr-2">
                            {project.title}
                          </h3>
                          {project.award && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded">
                              <Trophy className="w-3 h-3 text-amber-500" />
                              {project.award}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50/50 border border-gray-100 rounded-xl">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Problem
                          </h4>
                          <p className="text-sm text-gray-600">
                            {project.problem}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Solution
                          </h4>
                          <p className="text-sm text-gray-600">
                            {project.solution}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          My Contribution
                        </h4>
                        <p className="text-sm text-gray-600">
                          {project.myRole}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm group"
                          >
                            <Github size={16} className="mr-2" />
                            View Code
                            <ArrowUpRight
                              size={14}
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}

                        {project.live && (
                          <a
                            href={
                              project.live.startsWith("http")
                                ? project.live
                                : `https://${project.live}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm group"
                          >
                            <ExternalLink size={16} className="mr-2" />
                            Live Demo
                            <ArrowUpRight
                              size={14}
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm hover:border-gray-300 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Key Achievements
                        </h4>
                        <ul className="space-y-3">
                          {project.highlights.map(
                            (highlight, highlightIndex) => (
                              <li
                                key={highlightIndex}
                                className="text-sm text-gray-600 flex items-start"
                              >
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {highlight}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Other Projects */}
        <div className="mt-20">
          <h3 className="text-xl font-medium text-gray-900 mb-8 fade-in">
            Other Notable Projects
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {projects
              .filter((project) => !project.featured)
              .map((project, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-300 fade-in group"
                >
                  <h4 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{project.tech.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={project.github}
                       target="_blank"
                            rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded"
                    >
                      <Github size={16} />
                    </a>
                    {project.live && (
                      <a
                        href={
                          project.live.startsWith("http")
                            ? project.live
                            : `https://${project.live}`
                        }
                         target="_blank"
                            rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
