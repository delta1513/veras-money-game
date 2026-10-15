<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# About this project

Vera's Money is a money game for one person: Vera. She plays a cashier and gives the right money from a till. It is a static Next.js site. It has no server and no API calls.

## Who Vera is

Vera is a stroke survivor. She was born in the 1960s. She did not grow up with technology, so her knowledge of it is limited. She is the main user of every system in this project.

Vera has these limits:

- She cannot use her right hand. She uses one hand only.
- She cannot read written text, except simple single words. She can connect one word to one object or one action.
- She cannot understand a sentence.
- She cannot speak, except a few simple, practiced words and sounds.
- She cannot say some letters of the alphabet. She can say most of them.

Vera depends on visual cues. She uses them to remember a flow in a user interface. She also uses them to understand a situation and to connect a word to an object or action.

Vera can do these things:

- She can copy text with the QWERTY keyboard on her phone, if the text is on the screen. If the screen shows "Banana", she can type "Banana".
- She can follow a complex flow after someone teaches her. For example, she learned to touch and hold text to start text-to-speech on her Apple phone.
- She knows some apps after instruction: messages, phone, contacts, Facebook, and WhatsApp.

## Rules for every change

Vera cannot understand text. Therefore, think about her limits before you add or change any feature. For example, do not add an alert pop-up, because she cannot read it. Use buttons with images or emojis that show the action.

You must obey these rules:

- Do not add sentences, instructions, labels, or error messages to the UI.
- Do not use `alert`, `confirm`, `prompt`, or a text dialog.
- Show each action with an emoji, an icon, a picture, or a color.
- Keep each flow short, and keep it the same every time. Vera learns a flow by memory.
- Make each touch target large.
- Make sure that one hand can reach every control on a phone.
- Do not require speech, and do not require a gesture that needs two hands.
- Do not require a complex gesture, such as a pinch or a drag, unless Vera can learn it.
- If a word appears, it must be a single simple word that has a picture next to it.
- Show what happened with a clear visual result, for example a trophy or a sad face.
- Do not remove or rename a control that Vera already knows, unless there is a strong reason.
- Do not assume that Vera knows a common web pattern. Menus, swipes, and hidden controls can confuse her.
- If a new feature needs text to work, change the design. Do not add the text.

Before you finish, ask this question: "Can Vera use this feature with one hand, without reading?" If the answer is no, change the feature.

## How the game works

The player is a cashier. The screen shows an amount on a receipt. The player taps coins and notes in the till. Each tap sends one piece of money to the tray. The tray shows its total. The player presses the green tick to pay.

- If the tray total is the same as the amount, the game shows confetti, a happy face, and the amount. Then the next amount comes.
- If the tray total is different, the tray shakes and a sad face shows. All the money flies back to the till. The amount stays the same. There are no lives and no fail screen.
- A tap on a piece of money in the tray sends that piece back to the till.
- After five amounts, the game shows a trophy, a restart button, and a home button.
- Five stars at the top show the progress.

The game has three levels. The landing screen shows each level as a colour, a picture of money, and one, two, or three stars.

| Level | Button | Amounts | Steps |
| --- | --- | --- | --- |
| 1 | Green, one $1 coin, 1 star | $1.00 to $10.00 | 5c |
| 2 | Yellow, one $10 note, 2 stars | $10 to $100 | $1 |
| 3 | Orange, a stack of $100 notes, 3 stars | $100 to $1000 | $5 |

Free play is the blue button with the trolley. It has the same till and tray, but no amount and no tick. The total is very large, so Vera can take a screenshot and show it to someone. The red bin button empties the tray.

The till always has the same layout. Do not move the pieces:

```
 5c  10c  20c  50c  $1  $2
 [ $5 ]  [ $10 ]  [ $20 ]
 [ tick or bin ]  [ $50 ]  [ $100 ]
```

The tick (or the bin) is at the bottom left, because Vera uses her left thumb. The home button is at the top left on every screen.

The code keeps all money as whole cents (integers). Do not use dollar fractions in calculations.

Add `?seed=<number>` to the URL to fix the amounts. The tests use it.

The coins and notes are inline SVG in `components/Money.tsx`. Do not use photos of real money. The note colours follow the Reserve Bank notes: $5 pink, $10 blue, $20 red, $50 yellow, $100 green. The 50c coin has 12 sides. The $2 coin is smaller than the $1 coin.

## Project layout

