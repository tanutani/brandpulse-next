import { z } from "zod";

import bundledContracts from "@/public/data/opportunity-contracts.json";
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

const parsedBundle = FixtureBundleSchema.parse(bundledContracts);

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
