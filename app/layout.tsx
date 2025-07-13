import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // optional: customize weights
});
export const metadata: Metadata = {
  title: "Alejandro Prado | Full-Stack Web Developer",
  description:
    "Portfolio of Alejandro Prado — building modern web applications with React, Next.js, and more.",
  keywords: [
    "Alejandro Prado",
    "Software Developer",
    "Full-Stack",
    "React",
    "Next.js",
    "Portfolio",
    "Web Developer",
  ],
  authors: [{ name: "Alejandro Prado", url: "https://alejandroprado.dev" }],
  creator: "Alejandro Prado",
  metadataBase: new URL("https://alejandroprado.dev"),
  openGraph: {
    title: "Alejandro Prado | Full-Stack Web Developer",
    description:
      "Explore my portfolio showcasing modern web apps, UI design, and real-world problem solving.",
    url: "https://alejandroprado.dev",
    siteName: "Alejandro Prado Portfolio",
    type: "website",
    locale: "en_PH",
  },
  twitter: {
    card: "summary",
    title: "Alejandro Prado | Full-Stack Web Developer",
    description:
      "Portfolio of Alejandro Prado — building modern web applications with React, Next.js, and more.",
    creator: "@yourhandle", // optional: replace or remove
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Toaster position="top-right" />
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
