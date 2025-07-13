"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { User, Code, Layers, Beaker, Download, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial animation
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
    );

    // Hide navigation when scrolling past hero
    ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top",
      end: "bottom top",
      onEnter: () => {
        gsap.to(navRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const navItems = [
    { id: "about", icon: User, label: "About" },
    { id: "projects", icon: Code, label: "Projects" },
    { id: "techstack", icon: Layers, label: "Tech" },
    { id: "experiments", icon: Beaker, label: "Labs" },
    { id: "cv", icon: Download, label: "CV" },
    { id: "contact", icon: Mail, label: "Contact" },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">
            Alejandro Prado
          </div>
          <div className="text-sm text-gray-500">Software Developer</div>
        </div>
      </div>
    </nav>
  );
}
