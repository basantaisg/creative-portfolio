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
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Load-triggered masked line reveal (text slides up from behind a
 * clipping box). Used for the hero headline choreography.
 */
export function MaskReveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
