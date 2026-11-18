"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type Status = "thinking" | "tool" | "waiting" | "done";
export type PillOverride = { s: Status; label: string } | null;

// The turn from Agent Pill's explainer page, played on a loop.
const STEPS: { s: Status; label: string; ms: number; log: [string, string] }[] = [
  { s: "thinking", label: "Thinking", ms: 1400, log: ["you", "› add a dark mode toggle"] },
  { s: "tool", label: "Reading", ms: 1400, log: ["", "Read   src/app.css"] },
  { s: "waiting", label: "Needs you", ms: 2600, log: ["ask", "Allow edit to src/app.css?"] },
  { s: "tool", label: "Editing", ms: 1600, log: ["", "Edit   src/app.css  +18 −2"] },
  { s: "tool", label: "Running", ms: 1600, log: ["", "Run    npm test"] },
  { s: "done", label: "Done", ms: 3200, log: ["ok", "Done · tests pass"] },
];

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * A recreation of the Agent Pill: its colours, sizes and timings, not the real build.
 * `override` shows a fixed state and pauses the loop (the intro narrates with it);
 * `open` holds the panel open (the Learning transition grows out of it).
 */
export default function AgentPill({
  override = null,
  open = false,
  log,
}: {
  override?: PillOverride;
  open?: boolean;
  log?: [string, string][]; // the panel's lines, when the page writes its own (the 404 page)
}) {
  const [k, setK] = useState(0);
  const [clock, setClock] = useState(0);
  const start = useRef(Date.now());
  const frozen = useRef<number | null>(null);
  const paused = override !== null;

  useEffect(() => {
    if (paused) return;
    if (k === 0) {
      start.current = Date.now();
      frozen.current = null;
    }
    if (STEPS[k].s === "done") frozen.current = Date.now() - start.current;
    const id = setTimeout(() => setK((k + 1) % STEPS.length), STEPS[k].ms);
    return () => clearTimeout(id);
  }, [k, paused]);

  useEffect(() => {
    const id = setInterval(() => setClock(frozen.current ?? Date.now() - start.current), 250);
    return () => clearInterval(id);
  }, []);

  // an outside "Done" stops the clock, like the end of a real turn
  const overrideDone = override?.s === "done";
  useEffect(() => {
    if (overrideDone) frozen.current = Date.now() - start.current;
  }, [overrideDone]);

  // while the intro narrates (override), the panel logs what it said, not the demo turn
  const [olog, setOlog] = useState<[string, string][]>([]);
  useEffect(() => {
    if (!override) return;
    const line: [string, string] =
      override.s === "done" ? ["ok", "Done"] : override.s === "thinking" ? ["you", "› introduce yourself"] : ["", override.label];
    setOlog((l) => (l.length && l[l.length - 1][1] === line[1] ? l : [...l, line]));
  }, [override]);

  const step = override ?? STEPS[k];
  const status = step.s;

  // Motion, after the real app: while working the pill breathes (quicker for a tool than
  // for thinking); on Done a bead runs once round its rim, then it pops, glows and throws
  // a ring of drops. The CSS dot pulse, label rise and "Needs you" ring stay as they are.
  const wrapRef = useRef<HTMLSpanElement>(null);
  // hovering (or focusing) its link opens the pill into its panel (CSS): the pill's motion
  // stops while it is open, so the panel doesn't squash, glow or throw drops
  const [peek, setPeek] = useState(false);
  useEffect(() => {
    const link = wrapRef.current?.closest("a");
    if (!link) return;
    const on = () => setPeek(true);
    const off = () => setPeek(link.matches(":hover") || link.matches(":focus-visible"));
    const evs = ["pointerenter", "focusin"] as const;
    evs.forEach((ev) => link.addEventListener(ev, on));
    link.addEventListener("pointerleave", off);
    link.addEventListener("focusout", off);
    return () => {
      evs.forEach((ev) => link.removeEventListener(ev, on));
      link.removeEventListener("pointerleave", off);
      link.removeEventListener("focusout", off);
    };
  }, []);
  // the Done burst plays when the status turns Done, not again when the panel closes on it
  const seen = useRef<Status | null>(null);
  const wasPeek = useRef(false);
  useEffect(() => {
    const wrap = wrapRef.current;
    const fresh = seen.current !== status;
    seen.current = status;
    // just closed from the panel: wait for it to shrink back (0.32s in CSS) before breathing
    const settle = wasPeek.current && !peek ? 0.35 : 0;
    wasPeek.current = peek;
    if (!wrap || open || peek || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = wrap.querySelector<HTMLElement>(".pillbox")!;
    const bead = wrap.querySelector<HTMLElement>(".bead")!;
    const drops = Array.from(wrap.querySelectorAll<HTMLElement>(".drop"));
    const ctx = gsap.context(() => {
      if (status === "thinking" || status === "tool") {
        gsap.to(wrap, { scaleX: 1.03, scaleY: 0.93, duration: status === "tool" ? 0.32 : 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: settle });
      } else if (status === "done" && fresh) {
        // a point on the pill's rim, a fraction f of the way round, clockwise from the top-left
        // of the straight edge. Measured each frame: the pill may still be resizing.
        const at = (f: number) => {
          const w = box.offsetWidth;
          const h = box.offsetHeight;
          const r = h / 2;
          const flat = w - 2 * r;
          let s = f * (2 * flat + 2 * Math.PI * r);
          if (s < flat) return { x: r + s, y: 0 };
          s -= flat;
          if (s < Math.PI * r) { const a = -Math.PI / 2 + s / r; return { x: w - r + r * Math.cos(a), y: r + r * Math.sin(a) }; }
          s -= Math.PI * r;
          if (s < flat) return { x: w - r - s, y: h };
          s -= flat;
          const a = Math.PI / 2 + s / r;
          return { x: r + r * Math.cos(a), y: r + r * Math.sin(a) };
        };
        const run = { s: 0 };
        const glow = "0 0 0 6px rgba(111, 214, 154, 0.35), 0 4px 12px rgba(0, 0, 0, 0.28)";
        const rest = "0 0 0 0px rgba(111, 214, 154, 0), 0 4px 12px rgba(0, 0, 0, 0.28)";
        gsap.set(wrap, { scaleX: 1, scaleY: 1 });
        gsap.timeline()
          .set(bead, { opacity: 1, ...at(0) })
          .to(run, { s: 1, duration: 0.75, ease: "power1.inOut", onUpdate: () => { gsap.set(bead, at(run.s)); } })
          .to(bead, { opacity: 0, duration: 0.15 }, ">-0.1")
          .to(wrap, { scale: 1.07, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" }, "<")
          .fromTo(box, { boxShadow: rest }, { boxShadow: glow, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.out" }, "<")
          // the drops leave from the rim of the pill as it is by then (values read when they start)
          .fromTo(drops,
            { x: (i) => Math.cos((i / drops.length) * Math.PI * 2) * (box.offsetWidth / 2), y: (i) => Math.sin((i / drops.length) * Math.PI * 2) * (box.offsetHeight / 2), opacity: 1, scale: 1 },
            { x: (i) => Math.cos((i / drops.length) * Math.PI * 2) * (box.offsetWidth / 2 + 16), y: (i) => Math.sin((i / drops.length) * Math.PI * 2) * (box.offsetHeight / 2 + 14), opacity: 0, scale: 0.4, duration: 0.55, ease: "power2.out", immediateRender: false },
            "<");
      }
    }, wrap);
    return () => ctx.revert();
  }, [status, open, peek]);

  return (
    <span className="pillhold">
      <span className="pillwrap" ref={wrapRef}>
        <span className={`pillbox s-${status}${open ? " open" : ""}`}>
          <span className="pill-head">
            <span className="dot" />
            <span className="state" key={step.label}>
              {step.label}
            </span>
            <span className="time">{fmt(clock)}</span>
          </span>
          <ol className="log">
            {(log ?? (override && olog.length ? olog : STEPS.slice(0, k + 1).map((x) => x.log))).map(([cls, text], i) => (
              <li key={i} className={cls}>
                {text}
              </li>
            ))}
          </ol>
        </span>
        <span className={`ringwrap${status === "waiting" && !open ? " on" : ""}`} />
        <span className="bead" aria-hidden="true" />
        {Array.from({ length: 8 }, (_, i) => <span key={i} className="drop" aria-hidden="true" />)}
      </span>
    </span>
  );
}
