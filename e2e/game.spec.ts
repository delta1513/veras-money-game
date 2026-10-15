import { expect, test, type Page } from "@playwright/test";
import { LEVELS, ROUND_LENGTH } from "../lib/money";
import type { Level } from "../lib/types";

/** Every denomination in cents, largest first, for greedy change-making. */
const LARGEST_FIRST = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5];

/**
 * Amounts are random in normal play, so the tests pin them with `?seed=`.
 * Everything else still reads the amount off the page.
 */
async function start(page: Page, level: Level, seed = 1) {
  await page.goto(`/?seed=${seed}`);
  await page.getByTestId(`level-${level}`).click();
  await expect(page.getByTestId("target")).toBeVisible();
}

async function targetCents(page: Page): Promise<number> {
  return Number(await page.getByTestId("target").getAttribute("data-cents"));
}

/** Tap the till greedily until the tray holds exactly `cents`. */
async function pay(page: Page, cents: number) {
  let rest = cents;
  for (const value of LARGEST_FIRST) {
    while (rest >= value) {
      await page.getByTestId(`till-${value}`).click();
      rest -= value;
    }
  }
  await expect(page.getByTestId("tray-total")).toHaveAttribute(
    "data-cents",
    String(cents),
  );
}

/** Pay the amount on screen correctly and wait for the next one. */
async function payCorrectly(page: Page) {
  const before = Number(
    await page.getByTestId("progress").getAttribute("data-progress"),
  );
  await pay(page, await targetCents(page));
  await page.getByTestId("btn-pay").click();
  await expect(page.getByTestId("overlay-success")).toBeVisible();
  await expect(page.getByTestId("progress")).toHaveAttribute(
    "data-progress",
    String(before + 1),
  );
}

test("landing shows three levels and free play", async ({ page }) => {
  await page.goto("/?seed=1");
  for (const level of [1, 2, 3]) {
    await expect(page.getByTestId(`level-${level}`)).toBeVisible();
  }
  await expect(page.getByTestId("btn-freeplay")).toBeVisible();
});

test("every till item, the tray and the pay button fit on a phone screen", async ({
  page,
}) => {
  await start(page, 1);
  const viewport = page.viewportSize()!;
  const ids = [
    ...LARGEST_FIRST.map((cents) => `till-${cents}`),
    "btn-pay",
    "btn-home",
    "target",
    "tray",
    "tray-total",
  ];
  for (const id of ids) {
    const box = (await page.getByTestId(id).boundingBox())!;
    expect(box.x, id).toBeGreaterThanOrEqual(0);
    expect(box.y, id).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, id).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height, id).toBeLessThanOrEqual(viewport.height);
  }

  // Pay sits in the bottom-left quarter, under the left thumb.
  const payBox = (await page.getByTestId("btn-pay").boundingBox())!;
  expect(payBox.x + payBox.width / 2).toBeLessThan(viewport.width / 2);
  expect(payBox.y + payBox.height / 2).toBeGreaterThan(viewport.height * 0.75);

  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - window.innerWidth,
    y: document.documentElement.scrollHeight - window.innerHeight,
  }));
  expect(overflow).toEqual({ x: 0, y: 0 });
});

test("level 1: paying the right amount advances progress", async ({ page }) => {
  await start(page, 1);
  const target = await targetCents(page);
  expect(target).toBeGreaterThanOrEqual(LEVELS[1].min);
  expect(target).toBeLessThanOrEqual(LEVELS[1].max);
  expect(target % LEVELS[1].step).toBe(0);
  await expect(page.getByTestId("progress")).toHaveAttribute(
    "data-progress",
    "0",
  );

  await payCorrectly(page);

  await expect(page.getByTestId("overlay-success")).toBeHidden();
  await expect(page.getByTestId("progress-star-0")).toHaveAttribute(
    "data-done",
    "true",
  );
  // A fresh amount, and an empty tray to pay it from.
  expect(await targetCents(page)).not.toBe(target);
  await expect(page.getByTestId("tray")).toHaveAttribute("data-count", "0");
});

test("a wrong payment empties the tray and keeps the same amount", async ({
  page,
}) => {
  await start(page, 1);
  const target = await targetCents(page);

  await pay(page, target);
  await page.getByTestId("till-5").click(); // 5c too much
  await expect(page.getByTestId("tray-total")).toHaveAttribute(
    "data-cents",
    String(target + 5),
  );

  await page.getByTestId("btn-pay").click();
  await expect(page.getByTestId("wrong-face")).toBeVisible();
  await expect(page.getByTestId("overlay-success")).toBeHidden();

  await expect(page.getByTestId("tray")).toHaveAttribute("data-count", "0");
  await expect(page.getByTestId("tray-total")).toHaveAttribute(
    "data-cents",
    "0",
  );
  await expect(page.getByTestId("wrong-face")).toBeHidden();
  expect(await targetCents(page)).toBe(target);
  await expect(page.getByTestId("progress")).toHaveAttribute(
    "data-progress",
    "0",
  );

  // And she can simply try again.
  await payCorrectly(page);
});

