import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * The real trend that fails Preparedness — stock, not evidence, is the constraint.
 *
 * A heat-wave is driving genuine q-commerce demand for frozen dessert. Proof is
 * strong and Permission is comfortable. What decides the answer is dark-store
 * days-cover: a national campaign would create demand in cells that cannot serve
 * it, turning a good signal into a stockout and a bad delivery experience.
 *
 * Narrowing to the cells that can serve is what makes this executable, so the
 * contract is stored at four-city scope. National scope scores below the test
 * threshold on the same inputs, which is recorded as an assumption rather than
 * asserted in prose.
 */

const byScope =
  (
    fourCity: Omit<ReturnType<PreparednessFor>, "evidenceIds" | "blockers">,
    national: Omit<ReturnType<PreparednessFor>, "evidenceIds" | "blockers">,
    brandId: string,
  ): PreparednessFor =>
  (scope) => ({
    ...(scope === "four_city" ? fourCity : national),
    evidenceIds:
      scope === "four_city"
        ? [`inv-${brandId}-mumbai`, `inv-${brandId}-delhi`, `inv-${brandId}-bengaluru`, `inv-${brandId}-hyderabad`]
        : [`inv-${brandId}-national`],
    blockers: [],
  });

export const heatwaveQcommerce: UseCaseSource = {
  contractId: "contract-heatwave-qcommerce-spike",
  version: 1,
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "four_city",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "kwality-walls",

  opportunity: {
    id: "opp-heatwave-qcommerce-spike",
    title: "Heat-wave frozen dessert spike",
    hypothesis:
      "A heat-wave is creating a short-window q-commerce demand spike that frozen dessert can serve.",
    signalClass: "live_moment",
    usefulUntil: "2026-08-17T18:30:00.000Z",
    evidence: [
      {
        id: "sig-heat-weather",
        stance: "support",
        claim: "A dated public weather snapshot records a multi-day heat-wave advisory.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://mausam.imd.gov.in/",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-heat-search",
        stance: "support",
        claim: "A dated public search snapshot shows sharp frozen-dessert category acceleration.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=now%207-d&geo=IN&q=ice%20cream",
        capturedAt: "2026-08-15T08:04:00.000Z",
      },
      {
        id: "sig-heat-commerce",
        stance: "support",
        claim:
          "Invented aggregate q-commerce records show frozen dessert units rising ahead of category.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:08:00.000Z",
        synthetic: true,
      },
      {
        id: "sig-heat-inventory",
        stance: "contradict",
        claim:
          "Invented aggregate dark-store records show national days-cover cannot serve the demand a national campaign would create.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:12:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 74,
    independentCorroboration: 80,
    behavioralProgression: 76,
    diffusion: 70,
    commercialSignal: 72,
    freshnessQuality: 88,
    sourceConcentration: 6,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "kwality-walls",
      displayName: "Kwality Wall's",
      permission: {
        brandMeaning: 82,
        audienceOverlap: 80,
        distinctiveAssetFit: 74,
        historicalCredibility: 78,
        portfolioDistinctiveness: 72,
        culturalClaimsSafety: 79,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-kwality-walls"],
        blockers: [],
      },
      preparedness: byScope(
        {
          productClaimAvailability: 80,
          inventoryService: 94,
          channelCoverage: 82,
          creatorAgencyReadiness: 76,
          rightsLegalApproval: 88,
          measurementReadiness: 86,
        },
        {
          productClaimAvailability: 80,
          inventoryService: 12,
          channelCoverage: 34,
          creatorAgencyReadiness: 52,
          rightsLegalApproval: 88,
          measurementReadiness: 86,
        },
        "kw",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "cornetto",
      displayName: "Cornetto",
      permission: {
        brandMeaning: 74,
        audienceOverlap: 76,
        distinctiveAssetFit: 70,
        historicalCredibility: 70,
        portfolioDistinctiveness: 66,
        culturalClaimsSafety: 74,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-cornetto"],
        blockers: [],
      },
      preparedness: byScope(
        {
          productClaimAvailability: 76,
          inventoryService: 86,
          channelCoverage: 78,
          creatorAgencyReadiness: 72,
          rightsLegalApproval: 84,
          measurementReadiness: 82,
        },
        {
          productClaimAvailability: 76,
          inventoryService: 16,
          channelCoverage: 32,
          creatorAgencyReadiness: 50,
          rightsLegalApproval: 84,
          measurementReadiness: 82,
        },
        "cornetto",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "magnum",
      displayName: "Magnum",
      permission: {
        brandMeaning: 70,
        audienceOverlap: 66,
        distinctiveAssetFit: 72,
        historicalCredibility: 68,
        portfolioDistinctiveness: 62,
        culturalClaimsSafety: 70,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-magnum"],
        blockers: [],
      },
      preparedness: byScope(
        {
          productClaimAvailability: 72,
          inventoryService: 78,
          channelCoverage: 74,
          creatorAgencyReadiness: 70,
          rightsLegalApproval: 82,
          measurementReadiness: 80,
        },
        {
          productClaimAvailability: 72,
          inventoryService: 14,
          channelCoverage: 30,
          creatorAgencyReadiness: 48,
          rightsLegalApproval: 82,
          measurementReadiness: 80,
        },
        "magnum",
      ),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Stored scope",
      value: "four_city — the cells whose days-cover can serve the created demand",
      evidenceType: "business_assumption",
    },
    {
      label: "National scope on the same inputs",
      value: "Preparedness falls below the test threshold, so national execution is not offered",
      evidenceType: "business_assumption",
    },
    {
      label: "All internal-like records are invented aggregates, not HUL facts",
      value: true,
      evidenceType: "business_assumption",
    },
  ],

  causalSprint: null,
  humanDecisions: [],
};
