import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { sans, mono, hand } from "@/components/landing/fonts";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { GAMES, MADE } from "@/components/fun/games";
import "@/components/landing/landing.css";
import "@/components/learning/learning.css";
import "@/components/fun/fun.css";

export const metadata = { title: "Fun | Alejandro Prado" };

/** One page: each game I play with its screenshots and a few words, then the games I've made. */
export default function FunPage() {
  return (
    <main className={`wk fn ${sans.variable} ${mono.variable} ${hand.variable}`}>
      <ThemeToggle />
      <div className="wk-inner">
        <Link className="wk-back" href="/">
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Back to the start
        </Link>
        <h1>Fun</h1>
        <p className="wk-sub">The games I&apos;m into, from screenshots I took while playing.</p>

        {GAMES.map((g) => (
          <section key={g.slug} className="fn-game" aria-labelledby={g.slug}>
            <div className={`fn-shots n${g.shots}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {g.alt.map((alt, i) => <img key={i} src={`/fun/${g.slug}-${i + 1}.webp`} alt={alt} loading="lazy" />)}
            </div>
            <div className="fn-text">
              <h2 id={g.slug}>
                {g.name}
                {g.tag && <span className="fn-tag">{g.tag}</span>}
              </h2>
              <span className="fn-status">{g.status === "playing" ? "Playing now" : "Played"}</span>
              <p>{g.excerpt}</p>
              {g.link && (
                <a href={g.link.href} target="_blank" rel="noopener noreferrer">
                  {g.link.label}
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              )}
            </div>
          </section>
        ))}

        <h2 className="fn-made-head">Games I made</h2>
        {MADE.map((m) => (
          <section key={m.name} className="fn-game" aria-label={m.name}>
            <div className="fn-shots n1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/fun/${m.img}.webp`} alt={m.alt} loading="lazy" />
            </div>
            <div className="fn-text">
              <h2>{m.name}</h2>
              <p>{m.excerpt}</p>
              {m.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
