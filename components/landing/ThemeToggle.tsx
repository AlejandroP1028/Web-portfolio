"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { THEME_KEY } from "./theme";

type Theme = "light" | "dark";

// Every page mounts its own button; the icon draws in once per page load, then only on a switch.
let drawnOnce = false;

const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

/**
 * Light / Dark switch: one hand-drawn icon. Until someone picks, the page follows the system setting; a pick is
 * saved and set as <html data-theme>, which the landing CSS and the 3D scene both follow.
 */
export default function ThemeToggle() {
  // unknown during server render; filled in on mount so hydration matches
  const [theme, setTheme] = useState<Theme | null>(null);
  const [still] = useState(() => drawnOnce);
  const [switched, setSwitched] = useState(false);

  useEffect(() => {
    const read = () => (document.documentElement.dataset.theme as Theme | undefined) ?? systemTheme();
    setTheme(read());
    drawnOnce = true;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => setTheme(read());
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  const [erasing, setErasing] = useState(false);

  const pick = (t: Theme, b: DOMRect) => {
    const apply = () => {
      setErasing(false);
      document.documentElement.dataset.theme = t;
      try {
        localStorage.setItem(THEME_KEY, t);
      } catch {}
      flushSync(() => {
        setSwitched(true);
        setTheme(t);
      });
    };
    // The new theme grows out of the button as a circle (a view transition: the browser
    // snapshots the page before and after, and the new snapshot is revealed by the clip).
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.45, 0, 0.25, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  // the button shows the theme you are in. A click erases its icon with the pen, then switches to the
  // other theme, whose icon is drawn in with the pen (its key changes, so it mounts afresh).
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" className="theme-toggle" onClick={(e) => {
        if (erasing) return;
        const b = e.currentTarget.getBoundingClientRect();
        if (reduce()) return pick(next, b);
        setErasing(true);
        setTimeout(() => pick(next, b), 280);
      }} aria-label={`Switch to ${next} theme`}>
      {theme && (
        <svg key={theme} className={`sketch${erasing ? " erase" : still && !switched ? " still" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
          <path pathLength={1} d={theme === "dark" ? MOON : SUN} />
        </svg>
      )}
      <svg className="loop" viewBox="0 0 48 48" aria-hidden="true">
        <path pathLength={1} d="M14 7C24 2 38 5 42 16c4 11-3 24-16 26C13 44 4 35 5 23 6 14 14 7 24 6c5 0 9 1 12 3" />
      </svg>
    </button>
  );
}

// hand-drawn icons: slightly uneven, like the headline
const SUN = "M12 8.3c2.2-.2 3.9 1.5 3.8 3.8-.1 2.1-1.8 3.7-3.9 3.7-2.2 0-3.8-1.8-3.7-3.9.1-2 1.7-3.6 3.8-3.6M12 2.6v2.5M12.2 19v2.4M2.7 12.1h2.4M19 11.8h2.4M5.4 5.3l1.7 1.8M17 17l1.8 1.8M5.3 18.7l1.8-1.8M17.1 7l1.6-1.8";
const MOON = "M14.8 3.4c-4.5.6-7.4 4.6-6.8 9 .6 4.1 4.4 7 8.5 6.4 1.5-.2 2.9-.9 3.9-2-4.4.4-8.1-3-7.9-7.3.1-2.6 1.1-4.7 2.3-6.1";
