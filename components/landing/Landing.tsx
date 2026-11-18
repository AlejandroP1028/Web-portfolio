"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import gsap from "gsap";
import AgentPill, { type PillOverride } from "./AgentPill";
import ThemeToggle from "./ThemeToggle";
import { HEADLINE, HEART, PEN as PEN_WIDTH, SMILE, SMILE_BOX, STROKES, UNITS_PER_EM, VIEWBOX } from "./headlineGlyphs";
import * as TIP from "./tipGlyphs";

// the credit is written like the headline: stroke after stroke, the pen time shared out by
// length. [delay, duration] per stroke, in seconds (CSS runs it when the tooltip shows).
const TIP_PEN_TIME = 1.1;
const TIP_TIMES = (() => {
  const total = TIP.LENS.reduce((a, b) => a + b, 0);
  let t = 0;
  return TIP.LENS.map((l) => {
    const d = Math.max(0.04, (TIP_PEN_TIME * l) / total);
    t += d;
    return [t - d, d];
  });
})();
const TIP_WRITTEN = TIP_TIMES[TIP_TIMES.length - 1].reduce((a, b) => a + b);
import { sans, mono, hand } from "./fonts";
import { panelInset } from "../learning/panel";
import type { AnimState, Side, Target } from "./scene";
import "./landing.css";

type Scene = { setHover(side: Side | null): void; target(side: "work" | "fun"): Target | null; dispose(): void };

const NAME = HEADLINE; // the drawn headline is a handwriting trace; regenerate it to change the words
const RETURN_KEY = "landing-return";
const INTRO_KEY = "landing-intro-seen"; // the intro plays once per browser session
/** Intro playback speed: 1 is about 8s; 1.25 is faster, 0.8 slower. */
const INTRO_SPEED = 1.8;
// Module state survives client-side navigation but not a refresh: the intro can only play on a
// full page load (the first one this session), and the way back from a side page plays instead
// after in-app navigation.
let loadedOnce = false;
const FULL = "inset(0px 0px 0px 0px round 0px)";
const BACKDROP_BLUR = 10; // px; landing.css uses the same for .is-backdrop and the way back from Learning

const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { sessionStorage.removeItem(k); } catch {} },
};
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const insetOf = (t: Target, round: number) =>
  `inset(${t.y}px ${innerWidth - t.x - t.w}px ${innerHeight - t.y - t.h}px ${t.x}px round ${round}px)`;
const rectOf = (el: Element): Target => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};

// Runs while the HTML is parsed (full page loads only), before first paint, so the intro
// starts from its first frame instead of flashing the finished page.
const BOOT = `(function(){try{sessionStorage.removeItem('${RETURN_KEY}')}catch(e){}
var seen=null;try{seen=sessionStorage.getItem('${INTRO_KEY}')}catch(e){}
if(!seen&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.currentScript.parentElement.classList.add('is-intro')})()`;

/** What this visit plays: the intro (first full page load of the session), the way back from a side page, or nothing. */
function pickMode(): { intro: boolean; ret: Side | null } {
  if (typeof window === "undefined" || reduced()) return { intro: false, ret: null };
  if (!loadedOnce) {
    store.del(RETURN_KEY);
    return { intro: !store.get(INTRO_KEY), ret: null };
  }
  return { intro: false, ret: store.get(RETURN_KEY) as Side | null };
}

/**
 * The landing. It lives in the (home) layout, so it stays mounted under the Learning index
 * (/learning), which is an overlay: while that's open the landing is blurred and inert.
 */
