"use client";

/**
 * CustomCursor — the entity that travels with the pointer.
 *
 * Two layers:
 *   - dot   : locked 1:1 to the pointer (precision)
 *   - ring  : trails behind on a spring (the "entity"), grows when
 *             hovering anything interactive (a, button, [data-cursor]),
 *             and becomes a solid signal "PLAY" chip over video
 *             facades ([data-cursor="play"])
 *
 * Only mounts on precise pointers — touch devices never render it.
 * The native cursor is hidden via CSS in globals.css (@media pointer:fine).
 */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { EASE } from "@/components/motion/Reveal";
import { useMediaQuery } from "@/components/motion/useMediaQuery";

type CursorMode = "idle" | "hover" | "play";

export default function CustomCursor() {
  /* Touch / stylus devices keep their native behavior. */
  const enabled = useMediaQuery("(pointer: fine)");
  const [mode, setMode] = useState<CursorMode>("idle");
  const [pressed, setPressed] = useState(false);

  /* Raw pointer position (dot) */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  /* Sprung position (ring) — this is what makes it feel alive */
  const ringX = useSpring(x, { stiffness: 250, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 250, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      if (target?.closest('[data-cursor="play"]')) {
        setMode("play");
      } else if (
        target?.closest("a, button, select, input, textarea, [data-cursor]")
      ) {
        setMode("hover");
      } else {
        setMode("idle");
      }
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
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Core dot — exact pointer position (hidden inside the play chip) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200]"
        style={{ x, y }}
      >
        <motion.div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal"
          animate={{ scale: mode === "play" ? 0 : 1 }}
          transition={{ duration: 0.25, ease: EASE }}
        />
      </motion.div>

      {/* Trailing ring — the entity; a solid PLAY chip over video posters */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[199]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border"
          animate={{
            width: mode === "play" ? 64 : mode === "hover" ? 52 : 30,
            height: mode === "play" ? 64 : mode === "hover" ? 52 : 30,
            scale: pressed ? 0.8 : 1,
            opacity: pressed ? 0.6 : 1,
            backgroundColor:
              mode === "play"
                ? "rgba(255, 77, 0, 0.95)"
                : mode === "hover"
                  ? "rgba(233, 230, 223, 0.06)"
                  : "rgba(233, 230, 223, 0)",
            borderColor:
              mode === "play"
                ? "rgba(255, 77, 0, 0)"
                : "rgba(233, 230, 223, 0.4)",
          }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <motion.span
            className="type-label select-none text-ink"
            animate={{ opacity: mode === "play" ? 1 : 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            Play
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}
