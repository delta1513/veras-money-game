"use client";

import { HomeIcon } from "./icons";

/** Back to the landing screen. Top-left on every screen, as in the spelling bee. */
export default function HomeButton({ onHome }: { onHome: () => void }) {
  return (
    <button
      type="button"
      data-testid="btn-home"
      aria-label="home"
      onClick={onHome}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm active:translate-y-0.5 roomy:h-18 roomy:w-18"
    >
      <HomeIcon className="h-8 w-8 roomy:h-11 roomy:w-11" />
    </button>
  );
}