export default function Landing() {
  const router = useRouter();
  const overlay = usePathname() === "/learning";
  // opened straight onto /learning (a link or a refresh): no intro, just the still landing
  const [startedUnder] = useState(overlay);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workRef = useRef<HTMLSpanElement>(null);
  const funRef = useRef<HTMLSpanElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const busy = useRef(false);

  const [mode] = useState(() => (startedUnder ? { intro: false, ret: null } : pickMode()));
  const [introOn, setIntroOn] = useState(mode.intro);
  const [retOn, setRetOn] = useState(mode.ret !== null);
  const [gl, setGl] = useState<"boot" | "ready" | "none">("boot");
  const [pill, setPill] = useState<PillOverride>(mode.intro ? { s: "thinking", label: "Thinking" } : null);
  const [pillOpen, setPillOpen] = useState(false);
  const anim = useRef<AnimState>({
    lapDraw: mode.intro ? 0 : 1,
    ctlDraw: mode.intro ? 0 : 1,
    flash: 0,
    press: mode.ret === "learning" ? null : mode.ret,
  });

  useEffect(() => {
    loadedOnce = true;
  }, []);

  // Under the Learning overlay the page can't be focused or clicked (React 18 doesn't render
  // a boolean `inert`, so it's set here). The theme toggle stays usable.
  const lastOverlay = useRef(overlay);
  useLayoutEffect(() => {
    const wrap = rootRef.current!.querySelector<HTMLElement>(".wrap")!;
    const wipe = wipeRef.current!;
    if (overlay) wrap.setAttribute("inert", "");
    else wrap.removeAttribute("inert");
    const was = lastOverlay.current;
    lastOverlay.current = overlay;
    if (overlay && !was) {
      // the overlay's panel is now drawn exactly where the growing pill ended: hand over to it
      requestAnimationFrame(() => requestAnimationFrame(() => {
        wipe.classList.remove("on");
        gsap.set(wipe, { clearProps: "clipPath" });
        setPillOpen(false); // closes behind the panel, so it's back to size for the way out
        busy.current = false;
      }));
    } else if (!overlay && was) {
      // closed: the panel (now this wipe, in the overlay's place) shrinks back into the pill
      // while the page comes back into focus. Before paint, so nothing flashes in between.
      wipe.dataset.side = "learning";
      wipe.classList.add("on");
      const box = rectOf(rootRef.current!.querySelector(".pillbox")!);
      gsap.fromTo(wrap, { filter: `blur(${BACKDROP_BLUR}px)` }, { filter: "blur(0px)", duration: 0.6, ease: "power2.inOut", clearProps: "filter" });
      gsap.fromTo(wipe, { clipPath: panelInset() }, {
        clipPath: insetOf(box, 14), duration: 0.6, ease: "power3.inOut",
        onComplete: () => { wipe.classList.remove("on"); gsap.set(wipe, { clearProps: "clipPath" }); },
      });
    }
  }, [overlay]);

  // three.js loads after the page, so the text and the pill show at once
  useEffect(() => {
    let scene: Scene | null = null;
    let cancelled = false;
    import("./scene")
      .then(({ createLandingScene }) => {
        if (cancelled) return;
        scene = createLandingScene({
          canvas: canvasRef.current!,
          stageWork: workRef.current!,
          stageFun: funRef.current!,
          tokens: rootRef.current!,
          anim: anim.current,
        });
        sceneRef.current = scene;
        setGl("ready");
      })
      .catch(() => !cancelled && setGl("none"));
    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // The intro: the Agent Pill narrates while the page builds itself (about 8s); any input skips it.
  useLayoutEffect(() => {
    if (!mode.intro) return;
    store.set(INTRO_KEY, "1");
    const q = gsap.utils.selector(rootRef.current);
    const typed = q(".typed")[0] as HTMLElement;
    const hold = q('.obj[data-side="learning"] .pillhold')[0];
    const box = q(".pillbox")[0];
    const rest = q(".intro p, .pick, .lab");
    const r = hold.getBoundingClientRect();
    const say = (s: "tool" | "done", label: string) => () => setPill({ s, label });

    // The pill goes to whatever it is working on. Points are viewport px, turned into an
    // offset from the pill's own slot in the row and kept on screen (phones stack the row).
    const slot = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    // x keeps the whole pill on screen (232px, stretched 1.14x in flight): on a phone,
    // "under the pen" runs past the edge
    const to = (px: number, py: number) => ({
      x: gsap.utils.clamp(Math.min(140, innerWidth / 2), Math.max(innerWidth - 140, innerWidth / 2), px) - slot.x,
      y: gsap.utils.clamp(40, innerHeight - 40, py) - slot.y,
    });
    const h1 = typed.parentElement!.getBoundingClientRect();
    // just under the headline, trailing the letter being written (like a cursor label)
    const under = (x: number) => to(x + 100, h1.bottom + 20);
    // across an object while drawing it: f = 0 at the start of the sweep, 1 at the end
    const over = (el: HTMLElement, f: number) => {
      const s = el.getBoundingClientRect();
      return to(s.left + s.width * (0.28 + 0.44 * f), s.top + s.height * (0.1 + 0.12 * f));
    };
    const work = workRef.current!;
    const fun = funRef.current!;
    const followX = gsap.quickTo(hold, "x", { duration: 0.3, ease: "power2.out" });

    gsap.set(hold, { ...to(innerWidth / 2, innerHeight / 2), scale: 1.15 });
    gsap.set(box, { width: 8, height: 8, borderRadius: 4, opacity: 1 });

    // The headline is handwriting (headlineGlyphs.ts): single pen strokes in the order she
    // wrote them, each drawn with stroke-dashoffset while the pill trails the pen.
    const pens = Array.from(rootRef.current!.querySelectorAll<SVGPathElement>(".mark .st"));
    const lens = pens.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    // dash = the stroke's length; the gap is long enough that no second dash (or its round
    // cap) shows at the path's end. Offset = length: nothing drawn yet, but the round cap
    // would still leave a dot, so each stroke stays invisible until the pen reaches it.
    pens.forEach((p, i) => gsap.set(p, { strokeDasharray: `${lens[i]} ${lens[i] + PEN_WIDTH * 2}`, strokeDashoffset: lens[i], strokeOpacity: 0 }));
    gsap.set(typed, { visibility: "visible" });

    // each stroke starts while the previous one is finishing; PEN_TIME is stretched so the
    // overlapped line still takes about 2s
    const OVERLAP = 0.5; // share of a stroke still left to draw when the next one starts
    const PEN_TIME = 2 / (1 - OVERLAP); // seconds of pen time for the whole line, shared out by stroke length
    const write = gsap.timeline();
    let t = 0;
    pens.forEach((p, i) => {
      const d = Math.max(0.06, (PEN_TIME * lens[i]) / total); // dots still get a moment
      write.call(() => { followX(under(p.getBoundingClientRect().right).x); }, [], t)
        .set(p, { strokeOpacity: 1 }, t)
        .to(p, { strokeDashoffset: 0, duration: d, ease: "power1.inOut" }, t);
      t += d * (1 - OVERLAP);
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
    tl.to(box, { width: 232, height: 28, borderRadius: 14, duration: 0.5, ease: "back.out(1.6)" }, 0.1)
      // writing: moves under the headline and follows the pen
      .call(say("tool", "Reading alejandro.md"), [], 0.8)
      .to(hold, { ...under(pens[0].getBoundingClientRect().left), scale: 1, duration: 0.6, ease: "power3.inOut" }, 0.8)
      .add(write, 1.45)
      .to(q(".intro p"), { opacity: 1, y: 0, duration: 0.5 }, 4.0)
      // drawing the laptop: flies over, then sweeps across it as the lines appear
      .call(say("tool", "Drawing laptop"), [], 3.8)
      .to(hold, { ...over(work, 0), duration: 0.6, ease: "power3.inOut" }, 3.8)
      .to(hold, { ...over(work, 1), duration: 1.3, ease: "sine.inOut" }, 4.4)
      .to(anim.current, { lapDraw: 1, duration: 1.3, ease: "power1.inOut" }, 4.3)
      // drawing the controller, the same way
      .call(say("tool", "Drawing controller"), [], 5.7)
      .to(hold, { ...over(fun, 0), duration: 0.6, ease: "power3.inOut" }, 5.7)
      .to(hold, { ...over(fun, 1), duration: 1.3, ease: "sine.inOut" }, 6.3)
      .to(anim.current, { ctlDraw: 1, duration: 1.3, ease: "power1.inOut" }, 6.2)
      .to(anim.current, { flash: 1, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.inOut" }, 7.55)
      // back into its place in the row first, then Done plays there (AgentPill's finish)
      .to(hold, { x: 0, y: 0, scale: 1, duration: 0.7, ease: "power3.inOut" }, 7.6)
      .call(say("done", "Done"), [], 8.3)
      .to(box, { width: 162, duration: 0.35, ease: "power3.inOut" }, 8.3)
      .to(q(".pick, .lab"), { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, 8.6);
    // each flight (to the headline, the laptop, the controller, home): the pill stretches as
    // it sets off and eases back into shape as it lands, with no bounce
    for (const at of [0.8, 3.8, 5.7, 7.6]) {
      tl.to(box, { scaleX: 1.14, scaleY: 0.86, duration: 0.28, ease: "power2.out" }, at)
        .to(box, { scaleX: 1, scaleY: 1, duration: 0.35, ease: "power2.inOut" }, at + 0.32);
    }
    tl.timeScale(INTRO_SPEED);

    const skip = () => tl.progress(1);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    const off = () => events.forEach((e) => window.removeEventListener(e, skip));
    const reset = () => {
      gsap.set([hold, box, ...rest, ...pens], { clearProps: "all" });
      gsap.set(typed, { clearProps: "visibility" }); // keep React's inline width on the headline svg
    };

    // the pill holds "Done" for a beat, then starts its next turn
    let resume: ReturnType<typeof setTimeout> | undefined;
    function finish() {
      off();
      anim.current.lapDraw = anim.current.ctlDraw = 1;
      anim.current.flash = 0;
      reset();
      setPill({ s: "done", label: "Done" });
      setIntroOn(false);
      resume = setTimeout(() => setPill(null), 2200);
    }
    return () => {
      off();
      tl.kill();
      clearTimeout(resume);
      reset();
    };
  }, [mode.intro]);

  // Coming back from a side page: its colour shrinks back into the object it came out of.
  const retPlayed = useRef(false);
  useEffect(() => {
    const side = mode.ret;
    if (!side || retPlayed.current) return;
    if (side !== "learning" && gl === "boot") return; // wait for the 3D to measure the door
    retPlayed.current = true;
    store.del(RETURN_KEY);
    const wipe = wipeRef.current!;
    const done = () => {
      anim.current.press = null;
      // drop the class that shows the colour before un-clipping it, or it flashes full screen
      flushSync(() => setRetOn(false));
      gsap.set(wipe, { clearProps: "all" });
    };
    if (side === "learning") {
      const box = rectOf(rootRef.current!.querySelector(".pillbox")!);
      gsap.fromTo(rootRef.current!.querySelector(".wrap"), { filter: `blur(${BACKDROP_BLUR}px)` }, { filter: "blur(0px)", duration: 0.6, ease: "power2.inOut", clearProps: "filter" });
      gsap.fromTo(wipe, { clipPath: panelInset() }, { clipPath: insetOf(box, 14), duration: 0.6, ease: "power3.inOut", onComplete: done });
    } else if (gl === "ready") {
      fill(side, 1, 0, 0.6, "power3.inOut").then(done);
    } else {
      gsap.to(wipe, { opacity: 0, duration: 0.3, onComplete: done });
    }
    // no cleanup: this re-runs when the 3D finishes loading, and must not cut its own animation short
  }, [gl, mode.ret]);

  /**
   * The side's colour grows out of an object's door to fill the screen (from 0 to 1), or
   * shrinks back into it (1 to 0): a circle from the controller's home button, a rounded
   * rectangle from the laptop's screen. The door is measured every frame, since the
   * object keeps moving while it turns to face you.
   */
  const fill = (side: "work" | "fun", from: number, to: number, duration: number, ease: string) => {
    const wipe = wipeRef.current!;
    const p = { v: from };
    const paint = () => {
      const d = sceneRef.current?.target(side);
      if (!d) return;
      if (side === "fun") {
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        const far = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
        wipe.style.clipPath = `circle(${d.w / 2 + (far - d.w / 2) * p.v}px at ${cx}px ${cy}px)`;
      } else {
        const k = 1 - p.v;
        wipe.style.clipPath = `inset(${d.y * k}px ${(innerWidth - d.x - d.w) * k}px ${(innerHeight - d.y - d.h) * k}px ${d.x * k}px round ${6 * k}px)`;
      }
    };
    paint();
    return gsap.to(p, { v: to, duration, ease, onUpdate: paint }).then();
  };

  // The smile is a button: a click rubs it out with the pen and draws her heart in its place,
  // the heart beats once, then the credit writes itself beside it (CSS, on h1.thanks).
  // Another click takes it back.
  const [thanks, setThanks] = useState(false);
  const heartTl = useRef<gsap.core.Timeline | null>(null);
  const toggleThanks = (e: MouseEvent<HTMLButtonElement>) => {
    const h1 = e.currentTarget.parentElement!;
    const smile = Array.from(h1.querySelectorAll<SVGPathElement>(".mark .smile"));
    const heart = h1.querySelector<SVGPathElement>(".mark .heart")!;
    const sl = smile.map((p) => p.getTotalLength());
    const hl = heart.getTotalLength();
    const dash = (l: number) => `${l} ${l + PEN_WIDTH * 2}`;
    heartTl.current?.kill();
    const tl = gsap.timeline();
    if (!thanks) {
      tl.set(smile, { strokeDasharray: (i: number) => dash(sl[i]) })
        .to(smile, { strokeDashoffset: (i: number) => sl[i], duration: 0.22, ease: "power1.in", stagger: { each: 0.06, from: "end" } })
        .set(smile, { strokeOpacity: 0 })
        .set(heart, { strokeDasharray: dash(hl), strokeDashoffset: hl, strokeOpacity: 1, scale: 1, transformOrigin: "50% 50%" })
        .to(heart, { strokeDashoffset: 0, duration: 0.75, ease: "power1.inOut" })
        .to(heart, { scale: 1.16, duration: 0.13, yoyo: true, repeat: 1, ease: "power2.out" })
        .call(() => setThanks(true));
    } else {
      setThanks(false);
      tl.set(heart, { strokeDasharray: dash(hl) })
        .to(heart, { strokeDashoffset: hl, duration: 0.4, ease: "power1.in" })
        .set(heart, { strokeOpacity: 0 })
        .set(smile, { strokeOpacity: 1 })
        .to(smile, { strokeDashoffset: 0, duration: 0.22, ease: "power1.out", stagger: 0.06 });
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) tl.progress(1);
    heartTl.current = tl;
  };

  const hoverProps = (side: Side) => ({
    onPointerEnter: () => sceneRef.current?.setHover(side),
    onPointerLeave: () => sceneRef.current?.setHover(null),
    onFocus: () => sceneRef.current?.setHover(side),
    onBlur: () => sceneRef.current?.setHover(null),
  });

  // Opening a side: the object reacts, the camera dives into its door, and the side's colour fills the screen.
  const go = (side: Side) => (e: MouseEvent<HTMLAnchorElement>) => {
    const wipe = wipeRef.current;
    if (!wipe || busy.current || reduced() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    busy.current = true;
    const stage = e.currentTarget.querySelector(".stage")!;
    const grow = (from: string, duration: number, ease: string) => {
      wipe.dataset.side = side;
      wipe.classList.add("on");
      return gsap.fromTo(wipe, { clipPath: from }, { clipPath: FULL, duration, ease }).then();
    };
    const run = async () => {
      if (side === "learning") {
        // the pill opens into its panel, which then grows into the Learning panel: the
        // Learning index draws its panel in that exact box, so the page change is seamless
        setPillOpen(true);
        await wait(320);
        wipe.dataset.side = side;
        wipe.classList.add("on");
        // the landing stays, blurred, behind the panel (the Learning page draws it the same way)
        gsap.to(rootRef.current!.querySelector(".wrap"), { filter: `blur(${BACKDROP_BLUR}px)`, duration: 0.6, ease: "power2.inOut" });
        await gsap.fromTo(wipe, { clipPath: insetOf(rectOf(stage.querySelector(".pillbox")!), 16) }, { clipPath: panelInset(), duration: 0.6, ease: "power3.inOut" }).then();
      } else if (sceneRef.current) {
        anim.current.press = side;
        await wait(220);
        wipe.dataset.side = side;
        wipe.classList.add("on");
        await fill(side, 0, 1, 0.65, "power3.inOut");
      } else {
        await grow(insetOf(rectOf(stage), 18), 0.56, "power3.inOut");
      }
      if (side !== "learning") store.set(RETURN_KEY, side); // learning is an overlay: the landing never leaves
      router.push(`/${side}`);
    };
    run();
  };

  // after the intro or the way back, the row is already in place: its entrance must not replay
  const settled = (mode.intro && !introOn) || mode.ret !== null;
  const modeClass = `${introOn ? " is-intro" : ""}${settled ? " settled" : ""}${retOn ? ` is-returning ret-${mode.ret}` : ""}`;
  return (
    <div
      ref={rootRef}
      className={`landing ${sans.variable} ${mono.variable} ${hand.variable} gl-${gl}${modeClass}${overlay ? " is-backdrop" : ""}${startedUnder ? " settled" : ""}`}
      suppressHydrationWarning
    >
      {!startedUnder && <script dangerouslySetInnerHTML={{ __html: BOOT }} />}
      <ThemeToggle />
      <main className="wrap">
        <header className="intro">
          <h1 className={thanks ? "thanks" : undefined}>
            <span className="sr">{NAME}</span>
            {/* the box of the handwriting: the smile button and the credit are placed in it */}
            <span className="hand">
              <svg className="typed mark" viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
                style={{ width: `${VIEWBOX.width / UNITS_PER_EM}em` }} aria-hidden="true">
                {STROKES.map((d, i) => (
                  <path key={i} className={i >= STROKES.length - SMILE ? "st smile" : "st"} d={d} strokeWidth={PEN_WIDTH} />
                ))}
                <path className="heart" d={HEART} strokeWidth={PEN_WIDTH} />
              </svg>
              <button
                type="button"
                className="smile-btn"
                aria-pressed={thanks}
                aria-label="A thank-you"
                onClick={toggleThanks}
                style={{
                  left: `${(SMILE_BOX.x / VIEWBOX.width) * 100}%`,
                  top: `${(SMILE_BOX.y / VIEWBOX.height) * 100}%`,
                  width: `${(SMILE_BOX.w / VIEWBOX.width) * 100}%`,
                  height: `${(SMILE_BOX.h / VIEWBOX.height) * 100}%`,
                }}
              />
              {/* the credit, just right of the heart */}
              <span
                className="tip"
                aria-live="polite"
                style={{ left: `${((SMILE_BOX.x + SMILE_BOX.w) / VIEWBOX.width) * 100}%`, top: `${((SMILE_BOX.y + SMILE_BOX.h / 2) / VIEWBOX.height) * 100}%` }}
              >
                <span className="tipbox" style={{ "--written": `${TIP_WRITTEN}s` } as CSSProperties}>
                  <svg
                    className="txt"
                    viewBox={`0 0 ${TIP.VIEWBOX.width} ${TIP.VIEWBOX.height}`}
                    style={{ width: `${TIP.VIEWBOX.width / TIP.UNITS_PER_EM}em`, height: `${TIP.VIEWBOX.height / TIP.UNITS_PER_EM}em` }}
                  >
                    <title>special thanks to my girlfriend</title>
                    {TIP.STROKES.map((d, i) => (
                      <path
                        key={i}
                        className={d.endsWith("h0.01") ? "dot" : undefined}
                        d={d}
                        pathLength={1}
                        strokeWidth={TIP.PEN}
                        style={{ "--t": `${TIP_TIMES[i][0]}s`, "--d": `${TIP_TIMES[i][1]}s` } as CSSProperties}
                      />
                    ))}
                  </svg>
                  {/* drawn for the tooltip's wide shape, so the stroke isn't stretched */}
                  <svg className="loop" viewBox="0 0 300 64" preserveAspectRatio="none" aria-hidden="true">
                    <path pathLength={1} d="M30 12C90 2 230 0 284 14c22 8 14 32-40 40-70 9-170 8-222-4C-6 42 2 18 40 9c40-9 110-10 160-6" />
                  </svg>
                </span>
              </span>
            </span>
          </h1>
          <p>I work on software, learn by building, and unwind with games.</p>
          <span className="pick">
            Pick one <span aria-hidden="true">↓</span>
          </span>
        </header>

        <div className="row">
          <canvas className="scene" ref={canvasRef} aria-hidden="true" />

          <Link className="obj" data-side="work" href="/work" onClick={go("work")} {...hoverProps("work")}
            aria-label="Work: screenshots and the problems I solve">
            <span className="stage" ref={workRef}>
              <svg className="fallback" viewBox="0 0 320 240" fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <rect className="fill" x="40" y="20" width="240" height="152" rx="9" />
                <rect className="fill scr" x="55" y="35" width="210" height="122" rx="4" />
                <path className="fill" d="M22 182 H298 L316 210 H4 Z" />
                <path d="M132 196 H188" />
              </svg>
            </span>
            <span className="lab">Work <i aria-hidden="true">→</i></span>
          </Link>

          <Link className="obj" data-side="learning" href="/learning" onClick={go("learning")} {...hoverProps("learning")}
            aria-label="Learning: the Agent Pill and what I build to learn">
            <span className="stage">
              <AgentPill override={pill} open={pillOpen} />
            </span>
            <span className="lab">Learning <i aria-hidden="true">→</i></span>
          </Link>

          <Link className="obj" data-side="fun" href="/fun" onClick={go("fun")} {...hoverProps("fun")}
            aria-label="Fun: games, the gym and cooking">
            <span className="stage" ref={funRef}>
              <svg className="fallback" viewBox="0 0 420 270" fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path className="fill" d="M210 23 C270 19 330 9 375 15 C400 30 414 70 416 125 C416 175 405 230 380 255 C355 268 330 258 318 235 C305 205 290 178 250 172 L170 172 C130 178 115 205 102 235 C90 258 65 268 40 255 C15 230 4 175 4 125 C6 70 20 30 45 15 C90 9 150 19 210 23 Z" />
                <path d="M82 77 h16 v-16 h16 v16 h16 v16 h-16 v16 h-16 v-16 h-16 Z" />
                <circle cx="330" cy="59" r="12" />
                <circle cx="356" cy="85" r="12" />
                <circle cx="330" cy="111" r="12" />
                <circle cx="304" cy="85" r="12" />
                <circle className="ring" cx="148" cy="153" r="27" />
                <circle className="fill" cx="148" cy="153" r="19" />
                <circle className="ring" cx="272" cy="153" r="27" />
                <circle className="fill" cx="272" cy="153" r="19" />
                <circle cx="210" cy="59" r="11" fill="var(--fun)" />
              </svg>
            </span>
            <span className="lab">Fun <i aria-hidden="true">→</i></span>
          </Link>
        </div>

      </main>
      {/* the edge draws an ink outline around the wipe's clipped shape (only for Work, whose wipe is paper on paper) */}
      <div className="wipe-edge">
        <div className="wipe" ref={wipeRef} aria-hidden="true" />
      </div>
    </div>
  );
}
