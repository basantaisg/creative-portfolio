"use client";

/**
 * useMediaQuery — SSR-safe media query subscription.
 * Returns false on the server / during hydration, then tracks the
 * live media query (so e.g. plugging in a mouse flips pointer:fine).
 */
import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
