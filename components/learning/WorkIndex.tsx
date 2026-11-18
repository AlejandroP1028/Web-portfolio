"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { sans, mono } from "../landing/fonts";
import ThemeToggle from "../landing/ThemeToggle";
import { WORK, type Project } from "./projects";
import "../landing/landing.css";
import "./learning.css";
import { useHeadingIntro } from "./useHeadingIntro";


// projects grouped by job, in the order WORK lists them (newest job first)
const groups = WORK.reduce<{ org: string; items: Project[] }[]>((all, p) => {
  const org = p.org ?? "Other";
  const g = all.find((x) => x.org === org);
  if (g) g.items.push(p);
  else all.push({ org, items: [p] });
  return all;
}, []);

/** The Work index: projects listed by job, on the landing's paper. */
export default function WorkIndex() {
  const rootRef = useRef<HTMLElement>(null);
  const leave = useHeadingIntro(rootRef, {
    rest: ".wk-back, .wk-sub, .wk-group h2, .wk-group ol",
    items: ".wk-group li",
    out: ".wk-back, .wk-sub, .wk-group",
  });

  return (
    <main ref={rootRef} className={`wk ${sans.variable} ${mono.variable}`} data-side="work">
      <ThemeToggle />
      <div className="wk-inner">
        <Link className="wk-back" href="/" onClick={leave("/")}>
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Back to the start
        </Link>
        <h1>Work</h1>
        <p className="wk-sub">What I've worked on at my jobs, what my role was and what I did.</p>

        {groups.map((g) => (
          <section key={g.org} className="wk-group" aria-label={g.org}>
            <h2>{g.org}</h2>
            <ol>
              {g.items.map((p) => (
                <li key={p.slug}>
                  <Link className="wk-row" href={`/work/${p.slug}`} onClick={leave(`/work/${p.slug}`)}>
                    <span className="wk-title">{p.title}</span>
                    <span className="wk-line">{p.line}</span>
                    <span className="wk-meta">{p.role ? `${p.role} · ${p.when}` : p.when}</span>
                    <ArrowRight className="wk-go" size={18} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
