"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let smoother: ScrollSmoother;

    if (typeof window !== "undefined") {
      smoother = ScrollSmoother.create({
        wrapper: containerRef.current,
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
      });
    }

    return () => {
      smoother?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
