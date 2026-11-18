"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AgentPill, { type PillOverride } from "../landing/AgentPill";

// The pill goes looking for the page, then gives up and asks you. Each step adds a line to its log.
const steps = (path: string): { s: NonNullable<PillOverride>; line: [string, string]; ms: number }[] => [
  { s: { s: "thinking", label: "Thinking" }, line: ["you", `› open ${path}`], ms: 1200 },
  { s: { s: "tool", label: "Reading" }, line: ["", `Read   ${path}`], ms: 1300 },
  { s: { s: "tool", label: "Searching" }, line: ["", "Search /work /learning /fun"], ms: 1500 },
  { s: { s: "tool", label: "Looking" }, line: ["", "Look   under the couch"], ms: 1400 },
  { s: { s: "tool", label: "Looking" }, line: ["", "Look   behind the laptop"], ms: 1400 },
  { s: { s: "waiting", label: "Needs you" }, line: ["ask", "Not here. Want to pick a side?"], ms: 0 },
];

export default function LostPill() {
  const path = usePathname() ?? "/";
  const all = steps(path.length > 22 ? `${path.slice(0, 21)}…` : path);
  const [i, setI] = useState(0);

  useEffect(() => {
    // reduced motion: straight to the answer
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setI(all.length - 1);
    if (i >= all.length - 1) return;
    const id = setTimeout(() => setI(i + 1), all[i].ms);
    return () => clearTimeout(id);
  }, [i, all]);

  return (
    <div className="nf-pill" role="status" aria-live="polite">
      <AgentPill open override={all[i].s} log={all.slice(0, i + 1).map((x) => x.line)} />
    </div>
  );
}
