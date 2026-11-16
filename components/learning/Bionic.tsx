"use client";

import { useState } from "react";

const TEXT =
  "I made this to read long articles faster. It bolds the first part of every word, so your eyes jump from word to word instead of reading each one in full.";

// the same rule as the extension's content script: bold the first 40% of each word
const bionic = (w: string) => {
  const cut = Math.ceil(w.length * 0.4);
  return (
    <>
      <b>{w.slice(0, cut)}</b>
      {w.slice(cut)}
    </>
  );
};

/** The Bionic Reading extension, run on one paragraph: a switch turns it on and off. */
export default function Bionic() {
  const [on, setOn] = useState(true);
  return (
    <div className="bionic">
      <p className={on ? "on" : undefined}>
        {TEXT.split(" ").map((w, i) => (
          <span key={i}>{on ? bionic(w) : w} </span>
        ))}
      </p>
      <button type="button" className="switch" aria-pressed={on} onClick={() => setOn(!on)}>
        {on ? "turn it off" : "turn it on"}
      </button>
    </div>
  );
}
