"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LEVELS,
  ROUND_LENGTH,
  formatCents,
  roundTargets,
  seedFromUrl,
} from "@/lib/money";
import type { Level } from "@/lib/types";
import FlyLayer from "./FlyLayer";
import HomeButton from "./HomeButton";
import RoundComplete from "./RoundComplete";
import SuccessOverlay from "./SuccessOverlay";
import Till, { ActionButton } from "./Till";
import Tray from "./Tray";
import { PayIcon, ReceiptIcon, SadFaceIcon, StarIcon } from "./icons";
import { useTray } from "./useTray";

/**
 * playing     — money can go in and out of the tray
 * wrong       — the tray shakes, a sad face shows, then the money goes back
 * celebrating — the right amount was paid; the reward plays, then next amount
 * done        — all five paid: trophy
 */
type Phase = "playing" | "wrong" | "celebrating" | "done";

/** How long the sad face shows before the money flies back to the till. */
const WRONG_RETURN_MS = 450;
/** How long the sad face stays in total. */
const WRONG_MS = 1000;
/** How long the reward shows before the next amount. */
const CELEBRATE_MS = 1300;

export default function Game({
  level,
  onHome,
}: {
  level: Level;
  onHome: () => void;
}) {
  const config = LEVELS[level];
  const [targets, setTargets] = useState(() =>
    roundTargets(level, seedFromUrl()),
  );
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const tray = useTray();
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const later = useCallback((ms: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, ms));
  }, []);

  const target = targets[index];
  const format = (cents: number) => formatCents(cents, config.alwaysShowCents);
  const busy = phase !== "playing";

  const { total, returnAll, reset } = tray;
  const handlePay = useCallback(() => {
    if (phase !== "playing") return;
    if (total === target) {
      setPhase("celebrating");
      later(CELEBRATE_MS, () => {
        reset();
        if (index + 1 >= ROUND_LENGTH) {
          setIndex(ROUND_LENGTH);
          setPhase("done");
        } else {
          setIndex(index + 1);
          setPhase("playing");
        }
      });
      return;
    }
    // Wrong: no penalty, no lives. Shake, a sad face, the money goes back,
    // and the same amount waits to be tried again.
    setPhase("wrong");
    later(WRONG_RETURN_MS, returnAll);
    later(WRONG_MS, () => setPhase("playing"));
  }, [phase, total, target, index, later, returnAll, reset]);

  const handleReplay = useCallback(() => {
    reset();
    setTargets(roundTargets(level, seedFromUrl()));
    setIndex(0);
    setPhase("playing");
  }, [level, reset]);

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col gap-2 overflow-hidden px-3 pt-2 pb-3 roomy:max-w-2xl roomy:gap-4 roomy:px-6 roomy:py-5 landscape:max-w-6xl!">
      <header className="flex shrink-0 items-center justify-between gap-2">
        <HomeButton onHome={onHome} />
        <div
          className="flex gap-1 roomy:gap-2"
          data-testid="progress"
          data-progress={index}
          aria-hidden="true"
        >
          {Array.from({ length: ROUND_LENGTH }, (_, i) => (
            <span
              key={i}
              data-testid={`progress-star-${i}`}
              data-done={i < index ? "true" : "false"}
              className={i === index && phase !== "done" ? "animate-bob" : ""}
            >
              <StarIcon
                full={i < index}
                className={`h-9 w-9 roomy:h-12 roomy:w-12 ${i === index ? "drop-shadow-[0_0_6px_rgba(242,162,12,0.7)]" : ""}`}
              />
            </span>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 roomy:gap-4 landscape:flex-row landscape:gap-6">
        <section className="flex min-h-0 flex-1 flex-col gap-2 roomy:gap-4">
          {/* The bill: what the customer has to be given. */}
          <div
            data-testid="target"
            data-cents={target ?? 0}
            className="flex shrink-0 items-center justify-center gap-3 rounded-3xl bg-white px-4 py-2 shadow-sm roomy:gap-5 roomy:py-4"
          >
            <ReceiptIcon className="h-14 w-14 shrink-0 roomy:h-20 roomy:w-20" />
            <span
              key={index}
              className="animate-pop text-6xl font-black tracking-tight tabular-nums roomy:text-8xl"
            >
              {target !== undefined ? format(target) : ""}
            </span>
          </div>

          <Tray
            items={tray.items}
            launches={tray.launches}
            onRemove={tray.remove}
            locked={busy}
            shake={phase === "wrong"}
            total={
              <span
                data-testid="tray-total"
                data-cents={total}
                className={`text-4xl font-black tabular-nums roomy:text-6xl ${total === 0 ? "opacity-40" : ""}`}
              >
                {format(total)}
              </span>
            }
            overlay={
              phase === "wrong" ? (
                <span data-testid="wrong-face" className="animate-pop">
                  <SadFaceIcon className="h-32 w-32 drop-shadow-lg roomy:h-44 roomy:w-44" />
                </span>
              ) : null
            }
          />
        </section>

        {/* In landscape the till is a left column, as tall as the screen allows. */}
        <div className="shrink-0 landscape:order-first landscape:flex landscape:w-1/2 landscape:max-w-[calc((100dvh-7rem)*1.6)] landscape:flex-col landscape:justify-end">
          <Till
            onPress={tray.add}
            disabled={busy}
            action={
              <ActionButton
                testId="btn-pay"
                label="pay"
                onClick={handlePay}
                icon={<PayIcon className="h-14 w-14 roomy:h-20 roomy:w-20" />}
                className="border-[#23803a] bg-[color:var(--color-go)]"
              />
            }
          />
        </div>
      </div>

      <FlyLayer ghosts={tray.ghosts} onDone={tray.finishGhost} />

      {phase === "celebrating" && <SuccessOverlay amount={format(target)} />}
      {phase === "done" && (
        <RoundComplete onReplay={handleReplay} onHome={onHome} />
      )}
    </main>
  );
}
