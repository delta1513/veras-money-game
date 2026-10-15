"use client";

import { useSyncExternalStore } from "react";

/** Same breakpoint as the `roomy` variant in globals.css. */
const ROOMY = "(min-width: 700px) and (min-height: 600px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(ROOMY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True on a tablet-sized screen. The tray lays its piles out with numbers, not
 * classes, so it needs the breakpoint in JavaScript too.
 */
export function useRoomy(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(ROOMY).matches,
    () => false,
  );
}