- `app/`: Next.js entry files (`page.tsx`, `layout.tsx`, `globals.css`, `icon.svg`).
- `components/`: UI parts.
  - `Landing.tsx`: the level buttons and the free play button.
  - `Game.tsx`: one round of a level. `FreePlay.tsx`: free play.
  - `Till.tsx`: the cash drawer and the action button slot.
  - `Tray.tsx`: the tray and its piles of money.
  - `useTray.ts`: the tray state and the flight animations. `FlyLayer.tsx` draws the money that flies back to the till.
  - `Money.tsx`: the coin and note drawings.
  - `SuccessOverlay.tsx`, `RoundComplete.tsx`, `Overlay.tsx`, `Confetti.tsx`: the result screens.
  - `icons.tsx`: the icons.
- `lib/money.ts`: the denominations, the level settings, the amount picker, and the money format.
- `lib/types.ts`: shared types.
- `e2e/game.spec.ts`: Playwright tests.
- `playwright.config.ts`: runs the tests on a Pixel 7 screen.

## Commands

- `npm run dev`: start the dev server at `http://localhost:3000`.
- `npm run build`: make the static site in `out/`.
- `npm run lint`: run ESLint.
- `npm run test:e2e`: build, serve `out/` on port 3100, and run the Playwright tests.
- `npm run preview`: build, then serve `out/` with `wrangler dev`.
- Do not deploy by hand. Cloudflare builds and deploys the site each time a push reaches `main`.

# Agent guide for the stack

This part is written in Simplified Technical English. Each sentence has one meaning.

## Stack

| Part | Choice |
| --- | --- |
| Framework | Next.js 16 with the App Router |
| Language | TypeScript |
| Output | Static export (`output: "export"`) to the `out/` folder |
| Host | A Cloudflare Worker that serves static assets |
| Deploy tool | Wrangler (`wrangler.jsonc`) |
| Package manager | npm |

The Next.js version in this repository is new. It has breaking changes. Your training data can be wrong. Before you write code, read the guide in `node_modules/next/dist/docs/`. Run `npm install` first if that folder does not exist.

## What the static export can and cannot do

The static export runs Next.js at build time only. The result is HTML, CSS, and JavaScript files. No server runs after the build.

These features work:

- Server Components. They run during `npm run build`.
- Client Components (`'use client'`).
- Client-side navigation with `next/link`.
- Client-side data fetching in the browser.
- Dynamic routes that have `generateStaticParams()`.
- Route Handlers that have `export const dynamic = 'force-static'` and use only `GET`.
- CSS, CSS Modules, and Tailwind CSS.
- `next/image` with `images.unoptimized: true`. This is the current setting.
- Browser APIs such as `window` and `localStorage`, inside `useEffect` only.

These features do not work. The build fails, or the feature does nothing:

- Server Actions.
- Cookies and request headers.
- Route Handlers that read the request.
- Dynamic routes without `generateStaticParams()`.
- `rewrites`, `redirects`, and `headers` in `next.config.ts`.
- Proxy (middleware).
- Incremental Static Regeneration and Draft Mode.
- Image optimization with the default image loader.

If the user needs a feature from the second list, stop. This project cannot do it. See "If the app needs a server".

To store data between visits, use `localStorage` in a Client Component. To load data, use a public API from the browser. You can also load data at build time in a Server Component.

## Rules for code changes

- Keep `output: "export"` in `next.config.ts`. Keep `images: { unoptimized: true }` too.
- Put static files, such as images and fonts, in a `public/` folder at the repository root. Create the folder if it does not exist. Next.js copies these files to `out/`. Refer to them with a path that starts with `/`.
- Add a page with a new folder in `app/`. The folder contains a `page.tsx` file. The folder name is the URL path.
- Add a `not-found.tsx` file in `app/` to change the 404 page. Cloudflare serves `404.html` for unknown URLs.
- Use `next/link` for links between pages. Cloudflare serves `/about` and `/about/` correctly. The `html_handling` setting in `wrangler.jsonc` controls this.
- Use a Client Component when the code needs state, effects, event handlers, or browser APIs.
- Do not use Node.js APIs in code that runs in the browser.
- Do not add a database, an API server, or secret keys. A static site cannot keep a secret.
- To use Tailwind CSS, install `tailwindcss` and `@tailwindcss/postcss`. Create `postcss.config.mjs` with the `@tailwindcss/postcss` plugin. Add `@import "tailwindcss";` to `app/globals.css`.
- Keep `wrangler.jsonc` valid. Keep `assets.directory` set to `./out`. Keep `not_found_handling` set to `404-page`.
- Update `compatibility_date` in `wrangler.jsonc` only if a Cloudflare feature needs a newer date.
- Do not use `next start`. It does not work with a static export.
- Add a new dependency only if the user needs it. Run `npm install <package>`. Commit the changed `package-lock.json`.

