"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { SplitText } from "gsap/SplitText";
import { sans, mono, hand } from "../landing/fonts";
import ThemeToggle from "../landing/ThemeToggle";
import Bionic from "./Bionic";
import { PROJECTS, type Feature, type Project, type Shot } from "./projects";
import { FROM_PROJECT_KEY } from "./panel";

gsap.registerPlugin(SplitText);
const NEXT_KEY = "learning-next"; // arriving from a neighbour's Next ("next") or Previous ("prev") link
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
  states: "Every pill shows what its conversation is doing right now",
  panel: "Click a pill and its terminal opens, click away and it shrinks back",
  permission: "When Claude needs an answer, the pill waits for you instead of popping open",
  groups: "Pills merge into groups, one per project",
  dock: "Dock a group to the edge and it turns into blobs that move with Claude's state",
  themes: "Themes for the pills, the panel and the terminal",
};

// Phones get recordings of each chapter instead of the live app (it's a desktop app, and too
// heavy for a phone). Lengths match the tour's chapters (agent-pill src/lib/tour.ts).
const GIF_MS: Record<string, number> = { states: 9000, panel: 11000, permission: 10000, groups: 8000, dock: 9000, themes: 10000 };
const PHONE = "(max-width: 760px)";
const say = (msg: object) => window.postMessage({ source: "agent-pill-showcase", ...msg }, "*");

