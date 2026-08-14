import { describe, expect, it } from "vitest";

import type { ProofInputs } from "@/lib/contracts";
import { loadFixtureBundle } from "@/lib/fixtures";
import { selectRoute } from "@/lib/routing/select-route";
import { calculateProof } from "@/lib/scoring/proof";

function heroProofInputs(sourceConcentration: number): ProofInputs {
  const hero = loadFixtureBundle().contracts.find(
    ({ opportunity }) => opportunity.id === "opp-extra-time-sweat-confidence",
  );
  if (!hero) throw new Error("Hero fixture missing");

  const proof = hero.brandAssessments[0].proof;
  const values = Object.fromEntries(proof.components.map(({ name, value }) => [name, value]));

  return {
    persistence: values.persistence,
    independentCorroboration: values.independentCorroboration,
    behavioralProgression: values.behavioralProgression,
    diffusion: values.diffusion,
    commercialSignal: values.commercialSignal,
    freshnessQuality: values.freshnessQuality,
    sourceConcentration,
    manipulationRisk: 0,
    evidence: hero.opportunity.evidence,
  } as ProofInputs;
}

describe("static fixture to deterministic route", () => {
  it("validates the hero bundle and routes the focused scope to Test", () => {
    const hero = loadFixtureBundle().contracts[0];
    const proof = calculateProof(heroProofInputs(0));
    const decision = selectRoute({
      opportunity: hero.opportunity,
      proof,
      permission: hero.brandAssessments[0].permission,
      preparedness: hero.brandAssessments[0].preparedness,
      blockers: [],
      evaluatedAt: "2026-08-15T08:30:00.000Z",
    });

    expect(proof.score).toBe(68);
    expect(decision).toMatchObject({ route: "test", readiness: 68, weakestGate: "proof" });
  });

  it("applies the documented source-concentration sensitivity and downgrades to Watch", () => {
    const hero = loadFixtureBundle().contracts[0];
    const proof = calculateProof(heroProofInputs(70));
    const decision = selectRoute({
      opportunity: hero.opportunity,
      proof,
      permission: hero.brandAssessments[0].permission,
      preparedness: hero.brandAssessments[0].preparedness,
      blockers: [],
      evaluatedAt: "2026-08-15T08:30:00.000Z",
    });

    expect(proof).toMatchObject({ baseScore: 68, score: 54 });
    expect(decision.route).toBe("watch");
  });
});
