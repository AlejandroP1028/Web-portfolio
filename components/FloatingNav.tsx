"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { User, Code, Layers, Beaker, Mail, Download } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);
const navItems = [
  { id: "#about", icon: User, label: "About" },
  { id: "#projects", icon: Code, label: "Projects" },
  { id: "#techstack", icon: Layers, label: "Tech" },
  { id: "#experiments", icon: Beaker, label: "Labs" },
  { id: "#cv", icon: Download, label: "CV", isDownload: false },
  { id: "#contact", icon: Mail, label: "Contact" },
];

export default function FloatingNav() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show floating nav when scrolling past hero
    ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top",
      end: "bottom top",
      onEnter: () => {
        gsap.fromTo(
          navRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          }
        );
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          y: 100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // const element = document.getElementById(sectionId);
    // console.log(element);

    gsap.to(window, {
      duration: 1,
      scrollTo: sectionId,
      ease: "power2.inOut",
    });
  };

  return (
    <div
      ref={navRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 transform mx-auto z-50 opacity-0"
    >
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.isDownload
                  ? window.open("/alejandro-prado-cv.pdf", "_blank")
                  : scrollToSection(item.id)
              }
              className="group flex flex-col items-center space-y-1 p-2 w-20 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <item.icon
                size={18}
                className="text-gray-600 group-hover:text-gray-900 transition-colors"
              />
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
