import { denomination } from "@/lib/money";
import type { Denomination } from "@/lib/types";

/**
 * Australian coins and notes, drawn as inline SVG. They are drawn rather than
 * photographed so they stay crisp at every size, load instantly, and carry no
 * reproduction concerns. Colours follow the Reserve Bank notes, and the value
 * is printed large on every piece so the number does the work.
 *
 * Shared gradients live once in <MoneyDefs />, which the page mounts a single
 * time. Every piece refers to them by id.
 */

/** Note artwork width : height. Real notes are close to 2 : 1. */
export const NOTE_RATIO = 2;

const NOTE_COLOURS: Record<
  number,
  { light: string; dark: string; ink: string }
> = {
  500: { light: "#f4b8da", dark: "#a55a98", ink: "#4d1745" },
  1000: { light: "#8fd0f5", dark: "#2a6db5", ink: "#0c2b55" },
  2000: { light: "#ffa477", dark: "#cc3b26", ink: "#561208" },
  5000: { light: "#ffe27a", dark: "#d79a12", ink: "#553903" },
  10000: { light: "#a6e39b", dark: "#2f8c47", ink: "#0d3a18" },
};

const METAL = {
  silver: { stops: ["#ffffff", "#dfe4ea", "#a3acb7"], rim: "#6f7883", ink: "#363d45" },
  gold: { stops: ["#fff4b8", "#f0c44c", "#b9800f"], rim: "#8a5c08", ink: "#5b3a03" },
} as const;

export function MoneyDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {Object.entries(NOTE_COLOURS).map(([cents, colour]) => (
          <linearGradient
            key={cents}
            id={`mg-note-${cents}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0" stopColor={colour.light} />
            <stop offset="1" stopColor={colour.dark} />
          </linearGradient>
        ))}
        {(["silver", "gold"] as const).map((metal) => (
          <radialGradient
            key={metal}
            id={`mg-${metal}`}
            cx="0.38"
            cy="0.32"
            r="0.75"
          >
            <stop offset="0" stopColor={METAL[metal].stops[0]} />
            <stop offset="0.45" stopColor={METAL[metal].stops[1]} />
            <stop offset="1" stopColor={METAL[metal].stops[2]} />
          </radialGradient>
        ))}
        <linearGradient id="mg-shine" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mg-window" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#d6eefa" stopOpacity="0.75" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Note({ d }: { d: Denomination }) {
  const colour = NOTE_COLOURS[d.cents];
  const digits = d.face.replace("$", "");
  const bigSize = d.face.length > 3 ? 31 : 36;
  return (
    <svg viewBox="0 0 160 80" className="block h-full w-full" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="158"
        height="78"
        rx="8"
        fill={`url(#mg-note-${d.cents})`}
        stroke={colour.dark}
        strokeWidth="1.5"
      />
      {/* Fine wavy lines, the "money" texture. */}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2">
        <path d="M2 58 Q22 48 42 58 T82 58 T122 58 T162 58" />
        <path d="M2 64 Q22 54 42 64 T82 64 T122 64 T162 64" />
        <path d="M2 20 Q22 30 42 20 T82 20 T122 20 T162 20" />
      </g>
      <rect
        x="5.5"
        y="5.5"
        width="149"
        height="69"
        rx="5"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
      />
      {/* The clear polymer window. */}
      <rect
        x="12"
        y="12"
        width="24"
        height="56"
        rx="6"
        fill="url(#mg-window)"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
      <path
        d="m24 30 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z"
        fill={colour.dark}
        fillOpacity="0.45"
      />
      {/* Portrait medallion. */}
      <circle cx="131" cy="42" r="19" fill={colour.ink} fillOpacity="0.1" />
      <circle cx="131" cy="36" r="7" fill={colour.ink} fillOpacity="0.2" />
      <path
        d="M118 57a13 11 0 0 1 26 0Z"
        fill={colour.ink}
        fillOpacity="0.2"
      />
      <text
        x="146"
        y="19"
        textAnchor="end"
        fontSize="12"
        fontWeight="800"
        fill={colour.ink}
        fillOpacity="0.75"
      >
        {digits}
      </text>
      <text
        x="76"
        y="52"
        textAnchor="middle"
        fontSize={bigSize}
        fontWeight="900"
        fill={colour.ink}
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="3"
        paintOrder="stroke"
        letterSpacing="-1"
      >
        {d.face}
      </text>
      <rect x="1" y="1" width="158" height="78" rx="8" fill="url(#mg-shine)" />
    </svg>
  );
}

/** Regular 12-gon with flat top and bottom, centred at (50, 50). */
function dodecagonPoints(radius: number): string {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = ((15 + 30 * i) * Math.PI) / 180;
    return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

function Coin({ d }: { d: Denomination }) {
  const metal = METAL[d.metal ?? "silver"];
  const r = 47 * (d.scale ?? 1);
  const fill = `url(#mg-${d.metal})`;
  const fontSize = r * (d.face.length > 2 ? 0.56 : 0.7);
  const textY = 50 + fontSize * 0.36;
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden="true">
      {d.dodecagon ? (
        <polygon
          points={dodecagonPoints(r / Math.cos(Math.PI / 12))}
          fill={fill}
          stroke={metal.rim}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : (
        <circle cx="50" cy="50" r={r} fill={fill} stroke={metal.rim} strokeWidth="2" />
      )}
      {/* Milled edge. */}
      {!d.dodecagon && (
        <circle
          cx="50"
          cy="50"
          r={r - 3}
          fill="none"
          stroke={metal.rim}
          strokeOpacity="0.35"
          strokeWidth="3"
          pathLength={100}
          strokeDasharray="0.55 0.55"
        />
      )}
      <circle
        cx="50"
        cy="50"
        r={r * 0.76}
        fill="none"
        stroke={metal.rim}
        strokeOpacity="0.3"
        strokeWidth="1.4"
      />
      {/* A light copy under the value reads as an embossed edge. */}
      <text
        x="50.8"
        y={textY + 0.9}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="900"
        fill="#ffffff"
        fillOpacity="0.7"
        letterSpacing="-0.5"
      >
        {d.face}
      </text>
      <text
        x="50"
        y={textY}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="900"
        fill={metal.ink}
        letterSpacing="-0.5"
      >
        {d.face}
      </text>
      <ellipse
        cx={50 - r * 0.36}
        cy={50 - r * 0.42}
        rx={r * 0.36}
        ry={r * 0.17}
        transform={`rotate(-32 ${50 - r * 0.36} ${50 - r * 0.42})`}
        fill="#ffffff"
        fillOpacity="0.55"
      />
    </svg>
  );
}

/** One coin or note. It fills its box, so the parent sets the size. */
export default function Money({ cents }: { cents: number }) {
  const d = denomination(cents);
  return d.kind === "note" ? <Note d={d} /> : <Coin d={d} />;
}
