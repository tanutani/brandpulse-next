import type {
  AssetMode,
  DecisionBlocker,
  OpportunityContract,
  PortfolioCandidateInputs,
  PortfolioScope,
} from "@/lib/contracts";

const rightsBlocker: DecisionBlocker = {
  code: "RIGHTS_MATCH_FOOTAGE_UNAVAILABLE",
  severity: "mandatory",
  message: "Match footage is unlicensed for this demonstration package.",
  remediation: "Use original creator-led content without event footage, marks, or commentary audio.",
};

const conflictBlocker: DecisionBlocker = {
  code: "PORTFOLIO_CONFLICT_ACTIVE_GAME_NIGHT_TERRITORY",
  severity: "remediable",
  message: "Axe already occupies an overlapping synthetic game-night territory.",
  remediation: "Keep ownership with Rexona or separate the audience and proposition.",
};

export function createHeroPortfolioCandidates(
  contract: OpportunityContract,
  scope: PortfolioScope,
  assetMode: AssetMode,
): PortfolioCandidateInputs[] {
  const proofFor = (brandId: string) =>
    contract.brandAssessments.find((assessment) => assessment.brandId === brandId)?.proof
    ?? contract.brandAssessments[0].proof;
  const national = scope === "national";
  const unlicensed = assetMode === "unlicensed_match_footage";
  const sharedPreparedness = {
    scope,
    assetMode,
    productClaimAvailability: 90,
    inventoryService: national ? 58 : 96,
    channelCoverage: national ? 54 : 88,
    creatorAgencyReadiness: national ? 72 : 90,
    rightsLegalApproval: unlicensed ? 15 : 95,
    measurementReadiness: 90,
    evidenceIds: national
      ? ["inv-rex-national", unlicensed ? "rights-match-footage" : "rights-original-creator"]
      : ["inv-rex-mumbai", "inv-rex-delhi", "inv-rex-bengaluru", "inv-rex-hyderabad", "rights-original-creator"],
    blockers: unlicensed ? [rightsBlocker] : [],
  } as const;

  return [
    {
      brandId: "rexona",
      displayName: "Rexona",
      proof: proofFor("rexona"),
      permission: {
        brandId: "rexona", brandMeaning: 96, audienceOverlap: 90, distinctiveAssetFit: 88,
        historicalCredibility: 92, portfolioDistinctiveness: 86, culturalClaimsSafety: 88,
        portfolioConflictPenalty: 0, evidenceIds: ["brand-memory-rexona"], blockers: [],
      },
      preparedness: { ...sharedPreparedness, brandId: "rexona" },
      portfolioConflicts: [],
    },
    {
      brandId: "dove",
      displayName: "Dove",
      proof: proofFor("dove"),
      permission: {
        brandId: "dove", brandMeaning: 68, audienceOverlap: 74, distinctiveAssetFit: 60,
        historicalCredibility: 70, portfolioDistinctiveness: 72, culturalClaimsSafety: 94,
        portfolioConflictPenalty: 0, evidenceIds: ["brand-memory-dove"], blockers: [],
      },
      preparedness: {
        ...sharedPreparedness, brandId: "dove", productClaimAvailability: 82,
        inventoryService: national ? 82 : 88, creatorAgencyReadiness: 78,
      },
      portfolioConflicts: [],
    },
    {
      brandId: "axe",
      displayName: "Axe",
      proof: proofFor("axe"),
      permission: {
        brandId: "axe", brandMeaning: 74, audienceOverlap: 79, distinctiveAssetFit: 82,
        historicalCredibility: 70, portfolioDistinctiveness: 45, culturalClaimsSafety: 76,
        portfolioConflictPenalty: 8, evidenceIds: ["brand-memory-axe"], blockers: [conflictBlocker],
      },
      preparedness: {
        ...sharedPreparedness, brandId: "axe", productClaimAvailability: 84,
        inventoryService: national ? 90 : 86, creatorAgencyReadiness: 75,
      },
      portfolioConflicts: ["Active synthetic game-night campaign creates ownership ambiguity."],
    },
  ];
}
