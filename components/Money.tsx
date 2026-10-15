import Image from "next/image";
import { denomination } from "@/lib/money";

/**
 * Australian coins and notes, shown with the official images so they look
 * exactly like the money Vera handles. Notes come from the Reserve Bank of
 * Australia and coins from the Royal Australian Mint; see README.md for the
 * sources and the reproduction rules the files are sized to follow.
 */

/** Note box width : height. The note image is contained inside it. */
export const NOTE_RATIO = 2;

/** One coin or note. It fills its box, so the parent sets the size. */
export default function Money({ cents }: { cents: number }) {
  const d = denomination(cents);
  if (d.kind === "note") {
    return (
      <span className="relative block h-full w-full">
        <Image
          src={`/money/note-${cents}.jpg`}
          alt=""
          fill
          sizes="40vw"
          draggable={false}
          className="object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
        />
      </span>
    );
  }
  // Coins keep their real size order (the $2 is smaller than the $1).
  const size = `${(d.scale ?? 1) * 100}%`;
  return (
    <span className="flex h-full w-full items-center justify-center">
      <span className="relative block" style={{ width: size, height: size }}>
        <Image
          src={`/money/coin-${cents}.webp`}
          alt=""
          fill
          sizes="25vw"
          draggable={false}
          className="object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]"
        />
      </span>
    </span>
  );
}
