"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { sans, mono, hand } from "../landing/fonts";
import ThemeToggle from "../landing/ThemeToggle";
import Bionic from "./Bionic";
import { PROJECTS, type Feature, type Project } from "./projects";
import { FROM_PROJECT_KEY } from "./panel";

gsap.registerPlugin(ScrollTrigger, SplitText);
const NEXT_KEY = "learning-next"; // arriving from the previous project's "Next" link
import "../landing/landing.css";
import "./learning.css";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** One section, labelled like a line in the pill's log. */
const Part = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <section className="pp-part pp-in">
    <h2>
      <span aria-hidden="true">› </span>
      {label}
    </h2>
    {children}
  </section>
);

const Paras = ({ body }: { body: string[] }) => (
  <>
    {body.map((t) => (
      <p key={t.slice(0, 24)}>{t}</p>
    ))}
  </>
);

// Captions for the showcase tour, by chapter id (sent by the embedded app over postMessage).
const CHAPTERS: Record<string, string> = {
  states: "Every pill shows what its conversation is doing right now.",
  panel: "Click a pill and its terminal opens. Click away and it shrinks back.",
  permission: "When Claude needs an answer, the pill waits for you instead of popping open.",
  groups: "Pills merge into groups, one per project.",
  dock: "Dock a group to the edge and it turns into blobs that move with Claude's state.",
  themes: "Themes for the pills, the panel and the terminal.",
};

/** The real Agent Pill interface, running a scripted tour on a pretend desktop. */
function Showcase() {
  const [caption, setCaption] = useState("Every pill shows what its conversation is doing right now.");
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      const m = e.data;
      if (!m || m.source !== "agent-pill-showcase") return;
      if (m.type === "chapter") {
        setCaption(CHAPTERS[m.id] ?? String(m.id));
        setPaused(false);
      }
      if (m.type === "paused") setPaused(true);
      if (m.type === "resumed") setPaused(false);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);
  return (
    <figure className="showcase pp-in">
      <iframe src="/learning/agent-pill/index.html?showcase" title="Agent Pill running a short tour; you can take over and use it" />
      <figcaption>
        <span className={`dot ${paused ? "wait" : "run"}`} aria-hidden="true" />
        <span aria-live="polite">{paused ? "It's yours. Click around; the tour picks up again when you stop." : caption}</span>
      </figcaption>
    </figure>
  );
}

/**
 * What a person can do with the project. Items tied to a tour chapter have a "show me"
 * button that jumps the showcase there; the one the tour is playing is highlighted.
 */
