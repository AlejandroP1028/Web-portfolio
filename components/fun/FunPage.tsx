"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { sans, mono, hand } from "../landing/fonts";
import ThemeToggle from "../landing/ThemeToggle";
import { useHeadingIntro } from "../learning/useHeadingIntro";
import { FUN_VIA_WIPE_KEY, GAMES, MADE } from "./games";
import "../landing/landing.css";
import "../learning/learning.css";
import "./fun.css";

gsap.registerPlugin(ScrollTrigger, SplitText);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Photo = { src: string; alt: string; note?: string };

// each polaroid's resting tilt
const TILT = [-4, 3, 1.5];

/** A hand-drawn arrow that points from the photos to the note (drawn in when the spread arrives). */
const Arrow = ({ flip }: { flip: boolean }) => (
  <svg className={`sb-arrow${flip ? " flip" : ""}`} viewBox="0 0 120 50" aria-hidden="true">
    <path d="M4 40 C 30 6, 70 4, 108 22" />
    <path d="M96 12 L108 22 L94 28" />
  </svg>
);

/** One page of the scrapbook: polaroids on one side, the handwritten note on the other. */
function Spread({ i, photos, name, stamp, excerpt, links, onZoom }: {
  i: number;
  photos: Photo[];
  name: string;
  stamp?: string;
  excerpt: string;
  links?: { label: string; href: string }[];
  onZoom: (p: Photo) => void;
}) {
  return (
    <section className={`sb-spread${i % 2 ? " flip" : ""}`} aria-label={name}>
      <div className={`sb-pics n${Math.min(photos.length, 3)}`}>
        {photos.slice(0, 3).map((p, j) => (
          <button key={p.src} type="button" className="sb-pol" style={{ "--r": `${TILT[j]}deg` } as React.CSSProperties} onClick={() => onZoom(p)} aria-label={`View larger: ${p.alt}`}>
            <span className="sb-tape" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading="lazy" />
            {p.note && <span className="sb-cap">{p.note}</span>}
          </button>
        ))}
      </div>
      <div className="sb-note">
        <Arrow flip={i % 2 === 1} />
        <h2>{name}</h2>
        {stamp && <span className="sb-stamp">{stamp}</span>}
        <p>{excerpt}</p>
        {links?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

/** The Fun page: a scrapbook of the games I play (mostly my own screenshots, a few official ones from Steam), then the ones I made. */
export default function FunPage() {
  const rootRef = useRef<HTMLElement>(null);
  const leave = useHeadingIntro(rootRef, { rest: ".wk-back, .wk-sub", out: ".wk-back, .wk-sub, .sb-spread, .sb-made" });
  const [zoom, setZoom] = useState<Photo | null>(null);

  // arriving through the controller's wipe, the dotted paper is already on screen (the wipe carries
  // it), so the page's own dot reveal is skipped; any other way in, the dots spread from the top right
  useLayoutEffect(() => {
    let viaWipe = false;
    try {
      viaWipe = !!sessionStorage.getItem(FUN_VIA_WIPE_KEY);
      sessionStorage.removeItem(FUN_VIA_WIPE_KEY);
    } catch {}
    if (viaWipe) rootRef.current!.classList.add("via-wipe");
  }, []);

  // each spread plays as it scrolls into view: the photos develop in place, the tape goes on,
  // the arrow draws, the name and the note write in from left to right, and the stamp thumps on
  useLayoutEffect(() => {
    if (reduced()) return;
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      gsap.set(root.querySelectorAll(".sb-spread"), { autoAlpha: 0 });
    }, root);
    let live = true;
    document.fonts.ready.then(() => {
      if (!live) return;
      ctx.add(() => {
        root.querySelectorAll<HTMLElement>(".sb-spread").forEach((s) => {
          gsap.set(s, { autoAlpha: 1 });
          const q = (sel: string) => Array.from(s.querySelectorAll<HTMLElement>(sel));
          // the handwriting is revealed line by line, like a pen moving across
          const lines = SplitText.create(q(".sb-note h2, .sb-note p"), { type: "lines" }).lines;
          const arrow = q(".sb-arrow path");
          arrow.forEach((p) => {
            const len = (p as unknown as SVGPathElement).getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
          const tl = gsap
            .timeline({ scrollTrigger: { trigger: s, start: "top 78%", once: true }, defaults: { ease: "power3.out" } })
            // the polaroids appear where they rest, then develop like instant photos: milky and
            // washed out at first, the colour and contrast coming up over about a second
            .from(q(".sb-pol"), { opacity: 0, y: 8, duration: 0.35, ease: "power2.out", stagger: 0.15, clearProps: "transform,opacity" })
            .fromTo(
              q(".sb-pol img"),
              { filter: "brightness(1.9) contrast(0.35) saturate(0) sepia(0.35) blur(1.5px)" },
              { filter: "brightness(1) contrast(1) saturate(1) sepia(0) blur(0px)", duration: 1.4, ease: "power1.inOut", stagger: 0.15, clearProps: "filter" },
              0.15,
            )
            .from(q(".sb-tape"), { scaleX: 0, duration: 0.25, stagger: 0.15, clearProps: "transform" }, 0.3)
            .to(arrow, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut", stagger: 0.25 }, 0.3)
            .fromTo(lines, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power1.inOut", stagger: 0.12 }, 0.45)
;
          // not every note has a stamp or a link
          if (q(".sb-stamp").length) tl.from(q(".sb-stamp"), { scale: 2.2, rotate: -18, opacity: 0, duration: 0.35, ease: "power4.in", clearProps: "transform,opacity" }, 0.8);
          if (q(".sb-note a").length) tl.from(q(".sb-note a"), { opacity: 0, y: 6, duration: 0.3 }, ">");
        });
      });
    });
    return () => {
      live = false;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [zoom]);

  const photosOf = (slug: string, alt: string[], tag?: string): Photo[] =>
    alt.map((a, j) => ({ src: `/fun/${slug}-${j + 1}.webp`, alt: a, note: j === 0 ? tag : undefined }));

  return (
    <main ref={rootRef} className={`wk fn ${sans.variable} ${mono.variable} ${hand.variable}`}>
      <ThemeToggle />
      <div className="wk-inner">
        <Link className="wk-back" href="/" onClick={leave("/")}>
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Back to the start
        </Link>
        <h1>Fun</h1>
        <p className="wk-sub">The games I&apos;ve been playing lately, glued in.</p>

        {GAMES.map((g, i) => (
          <Spread
            key={g.slug}
            i={i}
            photos={photosOf(g.slug, g.alt, g.tag)}
            name={g.name}
            stamp={g.status === "playing" ? `Playing now${g.tag ? ` · ${g.tag}` : ""}` : g.tag}
            excerpt={g.excerpt}
            links={g.link ? [g.link] : undefined}
            onZoom={setZoom}
          />
        ))}

        <div className="sb-made">
          {MADE.map((m, i) => (
            <Spread
              key={m.name}
              i={GAMES.length + i}
              photos={[{ src: `/fun/${m.img}.webp`, alt: m.alt }]}
              name={m.name}
              stamp="Made by me"
              excerpt={m.excerpt}
              links={m.links}
              onZoom={setZoom}
            />
          ))}
        </div>
      </div>

      {zoom && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Esc closes it too
        <div className="sb-zoom" role="dialog" aria-modal="true" aria-label={zoom.alt} onClick={() => setZoom(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom.src} alt={zoom.alt} />
        </div>
      )}
    </main>
  );
}
