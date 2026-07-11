"use client";

/**
 * Magnetic — a light magnetic pull for CTA pills.
 *
 * The wrapper drifts a few pixels toward the cursor and springs back
 * on leave; pressing compresses it slightly. The pull is capped at
 * MAX_PULL so it reads as responsiveness, not a toy.
 *
 * Touch devices and reduced-motion users get a plain wrapper — the
 * effect only exists where a precise pointer does.
 */
import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useMediaQuery } from "@/components/motion/useMediaQuery";

const MAX_PULL = 5; // px — the whole point is restraint
const PULL_RATIO = 0.18; // fraction of cursor offset that becomes drift

type MagneticProps = {
  children: ReactNode;
  className?: string;
};

export default function Magnetic({ children, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (!finePointer || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dx * PULL_RATIO)));
    y.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dy * PULL_RATIO)));
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