test("an empty tray counts as a wrong payment", async ({ page }) => {
  await start(page, 2);
  await page.getByTestId("btn-pay").click();
  await expect(page.getByTestId("wrong-face")).toBeVisible();
  await expect(page.getByTestId("progress")).toHaveAttribute(
    "data-progress",
    "0",
  );
});

test("tapping a tray item sends it back to the till", async ({ page }) => {
  await start(page, 1);
  await page.getByTestId("till-200").click();
  await page.getByTestId("till-50").click();
  await page.getByTestId("till-50").click();
  await expect(page.getByTestId("tray-total")).toHaveAttribute(
    "data-cents",
    "300",
  );

  await page.locator('[data-testid="tray-item"][data-cents="200"]').click();
  await expect(page.getByTestId("tray-total")).toHaveAttribute(
    "data-cents",
    "100",
  );
  await expect(page.getByTestId("tray-item")).toHaveCount(2);
  await expect(
    page.locator('[data-testid="tray-item"][data-cents="200"]'),
  ).toHaveCount(0);
});

test("paying all five amounts shows the trophy, and replay starts over", async ({
  page,
}) => {
  await start(page, 1);
  for (let i = 0; i < ROUND_LENGTH; i++) {
    await payCorrectly(page);
  }
  await expect(page.getByTestId("overlay-round-complete")).toBeVisible();

  await page.getByTestId("btn-replay").click();
  await expect(page.getByTestId("overlay-round-complete")).toBeHidden();
  await expect(page.getByTestId("progress")).toHaveAttribute(
    "data-progress",
    "0",
  );
});

test("trophy home button returns to the landing screen", async ({ page }) => {
  await start(page, 2);
  for (let i = 0; i < ROUND_LENGTH; i++) {
    await payCorrectly(page);
  }
  await page.getByTestId("btn-home-overlay").click();
  await expect(page.getByTestId("landing")).toBeVisible();
});

for (const level of [2, 3] as const) {
  test(`level ${level} amounts stay in range`, async ({ page }) => {
    const { min, max, step } = LEVELS[level];
    for (const seed of [1, 2, 3]) {
      await start(page, level, seed);
      for (let i = 0; i < 2; i++) {
        const target = await targetCents(page);
        expect(target).toBeGreaterThanOrEqual(min);
        expect(target).toBeLessThanOrEqual(max);
        expect(target % step).toBe(0);
        await payCorrectly(page);
      }
    }
  });
}

test("the same seed gives the same amounts", async ({ page }) => {
  await start(page, 3, 7);
  const first = await targetCents(page);
  await start(page, 3, 7);
  expect(await targetCents(page)).toBe(first);
});

test("free play sums the tray, and the bin empties it", async ({ page }) => {
  await page.goto("/?seed=1");
  await page.getByTestId("btn-freeplay").click();
  await expect(page.getByTestId("free-play")).toBeVisible();
  await expect(page.getByTestId("btn-pay")).toHaveCount(0);
  await expect(page.getByTestId("target")).toHaveCount(0);

  for (const cents of [10000, 2000, 200, 50, 20, 10, 5, 5]) {
    await page.getByTestId(`till-${cents}`).click();
  }
  const total = page.getByTestId("tray-total");
  await expect(total).toHaveAttribute("data-cents", "12290");
  await expect(total).toHaveText("$122.90");

  await page.locator('[data-testid="tray-item"][data-cents="10000"]').click();
  await expect(total).toHaveAttribute("data-cents", "2290");

  await page.getByTestId("btn-clear").click();
  await expect(total).toHaveAttribute("data-cents", "0");
  await expect(page.getByTestId("tray-item")).toHaveCount(0);
});

test("home returns to the landing screen from a round and from free play", async ({
  page,
}) => {
  await start(page, 1);
  await page.getByTestId("btn-home").click();
  await expect(page.getByTestId("landing")).toBeVisible();

  await page.getByTestId("btn-freeplay").click();
  await page.getByTestId("btn-home").click();
  await expect(page.getByTestId("landing")).toBeVisible();
});
