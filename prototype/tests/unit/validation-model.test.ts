import { describe, expect, it } from "vitest";

import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";
import {
  CITATIONS,
  MODEL_PARAMETERS,
  PARAMETER_STAGES,
  countParameters,
  getCitation,
} from "@/lib/model/parameter-catalogue";
import { computeShareOfSearch } from "@/lib/metrics/share-of-search";
import {
  EMPTY_CORPUS,
  MEMORY_QUESTIONS,
  buildCorpus,
  compareMemoryGrowth,
  computeMemoryYield,
} from "@/lib/memory/memory-yield";

const HERO = "opp-extra-time-sweat-confidence";
const claimBrands = ["rexona", "dove", "axe"];

describe("parameter catalogue", () => {
  it("specifies meaningfully more than it scores", () => {
    const counts = countParameters();

    // The honest framing: a model advertising every parameter as live is not
    // more credible, it is unfalsifiable. The counts are read from the data so
    // the claim on screen cannot drift away from what is actually implemented.
    expect(counts.scored).toBeGreaterThan(0);
    expect(counts.scored).toBeLessThan(counts.specified);
    expect(counts.grounded).toBeGreaterThan(0);
  });

  it("gives every grounded parameter a real citation and no proposed one", () => {
    for (const parameter of MODEL_PARAMETERS) {
      if (parameter.provenance === "grounded") {
        expect(parameter.citationId, `${parameter.id} is grounded but uncited`).toBeDefined();
        expect(getCitation(parameter.citationId), `${parameter.id} cites a missing source`).not.toBeNull();
      } else {
        // A proposal must not borrow authority from someone else's research.
        expect(parameter.citationId, `${parameter.id} is ours but cites a source`).toBeUndefined();
      }
    }
  });

  it("explains why each scored parameter earned its place", () => {
    for (const parameter of MODEL_PARAMETERS.filter(({ scored }) => scored)) {
      expect(parameter.earnsItsPlace, `${parameter.id} is scored without a reason`).toBeTruthy();
    }
  });

  it("assigns every parameter to a declared stage", () => {
    const stageIds = new Set(PARAMETER_STAGES.map(({ id }) => id));
    for (const parameter of MODEL_PARAMETERS) {
      expect(stageIds).toContain(parameter.stage);
    }
  });

  it("uses every citation it declares", () => {
    const cited = new Set(MODEL_PARAMETERS.map(({ citationId }) => citationId).filter(Boolean));
    for (const citation of CITATIONS) {
      expect([...cited], `${citation.id} is declared but never used`).toContain(citation.id);
    }
  });
});

describe("share of search", () => {
  it("gives shares that sum to 100 for the latest week", () => {
    const result = computeShareOfSearch("deodorants")!;
    const total = result.readings.reduce((sum, reading) => sum + reading.latestSharePct, 0);

    expect(total).toBeGreaterThan(99.5);
    expect(total).toBeLessThan(100.5);
  });

  it("reports direction against an explicit flat band, not against zero", () => {
    const result = computeShareOfSearch("deodorants")!;

    for (const reading of result.readings) {
      const expected =
        Math.abs(reading.deltaPp) < 0.5 ? "flat" : reading.deltaPp > 0 ? "rising" : "falling";
      expect(reading.direction).toBe(expected);
    }

    // The demonstration case: one brand gaining share while another gives it up.
    expect(result.readings.find(({ brandId }) => brandId === "rexona")!.direction).toBe("rising");
  });

  it("labels a synthetic series as synthetic", () => {
    const result = computeShareOfSearch("deodorants")!;
    expect(result.synthetic).toBe(true);
    expect(result.displayLabel).toMatch(/synthetic/i);
  });

  it("returns null for a category it has no series for", () => {
    expect(computeShareOfSearch("frozen dessert")).toBeNull();
  });

  it("leaves the selected-brand readiness of every contract untouched", () => {
    // Share of search is a separate indicator on purpose. Folding it into Proof
    // would have meant the six Proof weights no longer summed to one, and every
    // score in the catalogue would have shifted. This pins that they did not.
    const readiness = loadFixtureBundle().contracts.map((contract) => {
      const selected =
        contract.brandAssessments.find(({ brandId }) => brandId === contract.selectedBrandId)
        ?? contract.brandAssessments[0];
      return `${contract.opportunity.id}:${selected.readiness}`;
    });

    expect(readiness).toEqual([
      "opp-extra-time-sweat-confidence:63",
      "opp-festive-handwash-moment:81",
      "opp-ingredient-misinformation:78",
      "opp-heatwave-qcommerce-spike:75",
      "opp-beauty-ownership-conflict:66",
      "opp-ph-cleanser-discourse:46",
      "opp-scalp-skinification:42",
      "opp-viral-laundry-hack:39",
      "opp-single-creator-cooling-challenge:0",
    ]);
  });
});

describe("brand memory yield", () => {
  const hero = findOpportunityContract(HERO)!;

  it("reports nothing rather than a floor when memory is empty", () => {
    const result = computeMemoryYield(hero, EMPTY_CORPUS);

    expect(result.answered).toBe(0);
    expect(result.total).toBe(MEMORY_QUESTIONS.length);
    expect(result.percent).toBe(0);
  });

  it("never lowers the yield when a record is added", () => {
    const priors = loadFixtureBundle().contracts.filter(
      ({ contractId }) => contractId !== hero.contractId,
    );

    let previous = computeMemoryYield(hero, EMPTY_CORPUS).answered;
    for (let count = 1; count <= priors.length; count += 1) {
      const current = computeMemoryYield(hero, buildCorpus(priors.slice(0, count), claimBrands))
        .answered;
      expect(current).toBeGreaterThanOrEqual(previous);
      previous = current;
    }
  });

  it("names the record that answers each question, and what is missing", () => {
    const result = computeMemoryYield(
      hero,
      buildCorpus(
        loadFixtureBundle().contracts.filter(({ contractId }) => contractId !== hero.contractId),
        claimBrands,
      ),
    );

    for (const answer of result.answers) {
      expect(answer.detail.length).toBeGreaterThan(0);
    }
    // An unanswered question is a feature: it is the system saying what it does
    // not know, so the measure must be able to come back short.
    expect(result.answered).toBeLessThan(result.total);
  });

  it("demonstrates compounding by running the same function twice", () => {
    const growth = compareMemoryGrowth(hero, claimBrands);

    expect(growth.firstDecision.answered).toBe(0);
    expect(growth.withHistory.answered).toBeGreaterThan(growth.firstDecision.answered);
    expect(growth.withHistory.total).toBe(growth.firstDecision.total);
  });
});
