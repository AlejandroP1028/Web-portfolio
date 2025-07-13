"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ArrowDown,
  Code2,
  Coffee,
  MapPin,
  Download,
  ArrowUpRight,
} from "lucide-react";
// import type { HTMLHeadingElement, HTMLParagraphElement, HTMLDivElement } from "react"

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      nameRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        titleRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        detailsRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

    // Floating animation for arrow
    gsap.to(".floating-arrow", {
      y: 8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Subtle background animation
    gsap.to(".bg-gradient", {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="min-h-screen flex items-center pt-20 relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="bg-gradient absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-30 blur-3xl"></div>
      <div className="bg-gradient absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-50 to-blue-50 rounded-full opacity-30 blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-6">
            <Code2 size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600 font-medium">
              Software Developer
            </span>
          </div>

          <h1 ref={nameRef} className="text-2xl font-medium text-gray-700 mb-2">
            Alejandro Prado
          </h1>

          <h2
            ref={titleRef}
            className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight"
          >
            I craft digital
            <br />
            <span className="font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              experiences
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl"
          >
            Passionate about building elegant solutions with modern web
            technologies. I love turning complex problems into simple,
            beautiful, and intuitive applications.
          </p>

          <div ref={detailsRef} className="space-y-6 mb-16">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Pasig, Metro Manila</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee size={16} />
                <span>Currently exploring React Native & Expo</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                Available for work
              </div>
            </div>

            {/* Add CV Download Button */}
            {/* <div className="pt-4">
              <a
                href="/alejandro-prado-cv.pdf"
                download="Alejandro_Prado_CV.pdf"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <Download size={18} className="mr-2" />
                <span>Download CV</span>
                <ArrowUpRight
                  size={14}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div> */}
          </div>

          <div className="floating-arrow">
            <ArrowDown className="text-gray-400" size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
