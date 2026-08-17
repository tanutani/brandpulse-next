import { describe, expect, it } from "vitest";

import {
  BRANDPULSE_STORAGE_KEYS,
  GUIDE_STEPS,
  PULSE_STATIONS,
  getPulsePosition,
  resetBrandPulseStorage,
  type JourneyProgress,
} from "@/lib/demo/journey";

const FRESH: JourneyProgress = {
  scopeAndRightsResolved: false,
  sprintLocked: false,
  outcomeRevealed: false,
};

/** Minimal Storage stand-in so the reset boundary can be tested without a browser. */
function fakeStorage(seed: Record<string, string>): Storage & { snapshot: () => Record<string, string> } {
  const map = new Map(Object.entries(seed));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => void map.delete(key),
    setItem: (key: string, value: string) => void map.set(key, value),
    snapshot: () => Object.fromEntries(map),
  };
}

describe("Reset Demo storage boundary", () => {
  it("removes every BrandPulse key and nothing else", () => {
    const storage = fakeStorage({
      "brandpulse-next:contracts:1.0.0": "{}",
      "brandpulse-next:journey:1.0.0": "{}",
      "brandpulse-next:guide:1.0.0": "{}",
      "unrelated-app:setting": "keep-me",
      "another.tool/token": "also-keep",
    });

    resetBrandPulseStorage(storage);

    expect(storage.snapshot()).toEqual({
      "unrelated-app:setting": "keep-me",
      "another.tool/token": "also-keep",
    });
  });

  it("owns exactly the three versioned keys the product writes", () => {
    expect([...BRANDPULSE_STORAGE_KEYS]).toEqual([
      "brandpulse-next:contracts:1.0.0",
      "brandpulse-next:journey:1.0.0",
      "brandpulse-next:guide:1.0.0",
    ]);
  });
});

describe("Decision Pulse position", () => {
  it("shows no rail on the cover", () => {
    expect(getPulsePosition("/", FRESH)).toBeNull();
  });

  it("advances one station per screen", () => {
    expect(getPulsePosition("/opportunities", FRESH)).toEqual({ activeIndex: 0, completedCount: 0 });
    expect(getPulsePosition("/opportunities/opp-x", FRESH)).toEqual({ activeIndex: 1, completedCount: 1 });
    expect(getPulsePosition("/resolver/opp-x", FRESH)).toEqual({ activeIndex: 3, completedCount: 3 });
    expect(getPulsePosition("/sprint/opp-x", FRESH)).toEqual({ activeIndex: 4, completedCount: 4 });
    expect(getPulsePosition("/review/opp-x", FRESH)).toEqual({ activeIndex: 5, completedCount: 5 });
  });

  it("completes a station once its work is actually done", () => {
    expect(getPulsePosition("/resolver/opp-x", { ...FRESH, scopeAndRightsResolved: true }))
      .toEqual({ activeIndex: 3, completedCount: 4 });
    expect(getPulsePosition("/sprint/opp-x", { ...FRESH, sprintLocked: true }))
      .toEqual({ activeIndex: 4, completedCount: 5 });
    expect(getPulsePosition("/review/opp-x", { ...FRESH, outcomeRevealed: true }))
      .toEqual({ activeIndex: 5, completedCount: PULSE_STATIONS.length });
  });

  it("never reports a station outside the rail", () => {
    const paths = ["/opportunities", "/opportunities/x", "/resolver/x", "/sprint/x", "/review/x"];
    const progress = { scopeAndRightsResolved: true, sprintLocked: true, outcomeRevealed: true };
    for (const path of paths) {
      const position = getPulsePosition(path, progress)!;
      expect(position.activeIndex).toBeLessThan(PULSE_STATIONS.length);
      expect(position.completedCount).toBeLessThanOrEqual(PULSE_STATIONS.length);
    }
  });
});

describe("guided conversation steps", () => {
  it("covers the eleven-step journey in order with unique anchors", () => {
    expect(GUIDE_STEPS).toHaveLength(11);
    expect(GUIDE_STEPS.map((step) => step.id)).toEqual([
      "replay-signal",
      "run-ai-analysis",
      "open-hero",
      "scope-four-city",
      "asset-creator",
      "lock-sprint",
      "rights-check",
      "variant-corrected",
      "approve",
      "reveal-result",
      "ledger",
    ]);
    expect(new Set(GUIDE_STEPS.map((step) => step.id)).size).toBe(GUIDE_STEPS.length);
  });

  it("only gives an acknowledgement to steps with nothing to click", () => {
    const acknowledged = GUIDE_STEPS.filter((step) => step.acknowledge).map((step) => step.id);
    expect(acknowledged).toEqual(["rights-check", "ledger"]);
  });

  it("keeps every message short enough for a bubble", () => {
    for (const step of GUIDE_STEPS) {
      expect(step.message.length).toBeLessThanOrEqual(160);
      expect(step.href.startsWith("/")).toBe(true);
    }
  });
});
