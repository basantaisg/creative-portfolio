"use client";

/**
 * SmoothScroll — root-level Lenis wrapper + global motion policy.
 *
 * Drives native window scrolling through Lenis's RAF loop so every
 * scroll (wheel, touch, anchor click) gets the same fluid easing.
 * `anchors` routes in-page #links through Lenis too, offset so
 * sections land below the fixed 56px nav.
 *
 * Users with prefers-reduced-motion get native scrolling (Lenis is
 * never created) and MotionConfig tells Framer Motion to skip
 * transform animations for them site-wide.
 */
import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -56 },
    });

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
