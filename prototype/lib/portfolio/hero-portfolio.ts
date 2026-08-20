import type {
  AssetMode,
  OpportunityContract,
  PortfolioCandidateInputs,
  PortfolioScope,
} from "@/lib/contracts";
import { USE_CASE_SOURCES } from "@/lib/fixtures/source";

/**
 * Portfolio candidates for a scope and creative mode.
 *
 * Both the contract screen and the resolver read the same authored brand inputs,
 * so a brand cannot show one Permission on one screen and a different one on the
 * next. Proof comes from the contract because Proof is a property of the signal
 * rather than of any candidate.
 */
export function createPortfolioCandidates(
  contract: OpportunityContract,
  scope: PortfolioScope,
  assetMode: AssetMode,
): PortfolioCandidateInputs[] {
  const source = USE_CASE_SOURCES.find(
    ({ opportunity }) => opportunity.id === contract.opportunity.id,
  );
  if (!source) return [];

  const proofFor = (brandId: string) =>
    contract.brandAssessments.find((assessment) => assessment.brandId === brandId)?.proof
    ?? contract.brandAssessments[0].proof;

  return source.brands.map((brand) => {
    const preparedness = brand.preparedness(scope, assetMode);

    return {
      brandId: brand.brandId,
      displayName: brand.displayName,
      proof: proofFor(brand.brandId),
      permission: {
        ...brand.permission,
        brandId: brand.brandId,
        blockers: brand.permission.blockers ?? [],
      },
      preparedness: {
        ...preparedness,
        brandId: brand.brandId,
        scope,
        assetMode,
        blockers: preparedness.blockers ?? [],
      },
      portfolioConflicts: brand.portfolioConflicts ?? [],
    };
  });
}

/** @deprecated Kept as the previous name; use createPortfolioCandidates. */
export const createHeroPortfolioCandidates = createPortfolioCandidates;
