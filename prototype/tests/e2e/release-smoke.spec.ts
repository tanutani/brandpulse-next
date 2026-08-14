import { expect, test } from "@playwright/test";

const hero = "opp-extra-time-sweat-confidence";

test("direct links, cleared storage, degraded state, and phone width remain useful", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/opportunities/${hero}`);
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "Extra-time sweat confidence" })).toBeVisible();
  await expect(page.getByText(/Public observations and clearly labeled synthetic/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.goto(`/review/${hero}`);
  await expect(page.getByRole("heading", { name: "Lock the Causal Sprint first" })).toBeVisible();
  await page.goto("/opportunities/not-a-bundled-fixture");
  await expect(page.getByRole("heading", { name: "This bundled contract is unavailable" })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
