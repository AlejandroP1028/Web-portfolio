import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sans, mono } from "@/components/landing/fonts";
import ThemeToggle from "@/components/landing/ThemeToggle";
import LostPill from "@/components/notfound/LostPill";
import "@/components/landing/landing.css";
import "@/components/learning/learning.css";

export const metadata = { title: "Not found | Alejandro Prado" };

/** Any address that doesn't exist: the Agent Pill goes looking for it, then asks you to pick a side. */
export default function NotFound() {
  return (
    <main className={`wk nf ${sans.variable} ${mono.variable}`}>
      <ThemeToggle />
      <div className="wk-inner nf-grid">
        <div className="nf-text">
          <Link className="wk-back" href="/">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            Back to the start
          </Link>
          <h1>404</h1>
          <p className="wk-sub">This page doesn't exist. The pill is having a look anyway.</p>
          <nav className="nf-sides" aria-label="Pages">
            <Link href="/work">Work</Link>
            <Link href="/learning">Learning</Link>
            <Link href="/fun">Fun</Link>
          </nav>
        </div>
        <LostPill />
      </div>
    </main>
  );
}
