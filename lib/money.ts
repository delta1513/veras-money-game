import type { Denomination, Level, LevelConfig } from "./types";

/**
 * Every Australian coin and note in circulation, smallest first. Values are
 * integer cents so no sum ever meets a floating-point rounding error.
 *
 * Coin `scale` follows the real diameters (5c 19.4mm, 10c 23.6mm, 20c 28.7mm,
 * 50c 31.6mm across the flats, $1 25mm, $2 20.5mm), nudged up a little at the
 * small end so the 5c stays easy to see.
 */
export const DENOMINATIONS: readonly Denomination[] = [
  { cents: 5, kind: "coin", metal: "silver", scale: 0.64, face: "5c" },
  { cents: 10, kind: "coin", metal: "silver", scale: 0.76, face: "10c" },
  { cents: 20, kind: "coin", metal: "silver", scale: 0.9, face: "20c" },
  {
    cents: 50,
    kind: "coin",
    metal: "silver",
    dodecagon: true,
    scale: 1,
    face: "50c",
  },
  { cents: 100, kind: "coin", metal: "gold", scale: 0.82, face: "$1" },
  { cents: 200, kind: "coin", metal: "gold", scale: 0.7, face: "$2" },
  { cents: 500, kind: "note", face: "$5" },
  { cents: 1000, kind: "note", face: "$10" },
  { cents: 2000, kind: "note", face: "$20" },
  { cents: 5000, kind: "note", face: "$50" },
  { cents: 10000, kind: "note", face: "$100" },
];

export const COINS = DENOMINATIONS.filter((d) => d.kind === "coin");
export const NOTES = DENOMINATIONS.filter((d) => d.kind === "note");

const BY_CENTS = new Map(DENOMINATIONS.map((d) => [d.cents, d]));

export function denomination(cents: number): Denomination {
  const found = BY_CENTS.get(cents);
  if (!found) throw new Error(`no denomination worth ${cents}c`);
  return found;
}

export const LEVEL_ORDER: readonly Level[] = [1, 2, 3];

export const LEVELS: Record<Level, LevelConfig> = {
  // $1.00 to $10.00 in 5c steps: coins and the odd small note.
  1: { min: 100, max: 1000, step: 5, alwaysShowCents: true },
  // $10 to $100, whole dollars.
  2: { min: 1000, max: 10000, step: 100, alwaysShowCents: false },
  // $100 to $1000 in $5 steps.
  3: { min: 10000, max: 100000, step: 500, alwaysShowCents: false },
};

/** Amounts paid in one round. */
export const ROUND_LENGTH = 5;

/**
 * Dollar text for a cents value. Cents are shown when asked for, or whenever
 * they are not zero, so "$45" and "$45.50" both read naturally. No thousands
 * separator: "$1000" is easier to copy than "$1,000".
 */
export function formatCents(cents: number, alwaysShowCents = false): string {
  const dollars = Math.floor(cents / 100);
  const rest = cents % 100;
  if (!alwaysShowCents && rest === 0) return `$${dollars}`;
  return `$${dollars}.${String(rest).padStart(2, "0")}`;
}

/** mulberry32 — small seeded PRNG, enough for picking amounts. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a, to turn "level:seed" into a PRNG seed. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * The amounts for one round, all different. Passing a `seed` makes them
 * reproducible, which is what the end-to-end tests use; without one they are
 * genuinely random.
 */
export function roundTargets(level: Level, seed?: number): number[] {
  const { min, max, step } = LEVELS[level];
  const random =
    seed === undefined ? Math.random : seededRandom(hash(`${level}:${seed}`));
  const choices = (max - min) / step + 1;
  const targets: number[] = [];
  while (targets.length < ROUND_LENGTH) {
    const amount = min + Math.floor(random() * choices) * step;
    if (!targets.includes(amount)) targets.push(amount);
  }
  return targets;
}

/**
 * `?seed=<number>` fixes the amounts so a round can be replayed exactly.
 * The end-to-end tests rely on it; ordinary play leaves it off.
 */
export function seedFromUrl(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = new URLSearchParams(window.location.search).get("seed");
  if (raw === null) return undefined;
  const seed = Number(raw);
  return Number.isFinite(seed) ? seed : undefined;
}

export function sumCents(items: readonly { cents: number }[]): number {
  return items.reduce((total, item) => total + item.cents, 0);
}
