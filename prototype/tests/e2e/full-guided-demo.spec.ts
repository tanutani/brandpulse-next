import { expect, test, type Page } from "@playwright/test";

const hero = "opp-extra-time-sweat-confidence";

/** Drives the deterministic journey from the Pulse Room to a revealed outcome. */
async function runJourney(page: Page) {
  await page.goto(`/resolver/${hero}`);
  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await page.getByRole("link", { name: /Design the bounded test/i }).click();
  await page.getByRole("button", { name: /Lock sprint rules/i }).click();
  await page.getByRole("link", { name: /Review activation package/i }).click();
  await page.getByRole("button", { name: /Creator-led pressure moment/i }).click();
  await page.getByRole("button", { name: /Approve corrected variant/i }).click();
  await page.getByRole("button", { name: /Reveal synthetic result/i }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("cover leads to the Pulse Room and a persisted Learning Ledger without a key", async ({ page }) => {
  await page.reload();
  await expect(page.getByRole("heading", { name: "Attention is not demand." })).toBeVisible();
  await expect(page.getByText(/Not an official HUL product/i).first()).toBeVisible();

  // The cover is short: the primary action needs no scrolling.
  await expect(page.getByRole("link", { name: /Start Rexona guided demo/i })).toBeInViewport();
  await page.getByRole("link", { name: /Start Rexona guided demo/i }).click();

  await expect(page.getByRole("heading", { name: "Pulse Room" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Decision journey" })).toBeVisible();

  await page.getByRole("link", { name: /Extra-time sweat confidence/i }).click();
  await expect(page.getByRole("heading", { name: "Extra-time sweat confidence" })).toBeVisible();

  await runJourney(page);

  await expect(page.getByRole("heading", { name: /decision remembers/i })).toBeVisible();
  await expect(page.getByText(/1.2pp lift · SCALE/i)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/1.2pp lift · SCALE/i)).toBeVisible();
  await expect(page.getByText(/Prevented an unsafe national activation/i)).toBeVisible();
});

test("the synthetic replay is labelled, ordered and resettable", async ({ page }) => {
  await page.goto("/opportunities");
  const feed = page.getByRole("list").filter({ hasText: "Extra-time attention" }).first();
  await expect(page.getByText("Simulated live replay")).toBeVisible();
  await expect(page.getByText(/fixed order, no live feed/i)).toBeVisible();

  // All seven signals are present before replay.
  await expect(feed.getByRole("listitem")).toHaveCount(7);

  await page.getByRole("button", { name: /Replay signal/i }).click();
  // Replay resets the board, then refills it in a fixed order.
  await expect(feed.getByRole("listitem")).toHaveCount(1, { timeout: 2_000 });
  await expect(feed.getByRole("listitem")).toHaveCount(7, { timeout: 8_000 });
  await expect(feed.getByRole("listitem").first()).toContainText("Extra-time attention");
  await expect(feed.getByRole("listitem").last()).toContainText("Match footage unavailable");
});

test("AI analysis reports its mode and stays evidence-grounded", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: /Run AI analysis/i }).click();

  // With no key configured this must land on the checked-in fallback.
  await expect(page.getByText("Precomputed fallback")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Counter-hypothesis" })).toBeVisible();
  await expect(page.getByText("sig-hero-commerce", { exact: false }).first()).toBeVisible();
});

test("mocked live Gemini mode is labelled as live", async ({ page }) => {
  await page.route("**/api/synthesize", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        mode: "live",
        model: "gemini-3.5-flash-lite",
        promptVersion: "synthesis-1.0.0",
        generatedAt: "2026-08-15T12:00:00.000Z",
        summary: "Mocked live synthesis grounded in approved evidence.",
        themes: [{ label: "Independent attention", evidenceIds: ["sig-hero-search"] }],
        counterHypothesis: {
          claim: "Seasonal heat may explain the movement.",
          evidenceIds: ["sig-hero-commerce"],
        },
        missingEvidence: ["Matched-cell incremental conversion result"],
      }),
    });
  });

  await page.goto("/opportunities");
  await page.getByRole("button", { name: /Run AI analysis/i }).click();
  await expect(page.getByText("Live Gemini")).toBeVisible();
  await expect(page.getByText("Mocked live synthesis grounded in approved evidence.")).toBeVisible();

  // The deterministic route is unchanged by a live model answer.
  await page.getByRole("link", { name: /Extra-time sweat confidence/i }).click();
  await expect(page.getByText("Readiness = min(68, 91, 63) = 63", { exact: true })).toBeVisible();
});

