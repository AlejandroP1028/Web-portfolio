"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { sans, mono } from "../landing/fonts";
import ThemeToggle from "../landing/ThemeToggle";
import { WORK, type Project } from "./projects";
import "../landing/landing.css";
import "./learning.css";

gsap.registerPlugin(SplitText);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// projects grouped by job, in the order WORK lists them (newest job first)
const groups = WORK.reduce<{ org: string; items: Project[] }[]>((all, p) => {
  const org = p.org ?? "Other";
  const g = all.find((x) => x.org === org);
  if (g) g.items.push(p);
  else all.push({ org, items: [p] });
  return all;
}, []);

/** The Work index: projects listed by job, on the landing's paper. */
export default function WorkIndex() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const split = useRef<SplitText | null>(null);
  const busy = useRef(false);

  // in: "Work" rises letter by letter out of its mask, then the rest comes up in one short stagger
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
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(split.current.chars, { yPercent: 110, duration: 0.7, stagger: 0.04 })
          .from(q(".wk-back, .wk-sub, .wk-group h2, .wk-group ol"), { y: 10, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.2)
          .from(q(".wk-group li"), { y: 8, opacity: 0, duration: 0.4, stagger: 0.035 }, 0.35);
      });
    });
    return () => {
      live = false;
      split.current = null;
      ctx.revert();
    };
  }, []);

  // out: the letters drop back into their masks while everything else lifts away, then we go
  const leave = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (busy.current || reduced() || !split.current || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    const root = rootRef.current!;
    gsap
      .timeline({ defaults: { ease: "power2.in" }, onComplete: () => router.push(href) })
      .to(split.current.chars, { yPercent: 110, duration: 0.35, stagger: 0.025 })
      .to(root.querySelectorAll(".wk-back, .wk-sub, .wk-group"), { y: -8, opacity: 0, duration: 0.25, stagger: 0.03 }, 0);
  };

  return (
    <main ref={rootRef} className={`wk ${sans.variable} ${mono.variable}`} data-side="work">
      <ThemeToggle />
      <div className="wk-inner">
        <Link className="wk-back" href="/" onClick={leave("/")}>
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Back to the start
        </Link>
        <h1>Work</h1>
        <p className="wk-sub">What I've worked on at my jobs, what my role was and what I did.</p>

        {groups.map((g) => (
          <section key={g.org} className="wk-group" aria-label={g.org}>
            <h2>{g.org}</h2>
            <ol>
              {g.items.map((p) => (
                <li key={p.slug}>
                  <Link className="wk-row" href={`/work/${p.slug}`} onClick={leave(`/work/${p.slug}`)}>
                    <span className="wk-title">{p.title}</span>
                    <span className="wk-line">{p.line}</span>
                    <span className="wk-meta">{p.role ? `${p.role} · ${p.when}` : p.when}</span>
                    <ArrowRight className="wk-go" size={18} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
