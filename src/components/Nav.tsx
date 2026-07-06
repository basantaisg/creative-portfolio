"use client";

/**
 * Nav — fixed hairline bar + full-screen mobile menu.
 *
 * Desktop: brand / anchor links / availability + CTA.
 * Mobile (< md): brand + hamburger; links live in an animated
 * full-screen overlay. All labels come from content/site.json.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import site from "@/content/site.json";
import { EASE } from "@/components/motion/Reveal";

export default function Nav() {
  const [open, setOpen] = useState(false);

  /* Lock page scroll while the mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 md:px-10">
        {/* Brand */}
        <a href="#top" className="type-label text-bone" onClick={() => setOpen(false)}>
          {site.brandMark}
          <span className="text-signal">®</span>
        </a>

        {/* Desktop anchors */}
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

        {/* Right cluster */}
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 bg-signal animate-signal" />
            <span className="type-label text-dim">{site.availability}</span>
          </span>

          <a
            href={site.navCta.href}
            target={site.navCta.external ? "_blank" : undefined}
            rel={site.navCta.external ? "noopener noreferrer" : undefined}
            className="type-label hidden rounded-full border border-line px-4 py-2 text-bone transition-colors duration-300 hover:border-signal hover:text-signal sm:inline-block"
          >
            {site.navCta.label} ↗
          </a>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              className="block h-px w-5 bg-bone"
              animate={{ rotate: open ? 45 : 0, y: open ? 3.5 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="block h-px w-5 bg-bone"
              animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-12 md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex flex-col border-t border-line">
              {site.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-line py-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.08 + i * 0.06 }}
                >
                  <span className="type-display text-4xl text-bone">
                    {item.label}
                  </span>
                  <span className="type-label text-dim">0{i + 1}</span>
                </motion.a>
              ))}
            </div>

            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.35 }}
            >
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-signal animate-signal" />
                <span className="type-label text-dim">{site.availability}</span>
              </p>
              <a
                href={site.navCta.href}
                target={site.navCta.external ? "_blank" : undefined}
                rel={site.navCta.external ? "noopener noreferrer" : undefined}
                className="type-label rounded-full bg-signal px-7 py-4 text-center text-ink"
              >
                {site.navCta.label} ↗
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
