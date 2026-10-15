"use client";

import { LEVEL_ORDER } from "@/lib/money";
import type { Level, Mode } from "@/lib/types";
import Money from "./Money";
import { CartIcon, StarIcon } from "./icons";

/**
 * Each level button shows the money it is about — one coin, one note, a stack
 * of notes — plus one, two or three stars. Colour and picture carry it; there
 * is nothing to read.
 */
const LEVEL_STYLES: Record<Level, string> = {
  1: "bg-[#5ec46f] border-[#3f9c50]",
  2: "bg-[#ffc83d] border-[#d9a11e]",
  3: "bg-[#f28c28] border-[#c96f14]",
};

function LevelArt({ level }: { level: Level }) {
  if (level === 1) {
    return (
      <span className="money-shadow block h-16 w-16 roomy:h-24 roomy:w-24">
        <Money cents={100} />
      </span>
    );
  }
  if (level === 2) {
    return (
      <span className="money-shadow block h-14 w-28 -rotate-3 roomy:h-20 roomy:w-40">
        <Money cents={1000} />
      </span>
    );
  }
  return (
    <span className="relative block h-16 w-32 roomy:h-24 roomy:w-48">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="money-shadow absolute block h-12 w-24 roomy:h-18 roomy:w-36"
          style={{
            left: `${i * 10}%`,
            top: `${i * 9}%`,
            transform: `rotate(${(i - 1) * 6}deg)`,
          }}
        >
          <Money cents={10000} />
        </span>
      ))}
    </span>
  );
}

function HeroArt() {
  // A little spread of change on the counter.
  const pieces: { cents: number; className: string }[] = [
    { cents: 5000, className: "left-[2%] top-[18%] h-16 w-32 -rotate-12" },
    { cents: 2000, className: "left-[22%] top-[4%] h-16 w-32 rotate-3" },
    { cents: 1000, className: "left-[42%] top-[20%] h-16 w-32 rotate-12" },
    { cents: 200, className: "left-[10%] top-[58%] h-14 w-14" },
    { cents: 100, className: "left-[30%] top-[55%] h-16 w-16" },
    { cents: 50, className: "left-[52%] top-[56%] h-16 w-16" },
    { cents: 20, className: "left-[72%] top-[52%] h-14 w-14" },
  ];
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <div className="relative h-36 w-72 shrink-0 scale-110 roomy:h-48 roomy:w-96 roomy:scale-150">
      {pieces.map((piece) => (
        <span
          key={piece.cents}
          className={`money-shadow absolute block ${piece.className}`}
        >
          <Money cents={piece.cents} />
        </span>
      ))}
      </div>
    </div>
  );
}

export default function Landing({
  onStart,
}: {
  onStart: (mode: Mode) => void;
}) {
  return (
    <main
      data-testid="landing"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-3 px-4 py-5 roomy:max-w-2xl roomy:gap-6 roomy:py-10"
    >
      <h1 className="text-center text-4xl font-black tracking-tight roomy:text-6xl">
        Vera&apos;s Money
      </h1>

      <HeroArt />

      {/* Buttons sit at the bottom, under the left thumb. */}
      <div className="flex w-full flex-col gap-3 roomy:gap-5">
        {LEVEL_ORDER.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onStart({ kind: "level", level })}
            data-testid={`level-${level}`}
            aria-label={`level ${level}`}
            className={`flex min-h-24 items-center justify-between rounded-3xl border-b-8 px-5 shadow-md active:translate-y-1 active:border-b-4 roomy:min-h-32 roomy:px-10 ${LEVEL_STYLES[level]}`}
          >
            <span className="flex gap-1">
              {Array.from({ length: level }, (_, i) => (
                <StarIcon key={i} white className="h-11 w-11 roomy:h-16 roomy:w-16" />
              ))}
            </span>
            <LevelArt level={level} />
          </button>
        ))}

        <button
          type="button"
          onClick={() => onStart({ kind: "free" })}
          data-testid="btn-freeplay"
          aria-label="free play"
          className="flex min-h-24 items-center justify-center gap-4 rounded-3xl border-b-8 border-[#2b7bbf] bg-[#4dabf7] px-5 shadow-md active:translate-y-1 active:border-b-4 roomy:min-h-32"
        >
          <CartIcon className="h-16 w-16 roomy:h-24 roomy:w-24" />
        </button>
      </div>
    </main>
  );
}
