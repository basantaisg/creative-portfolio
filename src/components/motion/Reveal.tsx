"use client";

/**
 * Shared motion primitives.
 * Every scroll/load animation on the site routes through these two
 * components so the whole page moves with one consistent signature.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* One easing curve for the entire site — heavy start, long decel. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/* Shared viewport contract: fire once, slightly before fully on-screen */
const VIEWPORT = { once: true, margin: "-60px" } as const;

/**
 * Scroll-triggered rise + fade. Fires once when the element enters
 * the viewport. Use for anything below the fold.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line reveal (text slides up from behind a clipping box).
 * Fires on load by default (hero headline); pass `inView` to fire
 * when scrolled into view instead (section titles).
 */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
  inView = false,
}: RevealProps & { inView?: boolean }) {
  const target = { y: 0 };
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        {...(inView
          ? { whileInView: target, viewport: VIEWPORT }
          : { animate: target })}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Hairline that draws itself in, left to right. Stands in for a
 * static border-b so section rules arrive instead of just existing.
 * Under reduced motion the transform is skipped and it simply appears.
 */
export function LineDraw({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px w-full origin-left bg-line ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  );
}

/**
 * Frame-settle for video slots: the shot fades in while easing down
 * from a slight over-scale inside its own clipping frame — a cut
 * locking into place, not a card floating up. Transform + opacity
 * only; the poster underneath keeps loading regardless.
 */
export function FrameSettle({ children, delay = 0, className }: RevealProps) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
