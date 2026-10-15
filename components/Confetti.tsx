"use client";

const COLOURS = ["#ffc83d", "#ff6b6b", "#4dabf7", "#ffffff", "#9b5de5", "#f28c28"];
const PIECES = 36;

/**
 * Falling confetti and gold coins. Positions come from the index, not from
 * Math.random, so the burst renders the same on every frame and every run.
 */
export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: PIECES }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const delay = ((i * 53) % 9) * 45;
        const drift = ((i * 29) % 21) - 10;
        const spin = ((i * 71) % 5) - 2;
        const coin = i % 4 === 0;
        const style = {
          left: `${left}%`,
          animationDelay: `${delay}ms`,
          "--drift": `${drift}vw`,
          "--spin": `${spin * 360}deg`,
          background: coin
            ? "radial-gradient(circle at 35% 30%, #fff4b8, #f0c44c 50%, #b9800f)"
            : COLOURS[i % COLOURS.length],
        } as React.CSSProperties;
        return (
          <span
            key={i}
            className={`confetti absolute -top-8 ${coin ? "h-6 w-6 rounded-full border border-[#8a5c08]" : i % 2 ? "h-4 w-2.5 rounded-sm" : "h-3 w-3 rounded-full"}`}
            style={style}
          />
        );
      })}
    </div>
  );
}
