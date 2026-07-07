"use client";

/**
 * HeroCanvas — client-only wrapper around the Three.js scene.
 *
 * The scene is dynamically imported with ssr:false so the Three.js
 * bundle never blocks first paint and never runs on the server.
 * An IntersectionObserver freezes the render loop the moment the
 * hero scrolls out of view — no GPU burned on pixels nobody sees.
 * Swapping/removing the 3D layer means touching only this file —
 * the hero layout does not depend on it.
 */
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <HeroScene active={visible} />
    </div>
  );
}
