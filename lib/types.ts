export type Level = 1 | 2 | 3;

/** What the landing screen starts: one of the levels, or free play. */
export type Mode = { kind: "level"; level: Level } | { kind: "free" };

export type Metal = "silver" | "gold";

export interface Denomination {
  /** Value in whole cents. Every sum in the app is done in integer cents. */
  cents: number;
  kind: "coin" | "note";
  /** Coins only. */
  metal?: Metal;
  /** Coins only: true for the twelve-sided 50c. */
  dodecagon?: boolean;
  /**
   * Coins only: drawn size relative to the 50c (the largest), so the coins
   * keep their real-life size order. The $2 is smaller than the $1.
   */
  scale?: number;
  /** Text printed on the money itself. */
  face: string;
}

export interface LevelConfig {
  /** Smallest target, in cents. */
  min: number;
  /** Largest target, in cents. */
  max: number;
  /** Every target is a multiple of this, in cents. */
  step: number;
  /** Level 1 always prints cents ("$7.00"); the note levels drop ".00". */
  alwaysShowCents: boolean;
}

/** One piece of money sitting in the tray. */
export interface TrayItem {
  id: number;
  cents: number;
}
