import { describe, expect, it } from "vitest";

import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";
import { createHeroPortfolioCandidates } from "@/lib/portfolio/hero-portfolio";
import { resolvePortfolio } from "@/lib/portfolio/resolve-owner";

describe("national-to-four-city judged interaction", () => {
  it("changes both operational readiness and the deterministic route", () => {
    const contract = findOpportunityContract("opp-extra-time-sweat-confidence")!;
    const resolve = (scope: "national" | "four_city", assetMode: "unlicensed_match_footage" | "rights_safe_creator") =>
      resolvePortfolio({
        candidates: createHeroPortfolioCandidates(contract, scope, assetMode),
        opportunity: contract.opportunity,
        scope,
        assetMode,
        evaluatedAt: loadFixtureBundle().generatedAt,
      }).candidates.find(({ brandId }) => brandId === "rexona")!;

    const constrained = resolve("national", "unlicensed_match_footage");
    const executable = resolve("four_city", "rights_safe_creator");

    expect(constrained.decision.route).toBe("watch");
    expect(executable.decision.route).toBe("test");
    expect(executable.preparedness.score).toBeGreaterThan(constrained.preparedness.score);
    expect(executable.blockers).toEqual([]);
  });
});
