"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { sans, mono } from "../landing/fonts";
import ThemeToggle from "../landing/ThemeToggle";
import { WORK, type Project } from "./projects";
import "../landing/landing.css";
import "./learning.css";
import { useHeadingIntro } from "./useHeadingIntro";
import { WORK_VIA_WIPE_KEY } from "./panel";

// projects grouped by job, in the order WORK lists them (newest job first)
const groups = WORK.reduce<{ org: string; items: Project[] }[]>((all, p) => {
  const org = p.org ?? "Other";
  const g = all.find((x) => x.org === org);
  if (g) g.items.push(p);
  else all.push({ org, items: [p] });
  return all;
}, []);

/** The Work index: the jobs as a timeline on an engineering pad, each project a printout on it. */
export default function WorkIndex() {
  const rootRef = useRef<HTMLElement>(null);
  const leave = useHeadingIntro(rootRef, {
    rest: ".wk-back, .wk-sub, .wk-when, .wk-dot, .wk-job h2, .wk-role, .wk-foot",
    items: ".wk-card",
    out: ".wk-back, .wk-sub, .wk-tl, .wk-foot",
  });

  // arriving through the laptop's wipe, the pad is already on screen (the wipe carries it), so the
  // page doesn't rule it in again; any other way in, the rows rule across, then the columns down
  useLayoutEffect(() => {
    try {
      if (!sessionStorage.getItem(WORK_VIA_WIPE_KEY)) return;
      sessionStorage.removeItem(WORK_VIA_WIPE_KEY);
    } catch {
      return;
    }
    rootRef.current!.classList.add("via-wipe");
  }, []);

  return (
    <main ref={rootRef} className={`wk ${sans.variable} ${mono.variable}`} data-side="work">
      <div className="wk-pad" aria-hidden="true">
        <i className="h" />
        <i className="v" />
      </div>
      <ThemeToggle />
      <div className="wk-inner">
        <Link className="wk-back" href="/" onClick={leave("/")}>
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Back to the start
        </Link>
        <h1>Work</h1>
        <p className="wk-sub">Where I&apos;ve worked and what I did there</p>

        {/* newest job first; the filled dot is the job I'm in now */}
        <ol className="wk-tl">
          {groups.map((g) => {
            const now = g.items.some((p) => p.state === "running");
            return (
              <li key={g.org} className="wk-job">
                <span className="wk-when">{g.items[0].when}</span>
                <span className="wk-spine" aria-hidden="true">
                  <span className={`wk-dot${now ? " now" : ""}`} />
                </span>
                <div className="wk-body">
                  <h2>{g.org}</h2>
                  {g.items[0].role && <span className="wk-role">{g.items[0].role}</span>}
                  {g.items.map((p) => (
                    <Link key={p.slug} className="wk-card" href={`/work/${p.slug}`} onClick={leave(`/work/${p.slug}`)}>
                      <b>{p.title}</b>
                      <span>{p.line}</span>
                      <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="wk-foot">
          <a className="wk-cv" href="/alejandro-prado-cv.pdf" download>
            <Download size={16} strokeWidth={1.5} aria-hidden="true" />
            Download my CV
          </a>
          <small>PDF</small>
        </div>
      </div>
    </main>
  );
}
