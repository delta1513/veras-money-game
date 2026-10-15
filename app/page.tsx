"use client";

import { useState } from "react";
import FreePlay from "@/components/FreePlay";
import Game from "@/components/Game";
import Landing from "@/components/Landing";
import type { Mode } from "@/lib/types";

export default function Home() {
  const [mode, setMode] = useState<Mode | null>(null);
  const goHome = () => setMode(null);

  return (
    <>
      {mode === null && <Landing onStart={setMode} />}
      {/* Keying on the level resets all game state when a new round starts. */}
      {mode?.kind === "level" && (
        <Game key={mode.level} level={mode.level} onHome={goHome} />
      )}
      {mode?.kind === "free" && <FreePlay onHome={goHome} />}
    </>
  );
}
