"use client";

import { formatCents } from "@/lib/money";
import FlyLayer from "./FlyLayer";
import HomeButton from "./HomeButton";
import Till, { ActionButton } from "./Till";
import Tray from "./Tray";
import { CartIcon, TrashIcon } from "./icons";
import { useTray } from "./useTray";

/**
 * The same till with no amount to hit. Money goes in, the total is shown as
 * big as the screen allows — big enough to screenshot and show someone — and
 * the bin in the action slot empties the tray.
 */
export default function FreePlay({ onHome }: { onHome: () => void }) {
  const tray = useTray();

  return (
    <main
      data-testid="free-play"
      className="mx-auto flex h-dvh w-full max-w-md flex-col gap-2 overflow-hidden px-3 pt-2 pb-3 roomy:max-w-2xl roomy:gap-4 roomy:px-6 roomy:py-5 landscape:max-w-6xl!"
    >
      <header className="flex shrink-0 items-center justify-between gap-2">
        <HomeButton onHome={onHome} />
        <CartIcon className="h-11 w-11 opacity-80 roomy:h-14 roomy:w-14" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 roomy:gap-4 landscape:flex-row landscape:gap-6">
        <section className="flex min-h-0 flex-1 flex-col gap-2 roomy:gap-4">
          <div className="flex shrink-0 items-center justify-center rounded-3xl bg-white px-4 py-1 shadow-sm roomy:py-3">
            <span
              data-testid="tray-total"
              data-cents={tray.total}
              className={`text-7xl font-black tracking-tight tabular-nums roomy:text-9xl ${tray.total === 0 ? "opacity-30" : ""}`}
            >
              {formatCents(tray.total)}
            </span>
          </div>

          <Tray
            items={tray.items}
            launches={tray.launches}
            onRemove={tray.remove}
          />
        </section>

        {/* In landscape the till is a left column, as tall as the screen allows. */}
        <div className="shrink-0 landscape:order-first landscape:flex landscape:w-1/2 landscape:max-w-[calc((100dvh-7rem)*1.6)] landscape:flex-col landscape:justify-end">
          <Till
            onPress={tray.add}
            action={
              <ActionButton
                testId="btn-clear"
                label="empty"
                onClick={tray.returnAll}
                icon={<TrashIcon className="h-14 w-14 roomy:h-20 roomy:w-20" />}
                className="border-[#a83232] bg-[color:var(--color-stop)]"
              />
            }
          />
        </div>
      </div>

      <FlyLayer ghosts={tray.ghosts} onDone={tray.finishGhost} />
    </main>
  );
}
