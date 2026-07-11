"use client";

/**
 * Hero — full-viewport opener.
 *
 * Layering (back → front):
 *   1. HeroCanvas   — the Three.js rig (client-only, removable)
 *   2. gradient     — legibility scrim so type always wins
 *   3. content      — kicker, masked headline, subline, CTAs, stat rail
 *
 * All copy lives in content/site.json → hero. The line whose index
 * matches `accentWordIndex` renders in the italic serif accent face.
 */
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import site from "@/content/site.json";
import HeroCanvas from "@/components/three/HeroCanvas";
import { MaskReveal, EASE } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import { publishedWork } from "@/components/Work";

export default function Hero() {
  const { hero } = site;

  /* Scroll exit: as the hero leaves, content drifts up and fades while
     the 3D rig recedes (scale + dim on the canvas wrapper — a single
     composited transform, the scene itself never re-renders for this).
     Scroll-linked styles bypass MotionConfig, so reduced motion is
     honored explicitly here. */
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  /* While the Work section is hidden (no published videos yet, see
     Work.tsx) "#work" is a dead anchor — send "See the work" to
     Instagram, where the real edits live. Reverts on first publish. */
  const instagram = site.footer.socials.find((s) => s.label === "Instagram");
  const secondaryCta =
    publishedWork.length > 0 || !instagram
      ? hero.secondaryCta
      : { ...hero.secondaryCta, href: instagram.href, external: true };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden border-b border-line"
    >
      {/* 1 — 3D layer (recedes on scroll exit) */}
      <motion.div
        className="absolute inset-0"
        style={
          reducedMotion
            ? undefined
            : { scale: canvasScale, opacity: canvasOpacity }
        }
      >
        <HeroCanvas />
      </motion.div>

      {/* 2 — legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink" />

      {/* 3 — content (drifts up + fades on scroll exit) */}
      <motion.div
        className="relative mx-auto w-full max-w-[1400px] px-5 pb-6 pt-28 md:px-10 md:pb-8 md:pt-32"
        style={
          reducedMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
      >
        <motion.p
          className="type-label mb-8 text-signal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        >
          {"//"} {hero.kicker}
          <span className="hidden sm:inline"> · {site.location}</span>
        </motion.p>

        {/* Headline: one masked reveal per line, staggered */}
        <h1 className="type-display text-[clamp(2.25rem,10vw,7.5rem)]">
          {hero.headline.map((line, i) => (
            <MaskReveal key={line} delay={0.25 + i * 0.12}>
              {i === hero.accentWordIndex ? (
                <span className="type-serif text-signal">{line}</span>
              ) : (
                <span className="text-bone">{line}</span>
              )}
            </MaskReveal>
          ))}
        </h1>

        {/* Subline + CTAs */}
        <motion.div
          className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
        >
          <p className="max-w-md text-base leading-relaxed text-dim">
            {hero.subline}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:shrink-0 sm:flex-row">
            <Magnetic>
              <a
                href={hero.primaryCta.href}
                target={hero.primaryCta.external ? "_blank" : undefined}
                rel={hero.primaryCta.external ? "noopener noreferrer" : undefined}
                className="type-label block rounded-full bg-signal px-7 py-4 text-center text-ink transition-colors duration-300 hover:bg-bone"
              >
                {hero.primaryCta.label} ↗
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={secondaryCta.href}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className="type-label block rounded-full border border-line px-7 py-4 text-center text-bone transition-colors duration-300 hover:border-signal hover:text-signal"
              >
                {secondaryCta.label}
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* Stat rail */}
        <motion.dl
          className="mt-16 grid grid-cols-2 border-t border-line md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
        >
          {hero.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-4 pr-4 md:py-6 md:pr-6 ${i > 0 ? "border-l border-line pl-4 md:pl-6" : ""} ${
                i === 2 ? "max-md:border-l-0 max-md:pl-0 max-md:border-t max-md:border-line" : ""
              } ${i === 3 ? "max-md:border-t max-md:border-line" : ""}`}
            >
              <dd className="type-display text-2xl text-bone md:text-3xl">
                {stat.value}
              </dd>
              <dt className="type-label mt-2 block text-dim">{stat.label}</dt>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
