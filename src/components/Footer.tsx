/**
 * Footer — giant name strip + colophon row.
 * Content comes from content/site.json → footer.
 */
import site from "@/content/site.json";

export default function Footer() {
  /* The track holds two identical halves; the marquee keyframe shifts
     it by exactly -50%, so the loop point is invisible. Freezes under
     prefers-reduced-motion (globals.css). */
  const nameRun = (
    <span aria-hidden="true" className="flex shrink-0 items-baseline">
      {[0, 1].map((i) => (
        <span key={i} className="flex shrink-0 items-baseline">
          {site.name}
          <span className="type-serif text-signal">.</span>
          <span className="mx-[0.5em] text-signal">·</span>
        </span>
      ))}
    </span>
  );

  return (
    <footer className="overflow-hidden">
      {/* Giant name marquee */}
      <div className="border-b border-line py-16">
        <p className="sr-only">{site.name}</p>
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="animate-marquee flex shrink-0 items-baseline">
            <span className="type-display flex shrink-0 items-baseline text-[clamp(2.5rem,8.5vw,8rem)] leading-none text-bone/90">
              {nameRun}
              {nameRun}
            </span>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-5 py-8 md:flex-row md:items-center md:px-10">
        <p className="type-label text-dim">
          © {new Date().getFullYear()} {site.name}. {site.footer.note}
        </p>

        <nav className="flex gap-6">
          {site.footer.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="type-label text-dim transition-colors hover:text-signal"
            >
              {social.label}
            </a>
          ))}
        </nav>

        <a
          href="#top"
          className="type-label text-dim transition-colors hover:text-signal"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
