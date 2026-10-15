"use client";

import { COINS, NOTES } from "@/lib/money";
import type { Denomination } from "@/lib/types";
import Money from "./Money";

function Slot({
  d,
  onPress,
  disabled,
  className,
}: {
  d: Denomination;
  onPress: (cents: number) => void;
  disabled: boolean;
  className: string;
}) {
  const isNote = d.kind === "note";
  return (
    <button
      type="button"
      data-testid={`till-${d.cents}`}
      aria-label={d.face}
      disabled={disabled}
      onClick={() => onPress(d.cents)}
      className={`till-slot flex items-center justify-center rounded-2xl p-1 active:scale-95 roomy:rounded-3xl roomy:p-2 ${className}`}
    >
      <span
        data-art
        className={`money-shadow block w-full ${isNote ? "aspect-[2/1]" : "aspect-square"}`}
      >
        <Money cents={d.cents} />
      </span>
    </button>
  );
}

/**
 * The cash drawer: every coin and note, always in the same place.
 *
 *   5c  10c  20c  50c  $1  $2
 *   [ $5  ] [ $10 ] [ $20  ]
 *   [action] [ $50 ] [ $100 ]
 *
 * The action slot — pay in a round, empty in free play — is bottom-left,
 * where Vera's left thumb rests.
 */
export default function Till({
  onPress,
  action,
  disabled = false,
}: {
  onPress: (cents: number) => void;
  action: React.ReactNode;
  disabled?: boolean;
}) {
  const [n5, n10, n20, n50, n100] = NOTES;
  return (
    <div
      data-testid="till"
      className="till grid shrink-0 grid-cols-6 gap-1.5 rounded-[1.75rem] p-2 roomy:gap-3 roomy:p-3"
    >
      {COINS.map((d) => (
        <Slot key={d.cents} d={d} onPress={onPress} disabled={disabled} className="col-span-1" />
      ))}
      {[n5, n10, n20].map((d) => (
        <Slot key={d.cents} d={d} onPress={onPress} disabled={disabled} className="col-span-2" />
      ))}
      <div className="col-span-2 flex">{action}</div>
      {[n50, n100].map((d) => (
        <Slot key={d.cents} d={d} onPress={onPress} disabled={disabled} className="col-span-2" />
      ))}
    </div>
  );
}

/** The big square button that sits in the till's action slot. */
export function ActionButton({
  testId,
  label,
  icon,
  onClick,
  disabled,
  className,
}: {
  testId: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center rounded-2xl border-b-[6px] shadow-md active:translate-y-1 active:border-b-2 roomy:rounded-3xl roomy:border-b-8 ${className}`}
    >
      {icon}
    </button>
  );
}