function Features({ items }: { items: Feature[] }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      const m = e.data;
      if (m?.source === "agent-pill-showcase" && m.type === "chapter") setNow(m.id);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);
  const show = (id: string) => {
    const frame = document.querySelector<HTMLIFrameElement>(".showcase iframe");
    if (!frame) return;
    frame.contentWindow?.postMessage({ target: "agent-pill-showcase", type: "goto", id }, "*");
    setNow(id);
    const r = frame.getBoundingClientRect();
    if (r.top < 60 || r.bottom > innerHeight) frame.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  };
  return (
    <ul className="feats">
      {items.map((f) => (
        <li key={f.title} className={f.chapter && f.chapter === now ? "on" : undefined}>
          <b>{f.title}</b>
          <span>{f.body}</span>
          {f.chapter && (
            <button type="button" onClick={() => show(f.chapter!)}>
              {f.chapter === now ? "playing" : "show me"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectPage({ project: p }: { project: Project }) {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const busy = useRef(false);
  // read once per visit (React runs effects twice in development)
  const fromNextRef = useRef<boolean | null>(null);
  if (fromNextRef.current === null && typeof window !== "undefined") {
    try { fromNextRef.current = !!sessionStorage.getItem(NEXT_KEY); } catch { fromNextRef.current = false; }
  }
  const i = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  // Arriving: the hero rises in (or, from the previous project's Next link, the page slides
  // in from the right). Everything below reveals as it scrolls into view. With reduced
  // motion, nothing moves and everything is simply there.
  useLayoutEffect(() => {
    if (reduced()) return;
    const root = rootRef.current!;
    const q = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const fromNext = !!fromNextRef.current;
    try { sessionStorage.removeItem(NEXT_KEY); } catch {}
    const ctx = gsap.context(() => {
      if (fromNext) gsap.from(q(".pp-wrap"), { x: 70, opacity: 0, duration: 0.5, ease: "power3.out", clearProps: "transform,opacity" });
      // the title rises letter by letter out of a mask; the rest of the hero follows
      const h1 = q(".pp-hero h1");
      gsap.set(h1, { autoAlpha: 0 });
      document.fonts.ready.then(() =>
        ctx.add(() => {
          gsap.set(h1, { autoAlpha: 1 });
          const split = SplitText.create(h1, { type: "words,chars", mask: "words" });
          gsap.set(split.masks, { paddingBottom: "0.14em", marginBottom: "-0.14em" }); // room for descenders
          gsap.from(split.chars, { yPercent: 115, rotate: 6, duration: 0.75, stagger: 0.02, delay: fromNext ? 0.12 : 0.05, ease: "power3.out" });
        }),
      );
      gsap.from(q(".pp-hero > :not(h1)"), { y: 18, opacity: 0, duration: 0.6, stagger: 0.07, delay: fromNext ? 0.3 : 0.25, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.from(q(".pp-status, .pp-bar .dot"), { opacity: 0, duration: 0.4, delay: 0.2 });

      const reveal = (el: Element, vars: gsap.TweenVars, start = "top 86%") =>
        gsap.from(el, { ...vars, scrollTrigger: { trigger: el, start, once: true } });

      // sections and the bits around them: a short rise
      // the showcase uses visibility too: an iframe can paint through its parent's opacity
      q(".showcase").forEach((el) => reveal(el, { y: 24, autoAlpha: 0, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity,visibility" }, "top 95%"));
      q(".pp-part > h2, .pp-part > p").forEach((el) =>
        reveal(el, { y: 24, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity" }),
      );
      // the last things on the page may never get far up the screen: they go as soon as they show
      q(".pp-links, .pp-next").forEach((el) =>
        reveal(el, { y: 18, opacity: 0, duration: 0.5, ease: "power3.out", clearProps: "transform,opacity" }, "top bottom-=20"),
      );
      // screenshots: wiped in from the top, settling as they land
      q(".pp-shots figure").forEach((f, k) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: "top 88%", once: true }, delay: (k % 2) * 0.1 });
        tl.from(f.querySelector("img"), { clipPath: "inset(0 0 100% 0 round 10px)", scale: 1.04, duration: 0.8, ease: "power3.inOut", clearProps: "clipPath,transform" })
          .from(f.querySelector("figcaption"), { opacity: 0, y: 6, duration: 0.35, clearProps: "transform,opacity" }, "-=0.25");
      });
      // what you can do: the cards come in one after another
      q(".feats").forEach((fl) =>
        gsap.from(fl.children, { y: 16, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: fl, start: "top 88%", once: true } }),
      );
      // how it works: the steps arrive one after another, left to right
      q(".flow").forEach((fl) =>
        gsap.from(fl.children, { x: -16, opacity: 0, duration: 0.45, stagger: 0.14, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: fl, start: "top 86%", once: true } }),
      );
      // Bionic Reading: the bolding sweeps across the paragraph
      q(".bionic").forEach((b) =>
        gsap.from(b.querySelectorAll("p.on b"), { color: "var(--pm)", duration: 0.3, stagger: 0.025, ease: "none", clearProps: "color", scrollTrigger: { trigger: b, start: "top 85%", once: true } }),
      );
    }, root);
    return () => ctx.revert();
  }, [p.slug]);

  // the Next link: this project slides out to the left, the next slides in from the right
  const goNext = (e: MouseEvent<HTMLAnchorElement>) => {
    if (busy.current || reduced() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    try { sessionStorage.setItem(NEXT_KEY, "1"); } catch {}
    const root = rootRef.current!;
    gsap.to(root.querySelectorAll(".pp-status, .pp-bar .dot"), { opacity: 0, duration: 0.2 });
    gsap.to(root.querySelector(".pp-wrap"), {
      x: -70, opacity: 0, duration: 0.38, ease: "power2.in",
      onComplete: () => router.push(`/learning/${next.slug}`),
    });
  };

  // back to the index: the page's contents leave, then the index shrinks the panel into place
  const back = (e: MouseEvent<HTMLAnchorElement>) => {
    try { sessionStorage.setItem(FROM_PROJECT_KEY, "1"); } catch {}
    if (busy.current || reduced() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    gsap.to(rootRef.current!.querySelectorAll(".pp-bar, .pp-wrap"), { opacity: 0, duration: 0.16, onComplete: () => router.push("/learning") });
  };

  return (
    <main ref={rootRef} className={`pp ${sans.variable} ${mono.variable} ${hand.variable}`}>
      <ThemeToggle />
      <header className="pp-bar">
        <Link className="pp-back" href="/learning" onClick={back}>
          ← Learning
        </Link>
        <span className={`dot ${p.state === "running" ? "run" : "ok"}`} aria-hidden="true" />
        {p.status && <span className="pp-status">{p.status}</span>}
      </header>

      <div className="pp-wrap">
        <header className="pp-hero pp-in">
          <h1>{p.title}</h1>
          <p className="pp-line">{p.line}</p>
          <dl className="pp-facts">
            <div>
              <dt>When</dt>
              <dd>{p.when}</dd>
            </div>
            {p.role && (
              <div>
                <dt>Role</dt>
                <dd>{p.role}</dd>
              </div>
            )}
            <div>
              <dt>Built with</dt>
              <dd>{p.stack.join(" · ")}</dd>
            </div>
          </dl>
        </header>

        {p.demo === "showcase" && <Showcase />}

        <Part label="what it is">
          <Paras body={p.intro} />
        </Part>

        {p.features && (
          <Part label="what you can do with it">
            <Features items={p.features} />
          </Part>
        )}

        {p.shots && (
          <div className={`pp-shots pp-in n${p.shots.length}`}>
            {p.shots.map((s) => (
              <figure key={s.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/learning/${s.src}.webp`} alt={s.alt} loading="lazy" />
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
        {p.demo === "bionic" && (
          <div className="pp-in">
            <Bionic />
          </div>
        )}

        {p.why && (
          <Part label={p.slug === "rtu-queueing-system" ? "why the Wi-Fi has no internet" : "why I built it"}>
            <Paras body={p.why} />
          </Part>
        )}

        {p.flow && (
          <Part label="how it works">
            <ol className="flow">
              {p.flow.map((s) => (
                <li key={s.label}>
                  <b>{s.label}</b>
                  <span>{s.sub}</span>
                </li>
              ))}
            </ol>
          </Part>
        )}

        {p.hard && (
          <Part label={`the hard part: ${p.hard.title.toLowerCase()}`}>
            <Paras body={p.hard.body} />
          </Part>
        )}

        {p.extra?.map((x) => (
          <Part key={x.title} label={x.title.toLowerCase()}>
            <Paras body={x.body} />
          </Part>
        ))}

        {(p.links || p.credit) && (
          <div className="pp-links pp-in">
            {p.links?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
            {p.credit && <p className="pp-credit">{p.credit}</p>}
          </div>
        )}

        <Link className="pp-next pp-in" href={`/learning/${next.slug}`} onClick={goNext}>
          <span>Next</span>
          <b>{next.title} →</b>
        </Link>
      </div>
    </main>
  );
}
