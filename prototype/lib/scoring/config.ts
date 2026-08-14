export const P3_RULESET_VERSION = "p3-1.0.0" as const;

export const P3_WEIGHTS = {
  proof: {
    persistence: 0.2,
    independentCorroboration: 0.2,
    behavioralProgression: 0.2,
    diffusion: 0.15,
    commercialSignal: 0.15,
    freshnessQuality: 0.1,
  },
  permission: {
    brandMeaning: 0.25,
    audienceOverlap: 0.2,
    distinctiveAssetFit: 0.15,
    historicalCredibility: 0.15,
    portfolioDistinctiveness: 0.15,
    culturalClaimsSafety: 0.1,
  },
  preparedness: {
    productClaimAvailability: 0.2,
    inventoryService: 0.25,
    channelCoverage: 0.15,
    creatorAgencyReadiness: 0.15,
    rightsLegalApproval: 0.15,
    measurementReadiness: 0.1,
  },
} as const;

export const ROUTE_THRESHOLDS = {
  actNow: { proof: 75, permission: 80, preparedness: 80, maxUsefulHours: 72 },
  test: { proof: 55, permission: 70, preparedness: 55 },
  watch: { proof: 35 },
  ignore: { proofBelow: 35, permissionBelow: 40 },
} as const;

export const PENALTY_LIMITS = {
  sourceConcentrationMax: 20,
  manipulationRiskMax: 25,
} as const;
