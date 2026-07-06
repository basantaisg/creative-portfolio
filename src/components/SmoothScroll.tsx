"use client";

/**
 * SmoothScroll — root-level Lenis wrapper.
 * Drives native window scrolling through Lenis's RAF loop so every
 * scroll (wheel, touch, anchor jump) gets the same fluid easing.
 * Renders no DOM of its own — position:fixed children (Nav) are
 * unaffected since Lenis animates native scrollTop, not a transform.
 */
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

  return <>{children}</>;
}
