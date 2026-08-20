import { describe, expect, it } from "vitest";

import type { ProofInputs } from "@/lib/contracts";
import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";
import { createPortfolioCandidates } from "@/lib/portfolio/hero-portfolio";
import { resolvePortfolio } from "@/lib/portfolio/resolve-owner";
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
    // The stored contract now opens on the unresolved starting position, so the
    // focused scope has to be resolved here rather than read off the fixture.
    const hero = findOpportunityContract("opp-extra-time-sweat-confidence")!;
    const resolution = resolvePortfolio({
      candidates: createPortfolioCandidates(hero, "four_city", "rights_safe_creator"),
      opportunity: hero.opportunity,
      scope: "four_city",
      assetMode: "rights_safe_creator",
      evaluatedAt: "2026-08-15T08:30:00.000Z",
    });
    const rexona = resolution.candidates.find(({ brandId }) => brandId === "rexona")!;

    expect(rexona.proof.score).toBe(68);
    expect(rexona.decision).toMatchObject({ route: "test", readiness: 68, weakestGate: "proof" });
  });

  it("opens on Watch before scope and rights are resolved", () => {
    const hero = findOpportunityContract("opp-extra-time-sweat-confidence")!;

    expect(hero.recommendedRoute).toBe("watch");
    expect(hero.routeReasonCodes).toContain("RIGHTS_MATCH_FOOTAGE_UNAVAILABLE");
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
