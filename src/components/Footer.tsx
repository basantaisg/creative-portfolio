/**
 * Footer — giant name strip + colophon row.
 * Content comes from content/site.json → footer.
 */
import site from "@/content/site.json";

export default function Footer() {
  return (
    <footer className="overflow-hidden">
      {/* Giant name strip */}
      <div className="border-b border-line px-5 py-16 md:px-10">
        <p className="type-display text-center text-[clamp(2.5rem,8.5vw,8rem)] leading-none text-bone/90">
          {site.name}
          <span className="type-serif text-signal">.</span>
        </p>
      </div>

      {/* Colophon */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-5 py-8 md:flex-row md:items-center md:px-10">
        <p className="type-label text-dim">
          © {new Date().getFullYear()} {site.name} — {site.footer.note}
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
