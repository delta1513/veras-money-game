"use client";

import Confetti from "./Confetti";
import Overlay from "./Overlay";
import { HappyFaceIcon, StarIcon } from "./icons";

/**
 * The reward for paying the right amount. It needs no button: after a moment
 * the game moves on by itself, so the flow stays tap-money, tap-tick, repeat.
 */
export default function SuccessOverlay({ amount }: { amount: string }) {
  return (
    <Overlay testId="overlay-success" tint="rgba(53, 177, 74, 0.94)">
      <Confetti />
      <div className="animate-pop flex items-center gap-2">
        <StarIcon className="h-14 w-14 -rotate-12 roomy:h-20 roomy:w-20" />
        <HappyFaceIcon className="h-36 w-36 roomy:h-48 roomy:w-48" />
        <StarIcon className="h-14 w-14 rotate-12 roomy:h-20 roomy:w-20" />
      </div>
      <p className="animate-pop text-6xl font-black tabular-nums text-white drop-shadow roomy:text-8xl">
        {amount}
      </p>
    </Overlay>
  );
}
