// Visual QA helper: builds, serves, and captures the judged screens at desktop and phone width.
// Usage: node scripts/capture-screens.mjs <output-directory>
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";

const nextCli = "node_modules/next/dist/bin/next";
const outDir = path.resolve(process.argv[2] ?? "docs/screenshots/current");
const hero = "opp-extra-time-sweat-confidence";

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

/** Each entry drives the app to a screen, then captures a full-page image. */
const SCREENS = [
  { name: "01-cover", path: "/" },
  { name: "02-pulse-room", path: "/opportunities" },
  { name: "03-opportunity", path: `/opportunities/${hero}` },
  { name: "04-resolver", path: `/resolver/${hero}`, drive: "resolver" },
  { name: "05-sprint", path: `/sprint/${hero}`, drive: "sprint" },
  { name: "06-review", path: `/review/${hero}`, drive: "review" },
];

function run(commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, commandArgs, { stdio: "inherit", env: process.env });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

/** Replays the deterministic journey so downstream screens have the state they gate on. */
async function drive(page, base, stage) {
  if (stage === "resolver" || stage === "sprint" || stage === "review") {
    await page.goto(`${base}/resolver/${hero}`);
    await page.getByRole("button", { name: "Four in-stock cities" }).click();
    await page.getByRole("button", { name: "Rights-safe creator" }).click();
  }
  if (stage === "sprint" || stage === "review") {
    await page.goto(`${base}/sprint/${hero}`);
    await page.getByRole("button", { name: "Lock sprint rules" }).click();
  }
  if (stage === "review") {
    await page.goto(`${base}/review/${hero}`);
    await page.getByRole("button", { name: /Creator-led pressure moment/i }).click();
    await page.getByRole("button", { name: /Approve corrected variant/i }).click();
    await page.getByRole("button", { name: /Reveal synthetic result/i }).click();
  }
}

const buildCode = await run([nextCli, "build"]);
if (buildCode !== 0) process.exit(buildCode);

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1"], {
  stdio: ["ignore", "inherit", "inherit"],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});

let exitCode = 1;
try {
  const base = "http://127.0.0.1:3000";
  await waitForServer(base);
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  for (const [label, viewport] of [["desktop", DESKTOP], ["phone", PHONE]]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    for (const screen of SCREENS) {
      await page.goto(`${base}/`);
      await page.evaluate(() => window.localStorage.clear());
      if (screen.drive) await drive(page, base, screen.drive);
      await page.goto(`${base}${screen.path}`);
      await page.waitForLoadState("networkidle");
      const file = path.join(outDir, `${screen.name}-${label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`captured ${file}`);
    }
    // The guided message is a bottom sheet at phone width, so capture it there.
    if (label === "phone") {
      await page.goto(`${base}/`);
      await page.evaluate(() => window.localStorage.clear());
      await page.goto(`${base}/opportunities`);
      await page.getByRole("button", { name: "Start guide" }).click();
      await page.waitForSelector("[data-testid='guide-bubble']");
      const file = path.join(outDir, "07-guided-sheet-phone.png");
      await page.screenshot({ path: file });
      console.log(`captured ${file}`);
    }

    await context.close();
  }
  await browser.close();
  exitCode = 0;
} finally {
  server.kill();
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
}

process.exit(exitCode);
