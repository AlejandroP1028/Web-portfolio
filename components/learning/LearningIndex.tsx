"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ArrowRight, X } from "lucide-react";
import { SplitText } from "gsap/SplitText";
import { sans, mono, hand } from "../landing/fonts";
import { NOW, PROJECTS } from "./projects";
import { FROM_PROJECT_KEY } from "./panel";
import "../landing/landing.css";
import "./learning.css";

gsap.registerPlugin(SplitText);

const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { sessionStorage.removeItem(k); } catch {} },
};
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The Learning index: the Agent Pill's panel, grown to fill most of the screen (the landing
 * hands over in this exact box, see panel.ts). Projects are listed like the pill's
 * conversations; opening one grows the panel to the full screen, into that project's page.
 */
export default function LearningIndex() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  // read once per visit: React runs effects twice in development, and the second run must
  // still know where we came from
  const fromProject = useRef<boolean | null>(null);
  if (fromProject.current === null && typeof window !== "undefined") fromProject.current = !!store.get(FROM_PROJECT_KEY);

  // arriving: from a project page the panel shrinks from the full screen back into place;
  // from the landing it is already in place, and only its contents come in
  useLayoutEffect(() => {
    const panel = panelRef.current!;
    if (reduced()) return;
    const fromProj = !!fromProject.current;
    store.del(FROM_PROJECT_KEY);
    const q = <T extends Element>(s: string) => Array.from(panel.querySelectorAll<T>(s));
    const ctx = gsap.context(() => {
      if (fromProj) gsap.from(panel, { top: 0, left: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 0.55, ease: "power3.inOut", clearProps: "all" });
      // hidden until the fonts are in, so the text is split where it will really wrap
      gsap.set(q(".lp-in"), { autoAlpha: 0 });
    }, panel);
    let live = true;
    document.fonts.ready.then(() => {
      if (!live) return;
      ctx.add(() => {
        gsap.set(q(".lp-in"), { autoAlpha: 1 });
        const prompt = SplitText.create(q(".lp-prompt .words"), { type: "words,chars", mask: "words" });
        // the masks clip at the line box: give descenders (g, y) room below it
        gsap.set(prompt.masks, { paddingBottom: "0.2em", marginBottom: "-0.2em" });
        const tl = gsap.timeline({ delay: fromProj ? 0.35 : 0.05, defaults: { ease: "power3.out" } });
        // the heading rises letter by letter out of its mask; everything else is one short fade and rise
        tl.from(q(".lp-head, .lp-prompt .caret"), { opacity: 0, duration: 0.3 })
          .from(prompt.chars, { yPercent: 115, rotate: 8, duration: 0.7, stagger: 0.022 }, 0.1)
          .from(q(".lp-sub, .lp-list li, .lp-now"), { y: 8, opacity: 0, duration: 0.4, stagger: 0.05 }, 0.45);
      });
    });
    return () => {
      live = false;
      ctx.revert();
    };
  }, []);

  // opening a project: the panel grows to the full screen while its contents fade out
  const open = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (busy.current || reduced() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    const panel = panelRef.current!;
    const r = panel.getBoundingClientRect();
    gsap.set(panel, { left: r.left, top: r.top, width: r.width, height: r.height });
    gsap.to(panel.querySelectorAll(".lp-in"), { opacity: 0, duration: 0.18 });
    gsap.to(panel, {
      left: 0, top: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 0.5, ease: "power3.inOut",
      onComplete: () => router.push(`/learning/${slug}`),
    });
  };

  // Closing: the contents leave, then the landing underneath (still mounted, see the (home)
  // layout) takes the panel over and shrinks it back into the pill.
  const close = () => {
    if (busy.current) return;
    busy.current = true;
    if (reduced()) return router.push("/");
    gsap.to(panelRef.current!.querySelectorAll(".lp-in"), { opacity: 0, duration: 0.16, onComplete: () => router.push("/") });
  };
  const back = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    close();
  };
  // a click outside the panel (on the blurred landing) or Esc closes it too
  const outside = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Esc covers the keyboard
    <div className={`lp ${sans.variable} ${mono.variable} ${hand.variable}`} onClick={outside}>
      <div className="lp-panel" ref={panelRef}>
        <header className="lp-head lp-in">
          <span className="dot run" aria-hidden="true" />
          <h1>Learning</h1>
          <span className="lp-count">{PROJECTS.length} projects</span>
          <Link className="lp-close" href="/" onClick={back} aria-label="Back to the start">
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </header>

        <div className="lp-body">
          <p className="lp-prompt lp-in">
            <span className="caret" aria-hidden="true">› </span>
            <span className="words">things I build to learn</span>
          </p>
          <p className="lp-sub lp-in">I learn new things by building something real with them. Agent Pill is the one I use every day.</p>

          <ol className="lp-list">
            {PROJECTS.map((p) => (
              <li key={p.slug} className="lp-in">
                <Link className="lp-row" href={`/learning/${p.slug}`} onClick={open(p.slug)}>
                  <span className={`dot ${p.state === "running" ? "run" : "ok"}`} aria-hidden="true" />
                  <span className="lp-title">{p.title}</span>
                  <span className="lp-line">{p.line}</span>
                  <span className="lp-meta">
                    {p.status ? `${p.status} · ${p.when}` : p.when}
                  </span>
                  <span className="lp-go" aria-hidden="true"><ArrowRight size={16} strokeWidth={1.5} /></span>
                </Link>
              </li>
            ))}
          </ol>

          <section className="lp-now lp-in" aria-labelledby="now">
            <h2 id="now">learning now</h2>
            <ul>
              {NOW.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
