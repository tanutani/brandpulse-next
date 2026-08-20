import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { loadFixtureBundle } from "@/lib/fixtures";

/**
 * Keeps the committed JSON honest.
 *
 * The app no longer reads this file — contracts are derived from the authored
 * inputs in lib/fixtures/source. It is kept as a reviewable artifact so a data
 * change shows up as a readable diff rather than only as changed TypeScript.
 *
 * Because nothing loads it, a stale copy would be invisible, which is the exact
 * failure this whole refactor removed. So it is asserted rather than trusted.
 *
 * Regenerate after an intentional change:
 *   BRANDPULSE_WRITE_FIXTURE=1 npx vitest run tests/unit/contract-drift.test.ts
 */

const FIXTURE_PATH = join(process.cwd(), "public", "data", "opportunity-contracts.json");

describe("committed contract fixture", () => {
  it("matches the contracts derived from source", () => {
    const derived = `${JSON.stringify(loadFixtureBundle(), null, 2)}\n`;

    if (process.env.BRANDPULSE_WRITE_FIXTURE === "1") {
      writeFileSync(FIXTURE_PATH, derived, "utf8");
    }

    expect(readFileSync(FIXTURE_PATH, "utf8").replaceAll("\r\n", "\n")).toBe(derived);
  });
});
