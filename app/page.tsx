"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
// import Experiments from "@/components/Experiments";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import FloatingNav from "@/components/FloatingNav";
import DownloadCV from "@/components/DownloadCV";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Subtle fade-in animations for content
    gsap.fromTo(
      ".fade-in",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".fade-in",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Subtle parallax effect for section dividers
    gsap.to(".section-line", {
      scaleX: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: ".section-line",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen relative overflow-hidden">
      {/* <Navigation /> */}
      <FloatingNav />
      <main className="relative">
        <Hero />
        <div className="section-line w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <About />
        <div className="section-line w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <Projects />
        <div className="section-line w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <TechStack />
        {/* <div className="section-line w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <Experiments /> */}
        <div className="section-line w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <DownloadCV />
        <div className="section-line w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <Contact />
      </main>
    </div>
  );
}
