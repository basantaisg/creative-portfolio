import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Figtree,
  IBM_Plex_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import site from "@/content/site.json";

/* Display face — characterful variable grotesque for headlines */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

/* Body face — clean, warm humanist sans for running copy */
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

/* Serif accent — italic emphasis words inside headlines */
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

/* Mono face — small system labels, indices, prices */
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.hero.subline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${figtree.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <body className="noise">{children}</body>
    </html>
  );
}
