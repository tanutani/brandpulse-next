import { expect, test } from "@playwright/test";

const hero = "opp-extra-time-sweat-confidence";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("golden path reaches a persisted Learning Ledger without a key", async ({ page }) => {
  await page.goto(`/opportunities/${hero}`);
  await expect(page.getByRole("heading", { name: "Extra-time sweat confidence" })).toBeVisible();
  await page.getByRole("link", { name: /Resolve portfolio ownership/i }).click();
  await expect(page.getByText("Action constrained")).toBeVisible();
  await expect(page.getByText(/original creator-led content/i)).toBeVisible();
  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await expect(page.getByText("Bounded test ready")).toBeVisible();
  await expect(page.getByText("Test", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Design the causal sprint/i }).click();
  await expect(page.getByText("₹5,00,000")).toBeVisible();
  await page.getByRole("button", { name: "Lock sprint rules" }).click();
  await expect(page.getByText(/Metric, window, cells, budget, and thresholds are immutable/i)).toBeVisible();
  await page.getByRole("link", { name: /Review activation package/i }).click();
  await expect(page.getByText("RIGHTS-001")).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve corrected variant/i })).toBeDisabled();
  await page.getByRole("button", { name: /Creator-led pressure moment/i }).click();
  await expect(page.getByRole("button", { name: /Approve corrected variant/i })).toBeEnabled();
  await page.getByRole("button", { name: /Approve corrected variant/i }).click();
  await page.getByRole("button", { name: /Reveal synthetic result/i }).click();
  await expect(page.getByRole("heading", { name: /decision remembers/i })).toBeVisible();
  await expect(page.getByText(/1.2pp lift · SCALE/i)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/1.2pp lift · SCALE/i)).toBeVisible();
});

test("guarded path cannot approve or reveal the blocked asset", async ({ page }) => {
  await page.goto(`/resolver/${hero}`);
  await expect(page.getByText("Action constrained")).toBeVisible();
  await expect(page.getByText("Watch", { exact: true })).toBeVisible();
  await expect(page.getByText("Resolve stock and rights to continue")).toBeVisible();
  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await page.getByRole("link", { name: /Design the causal sprint/i }).click();
  await page.getByRole("button", { name: "Lock sprint rules" }).click();
  await page.getByRole("link", { name: /Review activation package/i }).click();
  await expect(page.getByText("RIGHTS-001")).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve corrected variant/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Reveal synthetic result/i })).toBeDisabled();
});
