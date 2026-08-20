import { z } from "zod";

import { buildContracts } from "@/lib/fixtures/build-contract";
import { USE_CASE_SOURCES } from "@/lib/fixtures/source";
import { OpportunityContractSchema } from "@/lib/contracts/opportunity";
import type { FixtureBundle, FixtureLoader } from "@/lib/contracts/fixtures";
import type { OpportunityContract } from "@/lib/contracts/opportunity";

const FixtureBundleSchema = z
  .object({
    fixtureVersion: z.literal("1.0.0"),
    generatedAt: z.iso.datetime({ offset: true }),
    contracts: z.array(OpportunityContractSchema).min(3),
  })
  .strict()
  .superRefine((bundle, context) => {
    const seenIds = new Set<string>();

    bundle.contracts.forEach((contract, contractIndex) => {
      if (seenIds.has(contract.contractId)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate contractId: ${contract.contractId}`,
          path: ["contracts", contractIndex, "contractId"],
        });
      }
      seenIds.add(contract.contractId);

      contract.opportunity.evidence.forEach((evidence, evidenceIndex) => {
        if (evidence.evidenceType !== "public") return;

        const capturedAt = (evidence as Record<string, unknown>).capturedAt;
        if (!evidence.sourceUrl || typeof capturedAt !== "string" || Number.isNaN(Date.parse(capturedAt))) {
          context.addIssue({
            code: "custom",
            message: "Public evidence requires a sourceUrl and ISO capture date.",
            path: ["contracts", contractIndex, "opportunity", "evidence", evidenceIndex],
          });
        }
      });

      contract.brandAssessments.forEach((assessment, assessmentIndex) => {
        const weakestGate = Math.min(
          assessment.proof.score,
          assessment.permission.score,
          assessment.preparedness.score,
        );
        if (assessment.readiness !== weakestGate) {
          context.addIssue({
            code: "custom",
            message: "Readiness must equal the weakest P3 gate.",
            path: ["contracts", contractIndex, "brandAssessments", assessmentIndex, "readiness"],
          });
        }
      });
    });
  });

/**
 * Contracts are derived from the authored inputs in lib/fixtures/source, not read
 * from JSON. Scores and routes are return values of the same scorers the app uses,
 * so a stored number cannot contradict the engine that claims to produce it. The
 * committed JSON is a generated artifact for review; a drift test keeps it honest.
 *
 * The invariants below are now largely tautological — keep them anyway, because
 * they guard the builder rather than the data.
 */
const parsedBundle = FixtureBundleSchema.parse({
  fixtureVersion: "1.0.0",
  generatedAt: "2026-08-15T08:30:00.000Z",
  contracts: buildContracts(USE_CASE_SOURCES),
});

export const fixtureBundle: FixtureBundle = parsedBundle;

export function loadFixtureBundle(): FixtureBundle {
  return fixtureBundle;
}

export function findOpportunityContract(opportunityId: string): OpportunityContract | null {
  return fixtureBundle.contracts.find(
    (contract) => contract.opportunity.id === opportunityId,
  ) ?? null;
}

export class BundledFixtureLoader implements FixtureLoader {
  async load(): Promise<FixtureBundle> {
    return fixtureBundle;
  }
}
