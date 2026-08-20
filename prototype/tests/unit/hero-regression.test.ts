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

/** The catalogue this file was written to protect, before it was extended. */
const ORIGINAL_IDS = [
  HERO,
  "opp-scalp-skinification",
  "opp-single-creator-cooling-challenge",
];

describe("hero journey (locked before the contract-source refactor)", () => {
  it("keeps every stored gate score across the original contracts", () => {
    // Scoped to the three use cases that existed before the catalogue grew. This
    // guards the journeys already captured in screenshots and rehearsal; adding a
    // new case must not require editing it.
    const snapshot = loadFixtureBundle()
      .contracts.filter(({ opportunity }) => ORIGINAL_IDS.includes(opportunity.id))
      .flatMap((contract) =>
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

    // Permission and Preparedness for the hero moved deliberately when contracts
    // started deriving from the same brand inputs the resolver uses. Before the
    // refactor the contract screen showed Rexona 86 / Dove 59 / Axe 72 while the
    // resolver computed 91 / 72 / 63 for the same brands from the same weights —
    // two screens, two answers, and Dove and Axe ranked in opposite orders.
    // Permission does not vary with scope or rights, so only one of those could
    // be right. Preparedness now reflects the stored starting state (national
    // scope, unlicensed match footage) instead of a combination no control could
    // reproduce. Every other number is unchanged.
    expect(snapshot).toEqual([
      "opp-extra-time-sweat-confidence:rexona:68:91:63:63",
      "opp-extra-time-sweat-confidence:dove:68:72:68:68",
      "opp-extra-time-sweat-confidence:axe:68:63:70:63",
      "opp-scalp-skinification:dove-hair:68:78:42:42",
      "opp-scalp-skinification:sunsilk:68:73:38:38",
      "opp-scalp-skinification:tresemme:68:62:36:36",
      "opp-single-creator-cooling-challenge:rexona:0:50:60:0",
      "opp-single-creator-cooling-challenge:dove:0:46:58:0",
      "opp-single-creator-cooling-challenge:axe:0:52:64:0",
    ]);
  });

  it("keeps the recommended route of each original contract", () => {
    const routes = loadFixtureBundle()
      .contracts.filter(({ opportunity }) => ORIGINAL_IDS.includes(opportunity.id))
      .map((contract) => `${contract.opportunity.id}:${contract.recommendedRoute}`);

    // The hero now opens on Watch, which is what national scope plus unlicensed
    // match footage actually earns and what the landing page already claimed.
    // Test is what the resolver grants once scope and rights are fixed.
    //
    // Scalp moved from incubate to watch because incubate was never reachable
    // for it: the ladder returns watch for a remediable mandatory blocker, and
    // incubate additionally needs Proof >= 75 where this signal scores 68. The
    // stored "incubate" was authored by hand and the engine never agreed with it.
    expect(routes).toEqual([
      "opp-extra-time-sweat-confidence:watch",
      "opp-scalp-skinification:watch",
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
    expect(hasFullProofComponents([
      { name: "shared opportunity proof", value: 68, weight: 1, evidenceIds: [] },
    ])).toBe(false);
  });

  it("gives every derived gate the real six components", () => {
    // The whole point of deriving contracts: no gate can be a placeholder any
    // more, because components are produced by the scorer rather than authored.
    for (const contract of loadFixtureBundle().contracts) {
      for (const assessment of contract.brandAssessments) {
        expect(hasFullProofComponents(assessment.proof.components)).toBe(true);
        expect(assessment.permission.components).toHaveLength(6);
        expect(assessment.preparedness.components).toHaveLength(6);
      }
    }
  });
});
