"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { sumCents } from "@/lib/money";
import type { TrayItem } from "@/lib/types";

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A copy of a piece of money flying from the tray back to the till. */
export interface Ghost {
  id: number;
  cents: number;
  from: Box;
  to: Box;
  delay: number;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function boxOf(element: Element | null): Box | null {
  if (!element) return null;
  const r = element.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/** The drawn coin or note inside a till button. */
function tillArt(cents: number): Element | null {
  return document.querySelector(`[data-testid="till-${cents}"] [data-art]`);
}

function trayArt(id: number): Element | null {
  return document.querySelector(`[data-item-id="${id}"] [data-art]`);
}

/**
 * Everything the tray holds, plus the bookkeeping for its animations.
 *
 * State changes are instant — the total updates on the tap — and the motion
 * is layered on top: a new item flies in from where it was tapped, and an
 * item going back leaves a "ghost" copy that flies to its till slot.
 */
export function useTray() {
  const [items, setItems] = useState<TrayItem[]>([]);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const nextId = useRef(1);
  /** Where each new item was launched from, read once when it mounts. */
  const launches = useRef(new Map<number, Box>());

  const total = useMemo(() => sumCents(items), [items]);

  const add = useCallback((cents: number) => {
    const id = nextId.current++;
    const from = boxOf(tillArt(cents));
    if (from && !prefersReducedMotion()) launches.current.set(id, from);
    setItems((previous) => [...previous, { id, cents }]);
  }, []);

  /** Make ghosts for these items, flying home one after another. */
  const sendHome = useCallback((leaving: TrayItem[], stagger: number) => {
    if (prefersReducedMotion()) return;
    const made: Ghost[] = [];
    leaving.forEach((item, index) => {
      const from = boxOf(trayArt(item.id));
      const to = boxOf(tillArt(item.cents));
      if (!from || !to) return;
      made.push({
        id: nextId.current++,
        cents: item.cents,
        from,
        to,
        delay: index * stagger,
      });
    });
    if (made.length) setGhosts((previous) => [...previous, ...made]);
  }, []);

  const remove = useCallback(
    (id: number) => {
      const item = items.find((candidate) => candidate.id === id);
      if (!item) return;
      sendHome([item], 0);
      setItems((previous) => previous.filter((other) => other.id !== id));
    },
    [items, sendHome],
  );

  /** Everything back to the till. Last in goes first, like unstacking. */
  const returnAll = useCallback(() => {
    sendHome([...items].reverse(), 35);
    setItems([]);
  }, [items, sendHome]);

  /** Empty the tray with no flight, e.g. once the money has been handed over. */
  const reset = useCallback(() => setItems([]), []);

  const finishGhost = useCallback((id: number) => {
    setGhosts((previous) => previous.filter((ghost) => ghost.id !== id));
  }, []);

  return {
    items,
    total,
    add,
    remove,
    returnAll,
    reset,
    ghosts,
    finishGhost,
    launches,
  };
}

export type TrayState = ReturnType<typeof useTray>;
