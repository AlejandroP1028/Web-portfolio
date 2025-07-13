"use client";

import { useRef } from "react";
import { Lightbulb, Code, Heart, Zap } from "lucide-react";
// import type { HTMLSectionElement } from "react"

const traits = [
  {
    icon: Lightbulb,
    title: "Curious",
    description: "I like figuring out how things work and improving them.",
  },
  {
    icon: Code,
    title: "Logical",
    description: "I break down problems and build working solutions.",
  },
  {
    icon: Heart,
    title: "Practical",
    description: "I care about code that’s clear and easy to work with.",
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {traits.map((trait, index) => (
            <div
              key={index}
              className="fade-in group flex flex-col sm:flex-row sm:items-start bg-gray-50/50 border border-gray-100 rounded-xl p-6 hover:bg-gray-50 hover:border-gray-200 transition-all duration-100"
            >
              <div className="p-3 bg-white border border-gray-200 rounded-lg mb-4 sm:mb-0 sm:mr-4 w-fit group-hover:shadow-sm transition-shadow">
                <trait.icon size={24} className="text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
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
            <p className=" text-gray-600 leading-relaxed mb-6">
              I studied Computer Science at Pamantasan ng Lungsod ng Pasig. I
              like building things that work and solve real problems.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              I’ve worked on projects like real-time systems, dynamic forms, and
              performance improvements. I enjoy figuring out how to make
              software do what it needs to do.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In my free time, I explore new tools, read about how software is
              built, and work on side projects to keep learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
