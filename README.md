# Vera's Money

A picture-led money game. The screen shows an amount on a receipt; the player
is the cashier and taps Australian coins and notes out of a till into a tray
until the tray holds exactly that amount, then presses the big green tick.

It is built for one player, Vera, who uses only her left hand and cannot read
sentences. There is no text to read in the UI beyond the numbers: every control
is a picture, an icon or a colour, touch targets are large, and the pay button
sits bottom-left under the left thumb. See `AGENTS.md` for the full rules.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
npm run lint
npm run test:e2e   # builds, serves out/ on :3100, runs the Playwright suite
```

`npm run build` produces a fully static site in `out/`. There is no server and
no runtime API call. Cloudflare Workers builds and deploys it on every push to
`main` (Worker name: `veras-money-game`).

## How the game works

| Level | Landing button | Amounts |
| --- | --- | --- |
| 1 | green, one $1 coin, ★ | $1.00 – $10.00 in 5c steps |
| 2 | yellow, one $10 note, ★★ | $10 – $100, whole dollars |
| 3 | orange, a stack of $100 notes, ★★★ | $100 – $1000 in $5 steps |

- A round is five amounts; five stars at the top show progress, and a trophy
  ends the round with replay and home buttons.
- Tapping a coin or note flies it into the tray, where pieces pile up by value
  and the running total shows on the tray's lip. Tapping a piece in the tray
  sends it back.
- The tick is always enabled. Right amount: confetti, a happy face, next
  amount. Wrong amount: the tray shakes, a sad face shows, and everything flies
  back to the till. No lives, no fail state — just try again.
- Free play (the trolley button) has the same till with no target: a giant
  total for screenshotting, a red bin to empty the tray.
- Money is integer cents throughout.
- `?seed=<number>` fixes the amounts; the tests use it.

The coins and notes are drawn as inline SVG (`components/Money.tsx`) in the
Reserve Bank note colours, with the 50c as a dodecagon and coins sized relative
to each other as in real life. Animations are CSS and the Web Animations API,
and are switched off under `prefers-reduced-motion`.
