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
import RotatingText from "./RotatingTexts";
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
      y: 12,
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

      <div className="w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="w-3xl">
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
            className="w-full text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-2 leading-tight tracking-tight"
          >
            I build digital{" "}
            <span className="inline-block min-w-[8ch] md:min-w-[10ch] text-center">
              <RotatingText
                texts={["experiences", "products", "tools", "solutions"]}
                mainClassName="w-fit  text-black overflow-hidden py-1 sm:py-1.5 md:py-2 rounded-lg "
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1 sm:pb-1.5 md:pb-2"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl"
          >
            I build simple and effective web apps that solve complex problems.
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

          <div className="floating-arrow inline-flex gap-4 text-gray-400  items-center">
            Scroll Down
            <ArrowDown size={24} />
          </div>
        </div>
      </div>
    </section>
  );
}
