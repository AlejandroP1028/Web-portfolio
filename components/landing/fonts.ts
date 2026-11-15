import { Instrument_Sans, JetBrains_Mono, Shadows_Into_Light } from "next/font/google";

export const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-landing-sans",
});

// The Agent Pill's own font.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-landing-mono",
});

// Hand lettering close to the headline's handwriting, for the words she didn't write (the credit tooltip).
export const hand = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-landing-hand",
});
