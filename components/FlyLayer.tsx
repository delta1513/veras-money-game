"use client";

import { useLayoutEffect, useRef } from "react";
import Money from "./Money";
import type { Ghost } from "./useTray";

function GhostPiece({
  ghost,
  onDone,
}: {
  ghost: Ghost;
  onDone: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const { from, to } = ghost;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const scale = to.w / from.w;
    const animation = element.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 30}px) scale(${(1 + scale) / 2}) rotate(-6deg)`,
          opacity: 1,
          offset: 0.5,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          opacity: 0.35,
        },
      ],
      {
        duration: 420,
        delay: ghost.delay,
        easing: "cubic-bezier(0.4, 0, 0.3, 1)",
        fill: "both",
      },
    );
    animation.onfinish = () => onDone(ghost.id);
    return () => animation.cancel();
  }, [ghost, onDone]);

  return (
    <div
      ref={ref}
      className="money-shadow fixed left-0 top-0 origin-top-left"
      style={{
        left: ghost.from.x,
        top: ghost.from.y,
        width: ghost.from.w,
        height: ghost.from.h,
      }}
    >
      <Money cents={ghost.cents} />
    </div>
  );
}

/** Money in flight back to the till. Never catches a tap. */
export default function FlyLayer({
  ghosts,
  onDone,
}: {
  ghosts: Ghost[];
  onDone: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden="true">
      {ghosts.map((ghost) => (
        <GhostPiece key={ghost.id} ghost={ghost} onDone={onDone} />
      ))}
    </div>
  );
}
