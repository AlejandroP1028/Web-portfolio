import Link from "next/link";
import { sans, mono } from "./fonts";
import ThemeToggle from "./ThemeToggle";
import type { Side } from "./scene";
import "./landing.css";

/** Placeholder for each side of the site, in that side's colour, so the landing transition lands on it. */
export default function SidePage({ side, title, text }: { side: Side; title: string; text: string }) {
  return (
    <main className={`side-page ${sans.variable} ${mono.variable}`} data-side={side}>
      <ThemeToggle />
      <div className="side-inner">
        <p className="eyebrow">Alejandro Prado · {title}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <Link className="back" href="/">
          ← Back to the start
        </Link>
      </div>
    </main>
  );
}