/** The real Agent Pill interface, running a scripted tour on a pretend desktop. */
function Showcase() {
  const [caption, setCaption] = useState(CHAPTERS.states);
  const [paused, setPaused] = useState(false);
  // null until mounted, so the server render loads neither the app nor a GIF
  const [phone, setPhone] = useState<boolean | null>(null);
  const [gif, setGif] = useState("states");
  useEffect(() => setPhone(matchMedia(PHONE).matches), []);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      const m = e.data;
      if (m?.target === "agent-pill-showcase" && m.type === "goto" && GIF_MS[m.id]) setGif(m.id); // "show me" on a phone
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
  // on a phone: announce the chapter like the app does, then move on when its recording ends
  useEffect(() => {
    if (!phone) return;
    say({ type: "chapter", id: gif });
    const ids = Object.keys(GIF_MS);
    const t = setTimeout(() => setGif(ids[(ids.indexOf(gif) + 1) % ids.length]), GIF_MS[gif]);
    return () => clearTimeout(t);
  }, [phone, gif]);
  return (
    <figure className="showcase pp-in">
      {phone === false && <iframe src="/learning/agent-pill/index.html?showcase" title="Agent Pill running a short tour; you can take over and use it" />}
      {phone && (
        // eslint-disable-next-line @next/next/no-img-element -- an animated GIF, next/image would freeze it
        <img key={gif} src={`/learning/pill/${gif}.gif`} alt={`Agent Pill: ${CHAPTERS[gif]}`} width={480} height={689} />
      )}
      {phone === null && <div className="showcase-wait" />}
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
    const frame = document.querySelector<HTMLElement>(".showcase iframe, .showcase img");
    if (!frame) return;
    // the live app, or on a phone the Showcase's recordings
    ((frame as HTMLIFrameElement).contentWindow ?? window).postMessage({ target: "agent-pill-showcase", type: "goto", id }, "*");
    setNow(id);
    const r = frame.getBoundingClientRect();
    if (r.top < 60 || r.bottom > innerHeight) frame.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  };
  // the tour's chapters read as a list next to it; the rest is plain text below
  const tour = items.filter((f) => f.chapter);
  const more = items.filter((f) => !f.chapter);
  return (
    <>
      <ol className="feats">
        {tour.map((f) => (
          <li key={f.title} className={f.chapter === now ? "on" : undefined}>
            <span className={`dot ${f.chapter === now ? "run" : ""}`} aria-hidden="true" />
            <b>{f.title}</b>
            <span className="body">{f.body}</span>
            <button type="button" onClick={() => show(f.chapter!)}>
              {f.chapter === now ? "playing" : "show me"}
            </button>
          </li>
        ))}
      </ol>
      {more.length > 0 && (
        <ul className="feats-more">
          {more.map((f) => (
            <li key={f.title}>
              <b>{f.title}</b>
              <span>{f.body}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * A screenshot at a readable size: full screen, pannable when it's wider than the screen
 * (on phones the captures are desktop-sized). Closed with the button, Esc, or a tap outside.
 */
function Zoom({ shot, phone, onClose }: { shot: Shot; phone?: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);
  return (
    <div className={phone ? "zoom phone" : "zoom"} role="dialog" aria-modal="true" aria-label={shot.caption} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="zoom-bar">
        <span>{shot.caption}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close the screenshot">
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <div className="zoom-scroll" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/learning/${shot.src}.webp`} alt={shot.alt} />
      </div>
    </div>
  );
}
export default function ProjectPage({ project: p }: { project: Project }) {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const [zoom, setZoom] = useState<Shot | null>(null);
  // read once per visit (React runs effects twice in development)
  // +1: arrived via Next (slides in from the right), -1: via Previous (from the left), 0: neither
  const fromNextRef = useRef<number | null>(null);
  if (fromNextRef.current === null && typeof window !== "undefined") {
    let v: string | null = null;
    try { v = sessionStorage.getItem(NEXT_KEY); } catch {}
    fromNextRef.current = v === "next" ? 1 : v === "prev" ? -1 : 0;
  }
  const i = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];

  // Arriving: the hero rises in (or, from the previous project's Next link, the page slides
  // in from the right). Everything below reveals as it scrolls into view. With reduced
  // motion, nothing moves and everything is simply there.
  useLayoutEffect(() => {
    if (reduced()) return;
    const root = rootRef.current!;
    const q = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s));
    const dir = fromNextRef.current ?? 0;
    const fromNext = dir !== 0;
    try { sessionStorage.removeItem(NEXT_KEY); } catch {}

    // Scroll reveals: each animation is created paused (so it already shows its start state)
    // and played once its element comes into view. IntersectionObserver instead of
    // ScrollTrigger: no scroll maths to refresh, which is what failed on phones.
    const plays = new Map<Element, () => void>();
    const seen: IntersectionObserverCallback = (entries, obs) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        plays.get(e.target)?.();
      });
    const io = new IntersectionObserver(seen, { rootMargin: "0px 0px -10% 0px" });
    const ioEdge = new IntersectionObserver(seen); // for the last things on the page: as soon as they show
    const onView = (el: Element, anim: gsap.core.Animation, edge = false) => {
      plays.set(el, () => anim.play());
      (edge ? ioEdge : io).observe(el);
    };

    let live = true;
    const ctx = gsap.context(() => {
      if (fromNext) gsap.from(q(".pp-wrap"), { x: 70 * dir, opacity: 0, duration: 0.5, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.from(q(".pp-hero > :not(h1)"), { y: 12, opacity: 0, duration: 0.6, stagger: 0.07, delay: fromNext ? 0.3 : 0.25, ease: "power3.out", clearProps: "transform,opacity" });
      gsap.from(q(".pp-status, .pp-bar .dot"), { opacity: 0, duration: 0.4, delay: 0.2 });
      // the title: hidden until the fonts are in, then it rises letter by letter (below)
      gsap.set(q(".pp-hero h1"), { autoAlpha: 0 });

      const rise = (el: Element, vars: gsap.TweenVars, edge = false) =>
        onView(el, gsap.from(el, { ...vars, paused: true }), edge);
      // the showcase uses visibility too: an iframe can paint through its parent's opacity
      // one reveal everywhere: a short fade and rise
      const up = { y: 12, opacity: 0, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" };
      q(".showcase").forEach((el) => rise(el, { ...up, autoAlpha: 0, clearProps: "transform,opacity,visibility" }, true));
      q(".pp-part > h2, .pp-part > p, .pp-shots figure").forEach((el) => rise(el, up));
      q(".pp-links, .pp-pager").forEach((el) => rise(el, up, true));
      q(".feats, .feats-more, .flow").forEach((fl) => onView(fl, gsap.from(fl.children, { ...up, stagger: 0.05, paused: true })));
      // Bionic Reading: the bolding sweeps across the paragraph
      q(".bionic").forEach((b) => onView(b, gsap.from(b.querySelectorAll("p.on b"), { color: "var(--pm)", duration: 0.3, stagger: 0.025, ease: "none", clearProps: "color", paused: true })));
    }, root);

    document.fonts.ready.then(() => {
      if (!live) return;
      ctx.add(() => {
        const h1 = q(".pp-hero h1");
        gsap.set(h1, { autoAlpha: 1 });
        const split = SplitText.create(h1, { type: "words,chars", mask: "words" });
        gsap.set(split.masks, { paddingBottom: "0.14em", marginBottom: "-0.14em" }); // room for descenders
        gsap.from(split.chars, { yPercent: 115, rotate: 6, duration: 0.75, stagger: 0.02, delay: fromNext ? 0.12 : 0.05, ease: "power3.out" });
      });
    });

    return () => {
      live = false;
      io.disconnect();
      ioEdge.disconnect();
      ctx.revert();
    };
  }, [p.slug]);

  // Next and Previous: this project slides out one way and its neighbour comes in from the other
  const step = (to: Project, d: 1 | -1) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (busy.current || reduced() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    try { sessionStorage.setItem(NEXT_KEY, d === 1 ? "next" : "prev"); } catch {}
    const root = rootRef.current!;
    gsap.to(root.querySelectorAll(".pp-status, .pp-bar .dot"), { opacity: 0, duration: 0.2 });
    gsap.to(root.querySelector(".pp-wrap"), {
      x: -70 * d, opacity: 0, duration: 0.38, ease: "power2.in",
      onComplete: () => router.push(`/learning/${to.slug}`),
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
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Learning
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
          <div className={`pp-shots pp-in n${p.shots.length}${p.phoneShots ? " phone" : ""}`}>
            {p.shots.map((s) => (
              <figure key={s.src}>
                <button type="button" className="shot" onClick={() => setZoom(s)} aria-label={`View larger: ${s.caption}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/learning/${s.src}.webp`} alt={s.alt} loading="lazy" />
                </button>
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
                {l.label}
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </a>
            ))}
            {p.credit && <p className="pp-credit">{p.credit}</p>}
          </div>
        )}

        <nav className="pp-pager pp-in" aria-label="Other projects">
          <Link className="prev" href={`/learning/${prev.slug}`} onClick={step(prev, -1)}>
            <span>Previous</span>
            <b>
              <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
              {prev.title}
            </b>
          </Link>
          <Link className="next" href={`/learning/${next.slug}`} onClick={step(next, 1)}>
            <span>Next</span>
            <b>
              {next.title}
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </b>
          </Link>
        </nav>
      </div>
      {zoom && <Zoom shot={zoom} phone={p.phoneShots} onClose={() => setZoom(null)} />}
    </main>
  );
}