## If the app needs a server

This project serves static files only. Some apps need server code. Some apps need a database or a third-party service.

If an app needs server code, do not add it to this project. Tell the user that this project does not support it. For a dynamic app that uses no third-party services, the user can use a Worker together with a Cloudflare container. For an app that uses a database or storage, the user can use Cloudflare bindings.

Cloudflare documentation exists in markdown form. Add `index.md` to the end of any documentation URL. For example, read `https://developers.cloudflare.com/workers/index.md`. This uses fewer tokens than the HTML page.

## Checks before you push

Do these checks in order. Fix each problem before you go to the next check.

1. Run `npm run lint`. It must pass.
2. Run `npm run build`. It must pass, and `out/index.html` must exist.
3. Run `npx wrangler deploy --dry-run`. It must show that it read the files from the assets folder.
4. Run `git status`. Make sure that no `out/`, `node_modules/`, `.env`, or `.wrangler/` files are staged.

Optional: run `npm run preview` and open the local address. This shows the site in the Workers runtime. If you cannot open a browser, skip this step.

## Git rules

- Push directly to `main`. This is a hobby project. No pull request is necessary. The user can tell you to use a branch or a pull request instead.
- Never force-push. Never rewrite history. Never use `git push --force` or `git reset --hard` on shared history.
- Keep the git history. Add new commits.
- Write clear commit messages.
- If a push is rejected, run `git pull --no-rebase` and push again. If you cannot resolve a conflict, ask the user.
- Do not commit secrets.

After you push, Cloudflare builds the site. You cannot see the Cloudflare build from here. Tell the user to check the build in the Cloudflare dashboard.

## What the user must do in Cloudflare

You cannot do these steps. The user does them one time. Tell the user about them if the site does not deploy.

### Connect Cloudflare to GitHub (one time for each account)

1. Log in to the Cloudflare dashboard.
2. Go to Workers & Pages.
3. Start to create an application. Choose the GitHub option.
4. Follow the prompts. Install the Cloudflare app in GitHub.
5. Give the app access to the repository. The user can choose all repositories or only selected repositories.

### Create the Worker (one time for each project)

1. Make sure that the GitHub repository exists.
2. In the Cloudflare dashboard, go to Workers & Pages.
3. Click Create application.
4. Choose GitHub.
5. Select the repository. Follow the prompts.
6. Make sure that the Worker name is the same as `name` in `wrangler.jsonc`.
7. Leave the build command and the deploy command as the defaults, unless the user has a reason to change them. The repository files already set the build.
8. Save and deploy.

### Make the site public

1. Open the Worker in the Cloudflare dashboard.
2. Go to Settings, then Domains & Routes.
3. Enable the `workers.dev` domain.
4. Open the `workers.dev` address. The site is now public.

The user can add a custom domain in the same place.

### After the setup

Each push to `main` starts a new build and deploy. The build log is in the Worker, under Deployments or Builds. If the build fails, read the log. Fix the error in the code. Push again.

## Common problems

| Problem | Cause and fix |
| --- | --- |
| The Cloudflare build fails with a name error | The Worker name in Cloudflare is different from `name` in `wrangler.jsonc`. Make the two names the same. |
| The Cloudflare build cannot find a package | `package-lock.json` is not committed, or it is out of date. Run `npm install` and commit the file. |
| `npm run build` fails on a server feature | The code uses a feature from the second list in "What the static export can and cannot do". Remove it. |
| A dynamic route fails in the build | Add `generateStaticParams()` to the route. |
| `window is not defined` | Code that uses `window` runs on the server. Move it into `useEffect` in a Client Component. |
| The site shows the 404 page for a valid URL | Check that `out/` contains the page. Check `html_handling` in `wrangler.jsonc`. |
| An image does not load | Put the file in `public/`. Use a path that starts with `/`. |
| The site shows old content | Wait for the Cloudflare build to finish. Then reload with the cache cleared. |
