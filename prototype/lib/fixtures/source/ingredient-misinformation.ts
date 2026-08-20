import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * The defensive signal — the case where silence is the expensive option.
 *
 * A "what is really in your soap" claim is spreading fast and is factually
 * wrong about the category. Every other use case here asks whether an
 * opportunity is worth taking. This one asks whether a threat is worth
 * answering, and the correct action is categorically different: a factual
 * response using already-approved claims, not a trend-jack.
 *
 * It routes to Act because all three gates clear and there is nothing to
 * remediate. Nothing has to be built, cleared or invented — the substantiation
 * already exists, which is exactly why the response can be immediate.
 *
 * Act does not mean publish. It means a human is asked to approve a response
 * now rather than next week.
 */

const respondReady = (brandId: string): PreparednessFor => () => ({
  productClaimAvailability: 92,
  inventoryService: 82,
  channelCoverage: 84,
  creatorAgencyReadiness: 80,
  rightsLegalApproval: 79,
  measurementReadiness: 86,
  evidenceIds: [`brand-memory-${brandId}`],
  blockers: [],
});

export const ingredientMisinformation: UseCaseSource = {
  contractId: "contract-ingredient-misinformation",
  version: 1,
  actionMode: "defensive_response",
  portfolioContext: "hul_current",
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "lifebuoy",

  opportunity: {
    id: "opp-ingredient-misinformation",
    title: "Soap ingredient misinformation",
    hypothesis:
      "A spreading and factually incorrect ingredient claim about the soap category needs a response, not a campaign.",
    signalClass: "live_moment",
    usefulUntil: "2026-08-17T12:30:00.000Z",
    evidence: [
      {
        id: "sig-misinfo-social",
        stance: "support",
        claim:
          "A dated public snapshot shows a rapidly spreading ingredient claim video about the soap category.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://www.youtube.com/results?search_query=what+is+really+in+your+soap",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-misinfo-search",
        stance: "support",
        claim:
          "A dated public search snapshot shows a sharp rise in ingredient-safety queries for the category.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=now%207-d&geo=IN&q=soap%20ingredients%20safe",
        capturedAt: "2026-08-15T08:04:00.000Z",
      },
      {
        id: "sig-misinfo-news",
        stance: "support",
        claim: "A dated public news-index snapshot shows the claim diffusing beyond one platform.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://api.gdeltproject.org/api/v2/doc/doc?query=soap%20ingredient%20safety&mode=artlist&format=html",
        capturedAt: "2026-08-15T08:08:00.000Z",
      },
      {
        id: "sig-misinfo-substantiation",
        stance: "support",
        claim:
          "Invented aggregate claims records show the correcting facts are already substantiated and approved for use.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:12:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 80,
    independentCorroboration: 86,
    behavioralProgression: 74,
    diffusion: 88,
    commercialSignal: 58,
    freshnessQuality: 92,
    sourceConcentration: 5,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "lifebuoy",
      displayName: "Lifebuoy",
      permission: {
        brandMeaning: 92,
        audienceOverlap: 88,
        distinctiveAssetFit: 82,
        historicalCredibility: 90,
        portfolioDistinctiveness: 80,
        culturalClaimsSafety: 76,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-lifebuoy"],
        blockers: [],
      },
      preparedness: respondReady("lifebuoy"),
      portfolioConflicts: [],
    },
    {
      brandId: "dove",
      displayName: "Dove",
      permission: {
        brandMeaning: 80,
        audienceOverlap: 78,
        distinctiveAssetFit: 72,
        historicalCredibility: 80,
        portfolioDistinctiveness: 70,
        culturalClaimsSafety: 71,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-dove"],
        blockers: [],
      },
      preparedness: respondReady("dove"),
      portfolioConflicts: [],
    },
    {
      brandId: "pears",
      displayName: "Pears",
      permission: {
        brandMeaning: 74,
        audienceOverlap: 70,
        distinctiveAssetFit: 68,
        historicalCredibility: 74,
        portfolioDistinctiveness: 66,
        culturalClaimsSafety: 73,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-pears"],
        blockers: [],
      },
      preparedness: respondReady("pears"),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Correct action",
      value: "Factual response using approved claims — not a trend-jack and not a product push",
      evidenceType: "business_assumption",
    },
    {
      label: "Act still requires human approval",
      value: "Nothing is published by the system under any route",
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
