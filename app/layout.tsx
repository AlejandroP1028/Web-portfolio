import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { THEME_BOOT } from "@/components/landing/theme";

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
  authors: [
    {
      name: "Alejandro Prado",
      url: "https://alejandro-portfolio-zeta.vercel.app/",
    },
  ],
  creator: "Alejandro Prado",
  metadataBase: new URL("https://alejandro-portfolio-zeta.vercel.app/"),
  openGraph: {
    title: "Alejandro Prado | Full-Stack Web Developer",
    description:
      "Explore my portfolio showcasing modern web apps, UI design, and real-world problem solving.",
    url: "https://alejandro-portfolio-zeta.vercel.app/",
    siteName: "Alejandro Prado Portfolio",
    type: "website",
    locale: "en_PH",
  },
  twitter: {
    card: "summary",
    title: "Alejandro Prado | Full-Stack Web Developer",
    description:
      "Portfolio of Alejandro Prado — building modern web applications with React, Next.js, and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: THEME_BOOT may set data-theme on <html> before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className={poppins.className}>
        <Toaster position="top-right" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
