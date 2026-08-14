import { describe, expect, it } from "vitest";
import { clusterOpportunity } from "@/lib/evidence/cluster-opportunity";
import {
  calculateSourceConcentrationRisk,
  evaluateEvidence,
  evaluateFreshness,
  independentSourceFamilies,
} from "@/lib/evidence/evaluate-evidence";

const evaluatedAt = "2026-08-15T12:00:00.000Z";

describe("evidence helpers", () => {
  it("clusters normalized topics and preserves records", () => {
    const records = [
      { id: "b", topic: " Cooling  Deodorant! " },
      { id: "a", topic: "cooling-deodorant" },
      { id: "c", topic: "Skin care" },
    ];
    const clusters = clusterOpportunity(records);
    expect(clusters.map(({ topic }) => topic)).toEqual(["cooling deodorant", "skin care"]);
    expect(clusters[0].evidenceIds).toEqual(["a", "b"]);
    expect(clusters[0].records.map(({ id }) => id)).toEqual(["a", "b"]);
  });
  it("uses deterministic freshness boundaries", () => {
    expect(evaluateFreshness("2026-08-14T12:00:00.000Z", evaluatedAt)).toBe("live");
    expect(evaluateFreshness("2026-08-08T12:00:00.000Z", evaluatedAt)).toBe("recent");
    expect(evaluateFreshness("2026-07-16T12:00:00.000Z", evaluatedAt)).toBe("aging");
    expect(evaluateFreshness("2026-07-15T11:59:59.000Z", evaluatedAt)).toBe("stale");
  });
  it("counts source families rather than posts and excludes inference", () => {
    const evidence = [
      { evidenceType: "public" as const, independentSourceFamily: "Search" },
      { evidenceType: "public" as const, independentSourceFamily: "search" },
      { evidenceType: "synthetic_internal" as const, independentSourceFamily: "Commerce" },
      { evidenceType: "model_inference" as const, independentSourceFamily: "LLM" },
    ];
    expect(independentSourceFamilies(evidence)).toEqual(["commerce", "search"]);
    expect(calculateSourceConcentrationRisk(evidence)).toBe(67);
  });
  it("selects the strongest support and counter-evidence", () => {
    const result = evaluateEvidence([
      {
        id: "support", stance: "support", claim: "Commerce is rising.",
        evidenceType: "synthetic_internal", freshness: "stale",
        observedAt: "2026-08-14T12:00:00.000Z", independentSourceFamily: "commerce", quality: 80,
      },
      {
        id: "counter-low", stance: "contradict", claim: "Offtake is flat.",
        evidenceType: "synthetic_internal", freshness: "stale",
        observedAt: "2026-08-10T12:00:00.000Z", independentSourceFamily: "offtake", quality: 70,
      },
      {
        id: "counter-high", stance: "contradict", claim: "Repeat is declining.",
        evidenceType: "synthetic_internal", freshness: "stale",
        observedAt: "2026-08-14T12:00:00.000Z", independentSourceFamily: "repeat", quality: 90,
      },
    ], evaluatedAt);
    expect(result.strongestSupport?.id).toBe("support");
    expect(result.strongestCounterEvidence?.id).toBe("counter-high");
    expect(result.items.every(({ freshness }) => freshness !== "stale")).toBe(true);
  });
});
