"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent, type RefObject } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The paper pages' (Work, Fun) way in and out. In: the big h1 rises letter by letter out of its
 * mask, then `rest` and `items` come up in a short stagger. Out (`leave(href)` on a link's
 * onClick): the letters drop back while `out` lifts away, then it navigates.
 */
export function useHeadingIntro(rootRef: RefObject<HTMLElement>, { rest, items, out }: { rest: string; items?: string; out: string }) {
  const router = useRouter();
  const split = useRef<SplitText | null>(null);
  const busy = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current!;
    if (reduced()) return;
    const q = (s: string) => Array.from(root.querySelectorAll(s));
    const ctx = gsap.context(() => gsap.set(q(".wk-inner"), { autoAlpha: 0 }), root);
    let live = true;
    // split once the font is in, so the letters are measured in the real face
    document.fonts.ready.then(() => {
      if (!live) return;
      ctx.add(() => {
        gsap.set(q(".wk-inner"), { autoAlpha: 1 });
        split.current = SplitText.create(q(".wk h1"), { type: "chars", mask: "chars" });
        const tl = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(split.current.chars, { yPercent: 110, duration: 0.7, stagger: 0.04 })
          .from(q(rest), { y: 10, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.2);
        if (items) tl.from(q(items), { y: 8, opacity: 0, duration: 0.4, stagger: 0.035 }, 0.35);
      });
    });
    return () => {
      live = false;
      split.current = null;
      ctx.revert();
    };
  }, [rootRef, rest, items]);

  return (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (busy.current || reduced() || !split.current || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    gsap
      .timeline({ defaults: { ease: "power2.in" }, onComplete: () => router.push(href) })
      .to(split.current.chars, { yPercent: 110, duration: 0.35, stagger: 0.025 })
      .to(rootRef.current!.querySelectorAll(out), { y: -8, opacity: 0, duration: 0.25, stagger: 0.03 }, 0);
  };
}
