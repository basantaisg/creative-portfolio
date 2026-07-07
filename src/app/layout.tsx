import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Figtree,
  IBM_Plex_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import site from "@/content/site.json";
import SmoothScroll from "@/components/SmoothScroll";

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

/* seoTitle/seoDescription (site.json) are written for what prospects
   actually type into Google ("video editor"), independent of the
   on-page brand language ("Creative Strategist & Growth Partner"). */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seoTitle,
  description: site.seoDescription,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  category: "Video Production",
  keywords: [
    "video editor",
    "freelance video editor",
    "hire video editor",
    "short-form video editor",
    "reels editor",
    "YouTube video editor",
    "long-form video editing",
    "video ad creative",
    "content strategist",
    "creative strategist",
    "growth partner",
    site.name,
  ],
  openGraph: {
    title: site.seoTitle,
    description: site.seoDescription,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a09",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${figtree.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
    >
      <body className="noise">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
