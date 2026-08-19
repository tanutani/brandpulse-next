import { describe, expect, it } from "vitest";

import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";
import { createHeroPortfolioCandidates } from "@/lib/portfolio/hero-portfolio";
import { resolvePortfolio } from "@/lib/portfolio/resolve-owner";

const contract = findOpportunityContract("opp-extra-time-sweat-confidence")!;
const evaluatedAt = loadFixtureBundle().generatedAt;

describe("portfolio assessment", () => {
  it("ranks Rexona highest on permission while exposing Dove safety and Axe conflict", () => {
    const result = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, "four_city", "rights_safe_creator"),
      opportunity: contract.opportunity,
      scope: "four_city",
      assetMode: "rights_safe_creator",
      evaluatedAt,
    });
    const rexona = result.candidates.find(({ brandId }) => brandId === "rexona")!;
    const dove = result.candidates.find(({ brandId }) => brandId === "dove")!;
    const axe = result.candidates.find(({ brandId }) => brandId === "axe")!;

    expect(result.selectedBrandId).toBe("rexona");
    expect(rexona.permission.score).toBeGreaterThan(dove.permission.score);
    expect(dove.permission.components.find(({ name }) => name === "culturalClaimsSafety")?.value).toBe(94);
    expect(axe.portfolioConflicts).toHaveLength(1);
    expect(axe.blockers.map(({ code }) => code)).toContain("PORTFOLIO_CONFLICT_ACTIVE_GAME_NIGHT_TERRITORY");
  });

  it("names permission as the criterion that beat the higher-readiness runner-up", () => {
    // The screen a judge questions: Rexona is recommended at readiness 63 while
    // Dove shows 68. The rule must say why in the payload, not just in the sort.
    const result = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, "national", "unlicensed_match_footage"),
      opportunity: contract.opportunity,
      scope: "national",
      assetMode: "unlicensed_match_footage",
      evaluatedAt,
    });
    const rexona = result.candidates.find(({ brandId }) => brandId === "rexona")!;
    const dove = result.candidates.find(({ brandId }) => brandId === "dove")!;

    expect(result.selectedBrandId).toBe("rexona");
    expect(dove.readiness).toBeGreaterThan(rexona.readiness);
    expect(result.selectionOrder).not.toContain("readiness");
    expect(result.selectionBasis).toMatchObject({
      decidedBy: "permission",
      runnerUpBrandId: "dove",
      winnerValue: String(rexona.permission.score),
      runnerUpValue: String(dove.permission.score),
    });
  });

  it("keeps national unlicensed scope non-actionable with exact remediation", () => {
    const result = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, "national", "unlicensed_match_footage"),
      opportunity: contract.opportunity,
      scope: "national",
      assetMode: "unlicensed_match_footage",
      evaluatedAt,
    });
    const rexona = result.candidates.find(({ brandId }) => brandId === "rexona")!;

    expect(rexona.decision.route).toBe("watch");
    expect(rexona.blockers[0]).toMatchObject({
      code: "RIGHTS_MATCH_FOOTAGE_UNAVAILABLE",
      remediation: expect.stringContaining("creator-led"),
    });
  });

  it("moves Rexona to Test for four in-stock cities and rights-safe content", () => {
    const result = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, "four_city", "rights_safe_creator"),
      opportunity: contract.opportunity,
      scope: "four_city",
      assetMode: "rights_safe_creator",
      evaluatedAt,
    });
    const rexona = result.candidates.find(({ brandId }) => brandId === "rexona")!;

    expect(rexona.preparedness.score).toBeGreaterThanOrEqual(80);
    expect(rexona.readiness).toBe(68);
    expect(rexona.decision.route).toBe("test");
  });
});
