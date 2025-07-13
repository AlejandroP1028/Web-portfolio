"use client";

import { useRef } from "react";
import { Lightbulb, Code, Heart, Zap } from "lucide-react";
// import type { HTMLSectionElement } from "react"

const traits = [
  {
    icon: Lightbulb,
    title: "Curious by Nature",
    description:
      "I love diving deep into how things work. Whether it's a new framework, design pattern, or optimization technique, I'm always asking 'why' and 'how can this be better?'",
  },
  {
    icon: Code,
    title: "Problem Solver",
    description:
      "I enjoy the puzzle-solving aspect of development. Give me a complex problem, and I'll break it down into manageable pieces and find an elegant solution.",
  },
  {
    icon: Heart,
    title: "Craft-Focused",
    description:
      "I believe in writing clean, maintainable code. I care about the details—from user experience to code architecture—because good software is built with intention.",
  },
  {
    icon: Zap,
    title: "Performance Minded",
    description:
      "I'm fascinated by optimization and making things fast. From database queries to bundle sizes, I love the challenge of making applications lightning quick.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" ref={sectionRef} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl font-light text-gray-900 mb-4">About Me</h2>
          <div className="w-16 h-px bg-gray-300 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {traits.map((trait, index) => (
            <div key={index} className="fade-in group">
              <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-xl h-full hover:bg-gray-50 hover:border-gray-200 transition-all duration-300">
                <div className="p-3 bg-white border border-gray-200 rounded-lg w-fit mb-4 group-hover:shadow-sm transition-shadow">
                  <trait.icon size={20} className="text-gray-700" />
                </div>
                <h3 className="font-medium text-gray-900 mb-3">
                  {trait.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trait.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto fade-in">
          <div className="prose prose-gray max-w-none text-center">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              I'm a Computer Science graduate from Pamantasan ng Lungsod ng
              Pasig, where I discovered my passion for building things that
              solve real problems. What started as curiosity about how websites
              work has evolved into a love for crafting digital experiences.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              I'm drawn to projects that challenge me technically—whether that's
              building real-time systems with Socket.IO, creating dynamic forms
              that handle complex data, or optimizing performance to make
              applications lightning fast. I find joy in the process of turning
              ideas into working software.
            </p>
            <p className="text-gray-600 leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies,
              reading about software architecture, or tinkering with side
              projects. I believe the best way to learn is by building,
              breaking, and building again.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
