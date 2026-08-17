import { expect, test } from "@playwright/test";

const hero = "opp-extra-time-sweat-confidence";
const bubble = "[data-testid='guide-bubble']";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("guide messages advance only when the real action succeeds", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "Start guide" }).click();

  const guide = page.locator(bubble);
  await expect(guide).toContainText("Replay the five-second window");
  await expect(guide).toContainText("1/11");

  // Clicking an unrelated control must not advance the tour.
  await page.getByRole("link", { name: /Scalp skinification/i }).click();
  await page.goBack();
  await expect(guide).toContainText("1/11");

  await page.getByRole("button", { name: /Replay signal/i }).click();
  await expect(guide).toContainText("let Gemini group that evidence", { timeout: 10_000 });
  await expect(guide).toContainText("2/11");

  await page.getByRole("button", { name: /Run AI analysis/i }).click();
  await expect(guide).toContainText("Open the Rexona decision");

  await page.getByRole("link", { name: /Extra-time sweat confidence/i }).click();
  await expect(guide).toContainText("Narrow the scope to the four cities");
});

test("guide progress survives navigation and refresh", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "Start guide" }).click();
  await page.getByRole("button", { name: /Replay signal/i }).click();
  await expect(page.locator(bubble)).toContainText("2/11", { timeout: 10_000 });

  await page.goto(`/resolver/${hero}`);
  await expect(page.locator(bubble)).toContainText("2/11");

  await page.reload();
  await expect(page.locator(bubble)).toContainText("2/11");
});

test("a stranded step offers the way back to its screen", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "Start guide" }).click();
  // Step 1 anchors to the Pulse Room, so a direct sprint link has no anchor.
  await page.goto(`/sprint/${hero}`);
  await expect(page.locator(bubble)).toContainText("This step is on the Pulse Room");
  await page.getByRole("link", { name: /Go to Pulse Room/i }).click();
  await expect(page.getByRole("heading", { name: "Pulse Room" })).toBeVisible();
});

test("skip, resume and restart behave distinctly", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "Start guide" }).click();
  await page.getByRole("button", { name: /Replay signal/i }).click();
  await expect(page.locator(bubble)).toContainText("2/11", { timeout: 10_000 });

  await page.getByRole("button", { name: "Skip tour" }).click();
  await expect(page.locator(bubble)).toHaveCount(0);

  // Resume returns to where the tour stopped, not to the beginning.
  await page.getByRole("button", { name: "Resume guide" }).click();
  await expect(page.locator(bubble)).toContainText("2/11");

  await page.getByRole("button", { name: "Skip guide" }).click();
  await expect(page.locator(bubble)).toHaveCount(0);
});

test("reset clears only BrandPulse keys", async ({ page }) => {
  await page.goto(`/resolver/${hero}`);
  await page.evaluate(() => window.localStorage.setItem("unrelated-app:setting", "keep-me"));
  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await expect(page.getByText("Bounded test ready")).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByRole("heading", { name: "Pulse Room" })).toBeVisible();

  const storage = await page.evaluate(() => ({
    unrelated: window.localStorage.getItem("unrelated-app:setting"),
    brandpulse: Object.keys(window.localStorage).filter((key) => key.startsWith("brandpulse-next:")),
  }));
  expect(storage.unrelated).toBe("keep-me");
  expect(storage.brandpulse).toEqual([]);

  // The journey really did reset.
  await page.goto(`/resolver/${hero}`);
  await expect(page.getByText("Action constrained")).toBeVisible();
});

test("presentation mode hides chrome, keeps the pulse and offers an exit", async ({ page }) => {
  await page.goto(`/resolver/${hero}`);
  await page.getByRole("button", { name: "Present" }).click();

  await expect(page.locator(".topbar")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Decision journey" })).toBeVisible();
  // The quiet disclosure strip survives even though the top bar is hidden.
  await expect(page.getByRole("note")).toContainText(/Unofficial Techtonic Season 8 concept/i);

  await page.getByRole("button", { name: /Exit presentation/i }).click();
  await expect(page.locator(".topbar")).toBeVisible();
});

test("the guide reaches the Learning Ledger and finishes", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "Start guide" }).click();
  await page.getByRole("button", { name: /Replay signal/i }).click();
  await expect(page.locator(bubble)).toContainText("2/11", { timeout: 10_000 });
  await page.getByRole("button", { name: /Run AI analysis/i }).click();
  await page.getByRole("link", { name: /Extra-time sweat confidence/i }).click();

  await page.goto(`/resolver/${hero}`);
  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await page.getByRole("link", { name: /Design the Causal Sprint/i }).click();
  await page.getByRole("button", { name: /Lock sprint rules/i }).click();
  await page.getByRole("link", { name: /Review activation package/i }).click();

  await expect(page.locator(bubble)).toContainText("RIGHTS-001 has blocked");
  await page.getByRole("button", { name: "Understood" }).click();

  await page.getByRole("button", { name: /Creator-led pressure moment/i }).click();
  await page.getByRole("button", { name: /Approve corrected variant/i }).click();
  await page.getByRole("button", { name: /Reveal synthetic result/i }).click();

  await expect(page.locator(bubble)).toContainText("Learning Ledger keeps the whole chain");
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page.locator(bubble)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Restart guide" })).toBeVisible();
});
