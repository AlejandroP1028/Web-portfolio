"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
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
        const title = SplitText.create(q(".lp-head h1"), { type: "chars" });
        const prompt = SplitText.create(q(".lp-prompt .words"), { type: "words,chars", mask: "words" });
        const sub = SplitText.create(q(".lp-sub"), { type: "words" });
        const nowH = SplitText.create(q(".lp-now h2"), { type: "chars", mask: "chars" });
        const nowItems = SplitText.create(q(".lp-now li span"), { type: "chars" });
        // the masks clip at the line box: give descenders (g, y) room below it
        gsap.set([...prompt.masks, ...nowH.masks], { paddingBottom: "0.2em", marginBottom: "-0.2em" });
        const tl = gsap.timeline({ delay: fromProj ? 0.35 : 0.05, defaults: { ease: "power3.out" } });
        // the header: the dot pops, "Learning" types in, the count fades up
        tl.from(q(".lp-head .dot"), { scale: 0, duration: 0.5, ease: "back.out(3)" })
          .from(title.chars, { opacity: 0, duration: 0.01, stagger: 0.045 }, "<0.05")
          .from(q(".lp-count, .lp-close"), { opacity: 0, y: -4, duration: 0.4, stagger: 0.06 }, "<0.15")
          // the heading rises letter by letter out of its mask, after the caret
          .from(q(".lp-prompt .caret"), { opacity: 0, x: -8, duration: 0.3 }, 0.2)
          .from(prompt.chars, { yPercent: 115, rotate: 8, duration: 0.7, stagger: 0.022 }, 0.28)
          .from(sub.words, { opacity: 0, y: 6, duration: 0.45, stagger: 0.02 }, 0.65)
          // the projects come in like conversations arriving in the pill
          .from(q(".lp-list li"), { y: 18, opacity: 0, duration: 0.55, stagger: 0.075 }, 0.8)
          .from(q(".lp-list .dot"), { scale: 0, duration: 0.45, stagger: 0.075, ease: "back.out(3)" }, 0.95)
          .from(q(".lp-list .lp-go"), { x: -8, opacity: 0, duration: 0.4, stagger: 0.075 }, 1.05)
          // learning now: the heading rises, each item types itself out
          .from(nowH.chars, { yPercent: 110, duration: 0.5, stagger: 0.03 }, 1.35)
          .from(q(".lp-now li"), { opacity: 0, duration: 0.2, stagger: 0.25 }, 1.6)
          .from(nowItems.chars, { opacity: 0, duration: 0.01, stagger: 0.03 }, 1.6);
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
            ✕
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
                  <span className="lp-go" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>

          <section className="lp-now lp-in" aria-labelledby="now">
            <h2 id="now">learning now</h2>
            <ul>
              {NOW.map((n) => (
                <li key={n}>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
