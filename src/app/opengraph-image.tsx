import { ImageResponse } from "next/og";
import site from "@/content/site.json";

/**
 * opengraph-image — the social share card, generated at build time.
 * Mirrors the site's visual system: ink surface, hairlines, mono
 * labels, one signal-orange accent. Fonts are pulled from Google
 * Fonts during the build; if that fetch fails the card still renders
 * with the default face rather than failing the build.
 */
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0a0a09";
const BONE = "#e9e6df";
const DIM = "#8b877c";
const SIGNAL = "#ff4d00";
const LINE = "rgba(233, 230, 223, 0.16)";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        family
      )}:wght@${weight}&text=${encodeURIComponent(text)}`
    )
  ).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`No font URL found for ${family}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font ${family}`);
  return res.arrayBuffer();
}

export default async function Image() {
  const kicker = `// ${site.role}`;
  const headline = site.hero.headline.join(" ");
  const footerLeft = site.url.replace("https://", "");
  const footerRight = site.availability;
  const cta = "Book a call";
  const allText = `${kicker}${site.name}${headline}${footerLeft}${footerRight}${cta}`;

  let fonts:
    | { name: string; data: ArrayBuffer; weight: 400 | 600 }[]
    | undefined;
  try {
    const [display, mono] = await Promise.all([
      loadGoogleFont("Bricolage Grotesque", 600, allText),
      loadGoogleFont("IBM Plex Mono", 400, allText),
    ]);
    fonts = [
      { name: "Bricolage", data: display, weight: 600 },
      { name: "PlexMono", data: mono, weight: 400 },
    ];
  } catch {
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "56px 72px",
          fontFamily: fonts ? "Bricolage" : "sans-serif",
        }}
      >
        {/* Top rail: kicker + availability dot */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${LINE}`,
            paddingBottom: 28,
            fontFamily: fonts ? "PlexMono" : "monospace",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: SIGNAL }}>{kicker}</span>
          <span style={{ color: DIM }}>{footerRight}</span>
        </div>

        {/* Name + headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: BONE,
              fontSize: 104,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1.02,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 28,
              gap: 20,
            }}
          >
            <div style={{ width: 56, height: 4, background: SIGNAL }} />
            <div style={{ color: DIM, fontSize: 34, letterSpacing: -0.5 }}>
              {headline}
            </div>
          </div>
        </div>

        {/* Bottom rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
            fontFamily: fonts ? "PlexMono" : "monospace",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: DIM }}>{footerLeft}</span>
          <span
            style={{ display: "flex", alignItems: "center", gap: 14, color: SIGNAL }}
          >
            {cta}
            {/* Arrow drawn as SVG — glyph/emoji fallbacks are unreliable here */}
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M3 13 L13 3 M5 3 H13 V11"
                stroke={SIGNAL}
                strokeWidth="1.8"
                fill="none"
              />
            </svg>
          </span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