test("a failing synthesis endpoint never blocks the journey", async ({ page }) => {
  await page.route("**/api/synthesize", (route) => route.abort());
  await page.goto("/opportunities");
  await page.getByRole("button", { name: /Run AI analysis/i }).click();
  await expect(page.getByText(/Synthesis is unavailable right now/i)).toBeVisible();

  await runJourney(page);
  await expect(page.getByText(/1.2pp lift · SCALE/i)).toBeVisible();
});

test("national match footage stays blocked and four cities plus creator content produce Test", async ({ page }) => {
  await page.goto(`/resolver/${hero}`);
  await expect(page.getByText("Action constrained")).toBeVisible();
  await expect(page.getByText("RIGHTS_MATCH_FOOTAGE_UNAVAILABLE", { exact: true })).toBeVisible();
  await expect(page.getByText("Resolve stock and rights to continue")).toBeVisible();

  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await expect(page.getByText("Bounded test ready")).toBeVisible();
  await expect(page.getByRole("link", { name: /Design the bounded test/i })).toBeVisible();
});

test("RIGHTS-001 cannot be bypassed and results stay locked", async ({ page }) => {
  await page.goto(`/resolver/${hero}`);
  await page.getByRole("button", { name: "Four in-stock cities" }).click();
  await page.getByRole("button", { name: "Rights-safe creator" }).click();
  await page.goto(`/sprint/${hero}`);
  await page.getByRole("button", { name: /Lock sprint rules/i }).click();
  await page.goto(`/review/${hero}`);

  await expect(page.getByText("RIGHTS-001")).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve corrected variant/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Reveal synthetic result/i })).toBeDisabled();

  await page.getByRole("button", { name: /Creator-led pressure moment/i }).click();
  await expect(page.getByRole("button", { name: /Approve corrected variant/i })).toBeEnabled();
  // The result stays hidden until a current-version approval exists.
  await expect(page.getByRole("button", { name: /Reveal synthetic result/i })).toBeDisabled();
});

test("the review screen refuses to start before the sprint is locked", async ({ page }) => {
  await page.goto(`/review/${hero}`);
  await expect(page.getByRole("heading", { name: "Lock the bounded test first" })).toBeVisible();
});

test("Surf ACT requires restored rights, policy checks and human approval", async ({ page }) => {
  const surf = "opp-surf-first-monsoon";
  await page.goto(`/resolver/${surf}`);
  await expect(page.getByText(/Act now — growth activation/i)).toBeVisible();

  await page.getByRole("button", { name: "Remove rights clearance" }).click();
  await expect(page.getByText(/Watch — gather evidence/i)).toBeVisible();
  await expect(page.getByText("RIGHTS_CREATOR_PACKAGE_UNAVAILABLE", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Restore prepared package" }).click();
  await page.getByRole("link", { name: /Review the activation/i }).click();
  await expect(page.getByRole("button", { name: /Approve corrected variant/i })).toBeDisabled();

  await page.getByRole("button", { name: /Cleared creator muddy-play story/i }).click();
  await page.getByRole("button", { name: /Approve corrected variant/i }).click();
  await page.getByRole("button", { name: /Reveal monitored result/i }).click();
  await expect(page.getByText(/Descriptive only — no treatment\/control/i)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/Descriptive only — no treatment\/control/i)).toBeVisible();
  await page.goto(`/resolver/${hero}`);
  await expect(page.getByText("Action constrained")).toBeVisible();
});
