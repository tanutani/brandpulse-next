import { expect, test } from "@playwright/test";

const hero = "opp-extra-time-sweat-confidence";
const deployedBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

test.describe("deployed static prototype", () => {
  test.skip(!deployedBaseUrl, "Set PLAYWRIGHT_BASE_URL to run public deployment checks.");

  test("public landing and direct hero link work in a clean browser", async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Attention is not demand." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Eight proposed connection contracts replace the demo fixtures." })).toBeVisible();
    await expect(page.getByText(/not confirmed HUL API paths/i)).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("deployed-landing.png"), fullPage: true });

    await page.goto(`/opportunities/${hero}`);
    await expect(page.getByRole("heading", { name: "Extra-time sweat confidence" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Guided demo progress" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("deployed-hero.png"), fullPage: true });

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(consoleErrors).toEqual([]);
  });
});
