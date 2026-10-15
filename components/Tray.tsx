"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { DENOMINATIONS, denomination } from "@/lib/money";
import type { TrayItem } from "@/lib/types";
import Money from "./Money";
import { prefersReducedMotion, type Box } from "./useTray";
import { useRoomy } from "./useRoomy";

/** Piece sizes in the tray, in px, for phone and tablet. */
const SIZES = {
  phone: { noteW: 120, noteH: 60, coin: 62, noteStep: 9, coinStep: 28 },
  roomy: { noteW: 170, noteH: 85, coin: 88, noteStep: 13, coinStep: 40 },
};

/** A pile never grows past this many px along its fan, however many pieces. */
const MAX_SPREAD = { phone: 84, roomy: 130 };

function Piece({
  item,
  left,
  top,
  width,
  height,
  launches,
  onRemove,
  locked,
}: {
  item: TrayItem;
  left: number;
  top: number;
  width: number;
  height: number;
  launches: React.RefObject<Map<number, Box>>;
  onRemove: (id: number) => void;
  locked: boolean;
}) {
  const art = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Fly in from the till slot that was tapped. The item is already in place
  // in the layout; this only animates the drawing from there to here.
  useLayoutEffect(() => {
    const from = launches.current.get(item.id);
    const element = art.current;
    if (!from || !element || prefersReducedMotion()) return;
    launches.current.delete(item.id);
    const to = element.getBoundingClientRect();
    const dx = from.x - to.left;
    const dy = from.y - to.top;
    const scale = from.w / to.width;
    // Not tappable mid-flight, so a fast second tap cannot hit a moving target.
    if (button.current) button.current.style.pointerEvents = "none";
    const animation = element.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        {
          transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 24}px) scale(${(scale + 1.1) / 2}) rotate(8deg)`,
          offset: 0.45,
        },
        { transform: "translate(0, -4px) scale(1.06)", offset: 0.82 },
        { transform: "none" },
      ],
      { duration: 400, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" },
    );
    const done = () => {
      if (button.current) button.current.style.pointerEvents = "";
    };
    animation.onfinish = done;
    animation.oncancel = done;
  }, [item.id, launches]);

  const face = denomination(item.cents).face;
  return (
    <button
      ref={button}
      type="button"
      data-testid="tray-item"
      data-cents={item.cents}
      data-item-id={item.id}
      aria-label={face}
      disabled={locked}
      onClick={() => onRemove(item.id)}
      className="absolute transition-[left,top] duration-200 ease-out"
      style={{ left, top, width, height }}
    >
      <span
        ref={art}
        data-art
        className="money-shadow block h-full w-full origin-top-left"
      >
        <Money cents={item.cents} />
      </span>
    </button>
  );
}

/**
 * The counter where change is laid out. Pieces are grouped by value into
 * fanned piles — biggest notes first — so she can count each pile at a glance.
 * Tapping any piece sends that piece back to the till.
 */
export default function Tray({
  items,
  launches,
  onRemove,
  locked = false,
  shake = false,
  total,
  overlay,
}: {
  items: TrayItem[];
  launches: React.RefObject<Map<number, Box>>;
  onRemove: (id: number) => void;
  locked?: boolean;
  shake?: boolean;
  /** Shown along the lip of the tray. Omit to leave the lip empty. */
  total?: React.ReactNode;
  /** Drawn over the middle of the tray, e.g. the sad face. */
  overlay?: React.ReactNode;
}) {
  const roomy = useRoomy();
  const size = roomy ? SIZES.roomy : SIZES.phone;
  const maxSpread = roomy ? MAX_SPREAD.roomy : MAX_SPREAD.phone;

  const piles = useMemo(() => {
    const groups = new Map<number, TrayItem[]>();
    for (const item of items) {
      const group = groups.get(item.cents) ?? [];
      group.push(item);
      groups.set(item.cents, group);
    }
    return [...DENOMINATIONS]
      .reverse()
      .filter((d) => groups.has(d.cents))
      .map((d) => ({ d, items: groups.get(d.cents)! }));
  }, [items]);

  const total$ = items.reduce((sum, item) => sum + item.cents, 0);

  return (
    <div
      data-testid="tray"
      data-cents={total$}
      data-count={items.length}
      className={`tray relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] ${shake ? "animate-shake" : ""}`}
    >
      <div className="flex min-h-0 flex-1 flex-wrap content-center items-center justify-center gap-x-4 gap-y-3 p-3 roomy:gap-x-6 roomy:gap-y-5 roomy:p-5">
        {piles.map(({ d, items: pile }) => {
          const n = pile.length;
          const isNote = d.kind === "note";
          const w = isNote ? size.noteW : size.coin;
          const h = isNote ? size.noteH : size.coin;
          const wanted = isNote ? size.noteStep : size.coinStep;
          const step = n > 1 ? Math.min(wanted, maxSpread / (n - 1)) : 0;
          // Notes fan downwards with a slight slide; coins overlap sideways.
          const dx = isNote ? step * 0.4 : step;
          const dy = isNote ? step : 0;
          return (
            <div
              key={d.cents}
              data-testid={`tray-pile-${d.cents}`}
              data-count={n}
              className="relative shrink-0 transition-[width,height] duration-200"
              style={{ width: w + dx * (n - 1), height: h + dy * (n - 1) }}
            >
              {pile.map((item, index) => (
                <Piece
                  key={item.id}
                  item={item}
                  left={dx * index}
                  top={dy * index}
                  width={w}
                  height={h}
                  launches={launches}
                  onRemove={onRemove}
                  locked={locked}
                />
              ))}
            </div>
          );
        })}
      </div>

      {total !== undefined && (
        <div className="tray-lip flex items-center justify-center py-1.5 roomy:py-3">
          {total}
        </div>
      )}

      {overlay && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
}
