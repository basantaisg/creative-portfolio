"use client";

/**
 * Nav — fixed hairline bar. Brand / anchors / availability + CTA.
 * All labels come from content/site.json.
 */
import site from "@/content/site.json";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-10">
        {/* Brand */}
        <a href="#top" className="type-label text-bone">
          {site.brandMark}
          <span className="text-signal">®</span>
        </a>

        {/* Anchors — hidden on small screens, the page is one scroll anyway */}
        <nav className="hidden gap-8 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="type-label text-dim transition-colors hover:text-signal"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Availability + CTA */}
        <div className="flex items-center gap-5">
          <span className="hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 bg-signal animate-signal" />
            <span className="type-label text-dim">{site.availability}</span>
          </span>
          <a
            href="#contact"
            className="type-label rounded-full border border-line px-4 py-2 text-bone transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}
