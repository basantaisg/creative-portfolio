"use client";

/**
 * HeroCanvas — client-only wrapper around the Three.js scene.
 *
 * The scene is dynamically imported with ssr:false so the Three.js
 * bundle never blocks first paint and never runs on the server.
 * An IntersectionObserver freezes the render loop the moment the
 * hero scrolls out of view — no GPU burned on pixels nobody sees.
 * Devices that asked for less (Save-Data) or have little memory
 * never download or mount the scene at all — the hero's gradient
 * scrim carries the composition alone.
 * Swapping/removing the 3D layer means touching only this file —
 * the hero layout does not depend on it.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

/** Save-Data on, or ≤ 2GB device memory → not worth a WebGL context. */
function lowEndDevice(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return (
    nav.connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
  );
}

/* Static per-session capability read; false on the server so low-end
   devices never even fetch the Three.js chunk. */
const noSubscription = () => () => {};
function useCapableDevice(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => !lowEndDevice(),
    () => false
  );
}

export default function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const capable = useCapableDevice();

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
      {capable && <HeroScene active={visible} />}
    </div>
  );
}
