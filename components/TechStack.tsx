"use client";

import { useRef } from "react";

const techStack = {
  Frontend: {
    primary: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js"],
    secondary: [
      "HTML/CSS",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "shadcn/ui",
    ],
    description: "Building interactive and responsive user interfaces",
  },
  Backend: {
    primary: ["Node.js", "Python", "PHP"],
    secondary: ["Laravel", "Flask", "RESTful APIs", "Socket.io"],
    description: "Server-side development and API design",
  },
  Database: {
    primary: ["PostgreSQL", "MongoDB", "SQL"],
    secondary: ["Prisma ORM", "Firebase", "Supabase"],
    description: "Data modeling and database optimization",
  },
  Tools: {
    primary: ["Git", "GitHub", "VS Code", "Vercel"],
    secondary: ["Figma", "Postman", "Linear Regression"],
    description: "Development workflow and productivity tools",
  },
};

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="techstack" ref={sectionRef} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Technology Stack
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The tools and technologies I use to bring ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {Object.entries(techStack).map(
            ([category, { primary, secondary, description }], index) => (
              <div key={index} className="fade-in">
                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-xl h-full hover:bg-gray-50 hover:border-gray-200 transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {category}
                    </h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>

                  <div className="space-y-4">
                    {primary.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                          Core
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {primary.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {secondary.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                          Additional
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {secondary.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:border-gray-300 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-8 fade-in">
          <h3 className="text-xl font-medium text-gray-900 mb-6 text-center">
            What Drives My Technology Choices
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-medium text-gray-900 mb-2">
                Developer Experience
              </div>
              <p>
                I choose tools that make development enjoyable and productive,
                with great documentation and community.
              </p>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 mb-2">Performance</div>
              <p>
                Technologies that help me build fast, efficient applications
                with optimal user experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 mb-2">Scalability</div>
              <p>
                Solutions that can grow with the project, from prototype to
                production-ready applications.
              </p>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 mb-2">
                Modern Standards
              </div>
              <p>
                Staying current with industry best practices and emerging
                technologies in the ecosystem.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
