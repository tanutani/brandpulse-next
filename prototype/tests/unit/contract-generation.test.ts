import { describe, expect, it } from "vitest";

import { loadFixtureBundle } from "@/lib/fixtures";
import { USE_CASE_SOURCES } from "@/lib/fixtures/source";
import { buildContract } from "@/lib/fixtures/build-contract";
import { P3_WEIGHTS } from "@/lib/scoring/config";
import { calculatePermission } from "@/lib/scoring/permission";
import { calculatePreparedness } from "@/lib/scoring/preparedness";
import { calculateProof } from "@/lib/scoring/proof";

/**
 * Proves the property the source layer exists to guarantee: every displayed score
 * is what the engine computes, and no gate can be a hand-written placeholder.
 */

const GATES = ["proof", "permission", "preparedness"] as const;

describe("derived contracts", () => {
  it("gives every gate exactly the weighted components its scorer defines", () => {
    for (const contract of loadFixtureBundle().contracts) {
      for (const assessment of contract.brandAssessments) {
        for (const gate of GATES) {
          const expected = Object.keys(P3_WEIGHTS[gate]).sort();
          const actual = assessment[gate].components.map(({ name }) => name).sort();

          expect(actual, `${contract.contractId}/${assessment.brandId}/${gate}`).toEqual(expected);

          const weightSum = assessment[gate].components.reduce(
            (sum, component) => sum + component.weight,
            0,
          );
          expect(weightSum).toBeCloseTo(1, 5);
        }
      }
    }
  });

  it("recomputes every stored score from the source inputs and gets the same answer", () => {
    for (const source of USE_CASE_SOURCES) {
      const contract = buildContract(source);

      for (const brand of source.brands) {
        const assessment = contract.brandAssessments.find(
          ({ brandId }) => brandId === brand.brandId,
        )!;
        const preparednessSource = brand.preparedness(source.storedScope, source.storedAssetMode);
        const label = `${source.contractId}/${brand.brandId}`;

        expect(
          calculateProof({ ...source.proof, evidence: source.opportunity.evidence }).score,
          `${label}/proof`,
        ).toBe(assessment.proof.score);

        expect(
          calculatePermission({
            ...brand.permission,
            brandId: brand.brandId,
            blockers: brand.permission.blockers ?? [],
          }).score,
          `${label}/permission`,
        ).toBe(assessment.permission.score);

        expect(
          calculatePreparedness({
            ...preparednessSource,
            brandId: brand.brandId,
            scope: source.storedScope,
            assetMode: source.storedAssetMode,
            blockers: preparednessSource.blockers ?? [],
          }).score,
          `${label}/preparedness`,
        ).toBe(assessment.preparedness.score);
      }
    }
  });

  it("sets readiness to the weakest gate for every brand", () => {
    for (const contract of loadFixtureBundle().contracts) {
      for (const assessment of contract.brandAssessments) {
        expect(assessment.readiness).toBe(
          Math.min(
            assessment.proof.score,
            assessment.permission.score,
            assessment.preparedness.score,
          ),
        );
      }
    }
  });

  it("reports route reason codes the router actually emits", () => {
    // The hand-authored fixture carried invented codes such as
    // REXONA_PERMISSION_STRONGEST that no branch of selectRoute can produce, and
    // the resolver rendered them as if they were the rule that fired.
    const invented = ["REXONA_PERMISSION_STRONGEST", "PROOF_ABOVE_TEST_THRESHOLD", "PROOF_PERSISTS"];

    for (const contract of loadFixtureBundle().contracts) {
      expect(contract.routeReasonCodes.length).toBeGreaterThan(0);
      for (const code of contract.routeReasonCodes) {
        expect(invented).not.toContain(code);
      }
    }
  });
});
