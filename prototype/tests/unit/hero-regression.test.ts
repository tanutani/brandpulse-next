import { describe, expect, it } from "vitest";

import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";
import { createHeroPortfolioCandidates } from "@/lib/portfolio/hero-portfolio";
import { resolvePortfolio } from "@/lib/portfolio/resolve-owner";
import { hasFullProofComponents } from "@/lib/scoring/proof";

/**
 * The demo journey, pinned.
 *
 * Everything here is currently produced by hand-authored fixture numbers. The
 * contract layer is about to be rebuilt so those numbers are derived from inputs
 * instead, and this file exists to prove the rebuild changed nothing a judge sees.
 * If one of these fails during that refactor, the refactor is wrong — not the test.
 */

const HERO = "opp-extra-time-sweat-confidence";
const evaluatedAt = loadFixtureBundle().generatedAt;

describe("hero journey (locked before the contract-source refactor)", () => {
  it("keeps every stored gate score across every contract and brand", () => {
    const snapshot = loadFixtureBundle().contracts.flatMap((contract) =>
      contract.brandAssessments.map((assessment) =>
        [
          contract.opportunity.id,
          assessment.brandId,
          assessment.proof.score,
          assessment.permission.score,
          assessment.preparedness.score,
          assessment.readiness,
        ].join(":"),
      ),
    );

    expect(snapshot).toEqual([
      "opp-extra-time-sweat-confidence:rexona:68:86:76:68",
      "opp-extra-time-sweat-confidence:dove:68:59:81:59",
      "opp-extra-time-sweat-confidence:axe:68:72:69:68",
      "opp-scalp-skinification:dove-hair:68:78:42:42",
      "opp-scalp-skinification:sunsilk:68:73:38:38",
      "opp-scalp-skinification:tresemme:68:62:36:36",
      "opp-single-creator-cooling-challenge:rexona:0:50:60:0",
      "opp-single-creator-cooling-challenge:dove:0:46:58:0",
      "opp-single-creator-cooling-challenge:axe:0:52:64:0",
    ]);
  });

  it("keeps the recommended route of each contract", () => {
    const routes = loadFixtureBundle().contracts.map(
      (contract) => `${contract.opportunity.id}:${contract.recommendedRoute}`,
    );

    expect(routes).toEqual([
      "opp-extra-time-sweat-confidence:test",
      "opp-scalp-skinification:incubate",
      "opp-single-creator-cooling-challenge:ignore",
    ]);
  });

  it("keeps the national-to-four-city swing that the guided demo depends on", () => {
    const contract = findOpportunityContract(HERO)!;
    const resolve = (
      scope: "national" | "four_city",
      assetMode: "unlicensed_match_footage" | "rights_safe_creator",
    ) =>
      resolvePortfolio({
        candidates: createHeroPortfolioCandidates(contract, scope, assetMode),
        opportunity: contract.opportunity,
        scope,
        assetMode,
        evaluatedAt,
      });

    const constrained = resolve("national", "unlicensed_match_footage");
    const executable = resolve("four_city", "rights_safe_creator");
    const rexonaIn = (result: ReturnType<typeof resolve>) =>
      result.candidates.find(({ brandId }) => brandId === "rexona")!;

    expect(rexonaIn(constrained).readiness).toBe(63);
    expect(rexonaIn(constrained).decision.route).toBe("watch");
    expect(rexonaIn(executable).readiness).toBe(68);
    expect(rexonaIn(executable).decision.route).toBe("test");
  });

  it("keeps Rexona as owner and permission as the deciding criterion", () => {
    const contract = findOpportunityContract(HERO)!;
    const result = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, "national", "unlicensed_match_footage"),
      opportunity: contract.opportunity,
      scope: "national",
      assetMode: "unlicensed_match_footage",
      evaluatedAt,
    });

    expect(result.selectedBrandId).toBe("rexona");
    expect(result.selectionBasis).toMatchObject({
      decidedBy: "permission",
      runnerUpBrandId: "dove",
    });
  });
});

describe("collapsed gate components", () => {
  it("recognises a collapsed placeholder as not re-scorable", () => {
    // 24 of 27 stored gates are a single component repeating the score. The proof
    // sensitivity panel reads named inputs off this array, so it must be able to
    // tell the two shapes apart rather than computing on absent values.
    expect(hasFullProofComponents([
      { name: "shared opportunity proof", value: 68, weight: 1, evidenceIds: [] },
    ])).toBe(false);

    const heroProof = findOpportunityContract(HERO)!.brandAssessments.find(
      ({ brandId }) => brandId === "rexona",
    )!.proof;
    expect(hasFullProofComponents(heroProof.components)).toBe(true);

    const doveProof = findOpportunityContract(HERO)!.brandAssessments.find(
      ({ brandId }) => brandId === "dove",
    )!.proof;
    expect(hasFullProofComponents(doveProof.components)).toBe(false);
  });
});
