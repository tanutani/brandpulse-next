import { describe, expect, it } from "vitest";

import type { JourneyState, OutcomeEvaluation } from "@/lib/contracts";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";
import type { StorageLike } from "@/lib/persistence/local-contract-store";

class MemoryStorage implements StorageLike {
  private readonly records = new Map<string, string>();
  getItem(key: string) { return this.records.get(key) ?? null; }
  setItem(key: string, value: string) { this.records.set(key, value); }
  removeItem(key: string) { this.records.delete(key); }
}

describe("ledger refresh", () => {
  it("retains a synthetic Scale outcome in versioned browser state", () => {
    const outcome: OutcomeEvaluation = {
      id: "result-hero-sprint-later", sprintId: "sprint-extra-time-four-city",
      observedAt: "2026-08-22T18:00:00.000Z", primaryMetric: "incremental q-commerce conversion",
      treatmentRate: 0.071, comparisonRate: 0.059, incrementalEffect: 0.012,
      confidenceInterval: { lower: 0.003, upper: 0.021 }, serviceLevelGuardrail: 0.95,
      synthetic: true, decision: "scale", reasonCodes: ["PRIMARY_METRIC_ABOVE_LOCKED_SCALE_THRESHOLD"],
    };
    const state = {
      storageVersion: "2.0.0", kind: "test", contractId: "contract-extra-time-sweat-confidence", contractVersion: 3,
      scope: "four_city", assetMode: "rights_safe_creator", selectedBrandId: "rexona",
      sprint: null, activationPlan: null, selectedVariantId: "variant-creator-rights-safe", decisions: [], outcome,
    } satisfies JourneyState;
    const storage = new MemoryStorage();
    new LocalJourneyStore(storage).save(state);
    expect(new LocalJourneyStore(storage).load()?.outcome).toEqual(outcome);
  });
});
