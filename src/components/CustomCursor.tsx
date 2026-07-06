"use client";

/**
 * CustomCursor — the entity that travels with the pointer.
 *
 * Two layers:
 *   - dot   : locked 1:1 to the pointer (precision)
 *   - ring  : trails behind on a spring (the "entity"), grows when
 *             hovering anything interactive (a, button, [data-cursor])
 *
 * Only mounts on precise pointers — touch devices never render it.
 * The native cursor is hidden via CSS in globals.css (@media pointer:fine).
 */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { EASE } from "@/components/motion/Reveal";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  /* Raw pointer position (dot) */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  /* Sprung position (ring) — this is what makes it feel alive */
  const ringX = useSpring(x, { stiffness: 250, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 250, damping: 22, mass: 0.5 });

  useEffect(() => {
    // Touch / stylus devices keep their native behavior.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(
        !!target?.closest("a, button, select, input, textarea, [data-cursor]")
      );
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Core dot — exact pointer position */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200]"
        style={{ x, y }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </motion.div>

      {/* Trailing ring — the entity */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[199]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/40"
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            scale: pressed ? 0.8 : 1,
            opacity: pressed ? 0.6 : 1,
            backgroundColor: hovering
              ? "rgba(233, 230, 223, 0.06)"
              : "rgba(233, 230, 223, 0)",
          }}
          transition={{ duration: 0.35, ease: EASE }}
        />
      </motion.div>
    </>
  );
}
