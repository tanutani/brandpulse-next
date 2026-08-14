import { describe, expect, it } from "vitest";
import type { DecisionBlocker, GateAssessment, ProofInputs, RouteInputs } from "@/lib/contracts";
import { selectRoute } from "@/lib/routing/select-route";
import { calculateBaseProof, calculateNormalizedPenalty, calculateProof } from "@/lib/scoring/proof";

const proofInputs: ProofInputs = {
  persistence: 70,
  independentCorroboration: 75,
  behavioralProgression: 60,
  diffusion: 70,
  commercialSignal: 55,
  freshnessQuality: 80,
  sourceConcentration: 0,
  manipulationRisk: 0,
  evidence: [{
    id: "public-search",
    stance: "support",
    claim: "Search interest persisted.",
    evidenceType: "public",
    freshness: "recent",
    sourceUrl: "https://example.com/search",
  }],
};

const gate = (name: GateAssessment["gate"], score: number): GateAssessment => ({
  gate: name, score, components: [], blockers: [], rulesetVersion: "p3-1.0.0",
});
const inputs = (overrides: Partial<RouteInputs> = {}): RouteInputs => ({
  opportunity: { signalClass: "live_moment", usefulUntil: "2026-08-17T12:00:00.000Z" },
  proof: gate("proof", 75),
  permission: gate("permission", 80),
  preparedness: gate("preparedness", 80),
  blockers: [],
  evaluatedAt: "2026-08-15T12:00:00.000Z",
  ...overrides,
});

describe("Proof scoring", () => {
  it("rounds frozen hero components to 68 before penalty", () => {
    expect(calculateBaseProof(proofInputs)).toBe(68);
    expect(calculateProof(proofInputs)).toMatchObject({ baseScore: 68, score: 68 });
  });
  it("scales normalized risk by its cap", () => {
    expect(calculateNormalizedPenalty(70, 20)).toBe(14);
    expect(calculateProof({ ...proofInputs, sourceConcentration: 70 }).score).toBe(54);
  });
  it("caps out-of-range risks", () => {
    const result = calculateProof({ ...proofInputs, sourceConcentration: 150, manipulationRisk: 100 });
    expect(result.score).toBe(23);
    expect(result.penalties.map(({ points }) => points)).toEqual([20, 25]);
  });
});

describe("non-compensating routing", () => {
  it("acts at exact thresholds and uses weakest-link readiness", () => {
    expect(selectRoute(inputs())).toMatchObject({ route: "act_now", readiness: 75, weakestGate: "proof" });
  });
  it("does not average away failed permission", () => {
    expect(selectRoute(inputs({
      proof: gate("proof", 100), permission: gate("permission", 39), preparedness: gate("preparedness", 100),
    }))).toMatchObject({ route: "ignore", readiness: 39, weakestGate: "permission" });
  });
  it("routes exact Test and Watch boundaries", () => {
    expect(selectRoute(inputs({
      proof: gate("proof", 55), permission: gate("permission", 70), preparedness: gate("preparedness", 55),
    })).route).toBe("test");
    expect(selectRoute(inputs({ proof: gate("proof", 34) })).route).toBe("ignore");
    expect(selectRoute(inputs({ proof: gate("proof", 35) })).route).toBe("watch");
  });
  it("incubates a durable trend without current capability", () => {
    expect(selectRoute(inputs({
      opportunity: { signalClass: "durable_trend", usefulUntil: "2026-10-15T12:00:00.000Z" },
      proof: gate("proof", 80), permission: gate("permission", 85), preparedness: gate("preparedness", 54),
    })).route).toBe("incubate");
  });
  it("routes an unresolved remediable mandatory blocker to Watch", () => {
    const blocker: DecisionBlocker = {
      code: "UNCURED_SAFETY_BLOCK", severity: "mandatory", message: "Safety failed.", remediation: "Remove claim.",
    };
    expect(selectRoute(inputs({ blockers: [blocker] }))).toMatchObject({
      route: "watch", reasonCodes: ["REMEDIABLE_BLOCKER_REQUIRES_REMEDIATION", "UNCURED_SAFETY_BLOCK"],
    });
  });
  it("routes a non-remediable mandatory failure to Ignore", () => {
    const blocker: DecisionBlocker = {
      code: "MANIPULATION_FAILURE", severity: "mandatory", message: "Manipulation confirmed.", remediation: null,
    };
    expect(selectRoute(inputs({ blockers: [blocker] }))).toMatchObject({
      route: "ignore", reasonCodes: ["MANDATORY_BLOCKER", "MANIPULATION_FAILURE"],
    });
  });
  it("rejects expiry deterministically", () => {
    expect(selectRoute(inputs({ opportunity: {
      signalClass: "live_moment", usefulUntil: "2026-08-15T11:59:59.000Z",
    } }))).toMatchObject({ route: "ignore", reasonCodes: ["WINDOW_EXPIRED"] });
  });
});
