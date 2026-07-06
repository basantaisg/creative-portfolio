"use client";

/**
 * HeroCanvas — client-only wrapper around the Three.js scene.
 *
 * The scene is dynamically imported with ssr:false so the Three.js
 * bundle never blocks first paint and never runs on the server.
 * Swapping/removing the 3D layer means touching only this file —
 * the hero layout does not depend on it.
 */
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <HeroScene />
    </div>
  );
}
