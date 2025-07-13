"use client";

import { useRef } from "react";

const skillCategories = [
  {
    title: "Programming Languages",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "SQL",
      "Java",
      "PHP",
      "HTML/CSS",
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      "Next.js",
      "React",
      "Vue.js",
      "Tailwind CSS",
      "Redux",
      "Zustand",
      "shadcn",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      "Laravel",
      "Flask",
      "RESTful APIs",
      "Prisma ORM",
      "Socket.io",
      "Firebase",
      "Supabase",
    ],
  },
  {
    title: "Mobile Development",
    skills: ["React Native", "Expo"],
  },
  {
    title: "Tools & Technologies",
    skills: ["Git", "GitHub", "Vercel", "Linear Regression", "UI/UX Design"],
  },
  {
    title: "Leadership & Management",
    skills: [
      "Team Leadership",
      "Project Management",
      "Code Quality Assurance",
      "Collaboration Tools",
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 border-t border-gray-100"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-light text-gray-900 mb-12 fade-in">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="fade-in">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-gray-50 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg fade-in">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Core Competencies
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Technical Leadership
              </div>
              <div>Led teams of 3-10 developers across multiple projects</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Full-Stack Development
              </div>
              <div>End-to-end application development and deployment</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Performance Optimization
              </div>
              <div>Achieved 400% performance improvements in production</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
