import type {
  BrandAssessment,
  DecisionBlocker,
  OpportunityContract,
} from "@/lib/contracts";
import { OpportunityContractSchema } from "@/lib/contracts";
import { selectRoute } from "@/lib/routing/select-route";
import { calculatePermission } from "@/lib/scoring/permission";
import { calculatePreparedness } from "@/lib/scoring/preparedness";
import { calculateProof } from "@/lib/scoring/proof";
import type { BrandSource, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Turns an authored use case into a scored contract.
 *
 * Every number a viewer sees comes out of the same functions the running app
 * uses: calculateProof, calculatePermission, calculatePreparedness and
 * selectRoute. Nothing is copied from the source, so a stored score cannot drift
 * from the engine that claims to have produced it.
 *
 * The route and readiness shown on the contract are the ones the selected brand
 * earns. Where no brand is selected — a signal the router rejects outright — the
 * strongest candidate stands in, because the contract still has to state what the
 * system concluded about the opportunity as a whole.
 */

function assessBrand(source: UseCaseSource, brand: BrandSource) {
  const preparednessSource = brand.preparedness(source.storedScope, source.storedAssetMode);

  const proof = calculateProof({
    ...source.proof,
    evidence: source.opportunity.evidence,
  });
  const permission = calculatePermission({
    ...brand.permission,
    brandId: brand.brandId,
    blockers: brand.permission.blockers ?? [],
  });
  const preparedness = calculatePreparedness({
    ...preparednessSource,
    brandId: brand.brandId,
    scope: source.storedScope,
    assetMode: source.storedAssetMode,
    blockers: preparednessSource.blockers ?? [],
  });

  const blockers: DecisionBlocker[] = [
    ...(brand.permission.blockers ?? []),
    ...(preparednessSource.blockers ?? []),
  ];

  const decision = selectRoute({
    opportunity: source.opportunity,
    proof,
    permission,
    preparedness,
    blockers,
    evaluatedAt: source.evaluatedAt,
  });

  const assessment: BrandAssessment = {
    brandId: brand.brandId,
    proof,
    permission,
    preparedness,
    // selectRoute already sets this to the weakest of the three gates, so the
    // "readiness equals the lowest gate" rule holds by construction.
    readiness: decision.readiness,
    portfolioConflicts: brand.portfolioConflicts ?? [],
  };

  return { assessment, decision, blockers };
}

export function buildContract(source: UseCaseSource): OpportunityContract {
  const assessed = source.brands.map((brand) => assessBrand(source, brand));

  const selected =
    assessed.find(({ assessment }) => assessment.brandId === source.selectedBrandId)
    ?? assessed.reduce((best, candidate) =>
      candidate.assessment.readiness > best.assessment.readiness ? candidate : best,
    );

  return OpportunityContractSchema.parse({
    schemaVersion: "1.0.0",
    contractId: source.contractId,
    version: source.version,
    opportunity: source.opportunity,
    selectedBrandId: source.selectedBrandId,
    brandAssessments: assessed.map(({ assessment }) => assessment),
    recommendedRoute: selected.decision.route,
    actionMode: source.actionMode,
    portfolioContext: source.portfolioContext,
    routeReasonCodes: selected.decision.reasonCodes,
    assumptions: source.assumptions,
    causalSprint: source.causalSprint ?? null,
    humanDecisions: source.humanDecisions ?? [],
    outcome: null,
  });
}

export function buildContracts(sources: UseCaseSource[]): OpportunityContract[] {
  return sources.map(buildContract);
}
