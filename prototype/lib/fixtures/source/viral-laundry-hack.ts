import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * The viral hack that fails Proof — the mirror image of the Rexona journey.
 *
 * Everything a dashboard would celebrate is here: enormous velocity, a rising
 * view count, a recognisable format. What is missing is corroboration. The
 * attention sits inside one platform's recommendation loop, category search has
 * not moved, and baskets have not moved either.
 *
 * Proof survives the concentration penalty but never reaches the test threshold,
 * so the answer is Watch rather than Ignore: the signal is not nothing, it is
 * just not yet evidence. That distinction is the whole "fad or trend" question,
 * and it is decided by the penalty arithmetic rather than by anyone's judgement.
 */

const readyEverywhere = (evidenceId: string): PreparednessFor => () => ({
  productClaimAvailability: 72,
  inventoryService: 74,
  channelCoverage: 68,
  creatorAgencyReadiness: 66,
  rightsLegalApproval: 63,
  measurementReadiness: 76,
  evidenceIds: [evidenceId],
  blockers: [],
});

export const viralLaundryHack: UseCaseSource = {
  contractId: "contract-viral-laundry-hack",
  version: 1,
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "surf-excel",

  opportunity: {
    id: "opp-viral-laundry-hack",
    title: "Viral stain-removal hack",
    hypothesis:
      "A fast-spreading laundry hack represents a real change in how people want to remove stains.",
    signalClass: "fad_noise",
    usefulUntil: "2026-08-18T18:30:00.000Z",
    evidence: [
      {
        id: "sig-hack-social",
        stance: "support",
        claim:
          "A dated public snapshot shows very high short-form view velocity for one hack format.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://www.youtube.com/results?search_query=laundry+stain+hack",
        capturedAt: "2026-08-15T08:02:00.000Z",
      },
      {
        id: "sig-hack-search",
        stance: "contradict",
        claim:
          "A dated public search snapshot shows category search flat over the same seven days.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=now%207-d&geo=IN&q=stain%20remover",
        capturedAt: "2026-08-15T08:06:00.000Z",
      },
      {
        id: "sig-hack-commerce",
        stance: "contradict",
        claim:
          "Invented aggregate basket data shows no change in stain-remover attach rate during the spike.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:10:00.000Z",
        synthetic: true,
      },
      {
        id: "sig-hack-concentration",
        stance: "contradict",
        claim:
          "Invented aggregate source analysis attributes most reach to one platform's recommendation surface.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:14:00.000Z",
        synthetic: true,
      },
    ],
  },

  // High diffusion and freshness, weak progression, and a concentration penalty
  // that the raw view count would otherwise hide.
  proof: {
    persistence: 48,
    independentCorroboration: 58,
    behavioralProgression: 34,
    diffusion: 70,
    commercialSignal: 30,
    freshnessQuality: 86,
    sourceConcentration: 55,
    manipulationRisk: 10,
  },

  brands: [
    {
      brandId: "surf-excel",
      displayName: "Surf Excel",
      permission: {
        brandMeaning: 70,
        audienceOverlap: 66,
        distinctiveAssetFit: 62,
        historicalCredibility: 68,
        portfolioDistinctiveness: 60,
        culturalClaimsSafety: 68,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-surf-excel"],
        blockers: [],
      },
      preparedness: readyEverywhere("inv-surf-national"),
      portfolioConflicts: [],
    },
    {
      brandId: "rin",
      displayName: "Rin",
      permission: {
        brandMeaning: 62,
        audienceOverlap: 60,
        distinctiveAssetFit: 56,
        historicalCredibility: 60,
        portfolioDistinctiveness: 54,
        culturalClaimsSafety: 60,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-rin"],
        blockers: [],
      },
      preparedness: readyEverywhere("inv-rin-national"),
      portfolioConflicts: [],
    },
    {
      brandId: "comfort",
      displayName: "Comfort",
      permission: {
        brandMeaning: 56,
        audienceOverlap: 54,
        distinctiveAssetFit: 50,
        historicalCredibility: 54,
        portfolioDistinctiveness: 48,
        culturalClaimsSafety: 54,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-comfort"],
        blockers: [],
      },
      preparedness: readyEverywhere("inv-comfort-national"),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    { label: "Source concentration percentage", value: 55, evidenceType: "business_assumption" },
    { label: "Manipulation risk percentage", value: 10, evidenceType: "business_assumption" },
    {
      label: "Execution is unconstrained here, so the binding gate is evidence quality",
      value: true,
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
