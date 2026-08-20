import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * The positive Act case — the upside route, and the one that shows what
 * Preparedness is actually for.
 *
 * A dated festive window drives a genuine, repeating hygiene occasion. All
 * three gates clear and there is no blocker, so the system says Act.
 *
 * The reason it can say Act is that the work was done in advance: stock was
 * built to the forecast, creative was cleared before the window opened, and the
 * claim was already substantiated. Preparedness is earned before the moment,
 * not during it. Every other case in this catalogue is blocked by something
 * nobody had time to fix once the signal arrived; this is what it looks like
 * when somebody did.
 *
 * Act still routes to a human. The system never publishes.
 */

const preClearedForFestive = (brandId: string): PreparednessFor => () => ({
  productClaimAvailability: 90,
  inventoryService: 88,
  channelCoverage: 82,
  creatorAgencyReadiness: 84,
  rightsLegalApproval: 75,
  measurementReadiness: 88,
  evidenceIds: [`inv-${brandId}-national`, `brand-memory-${brandId}`],
  blockers: [],
});

export const festiveHandwashMoment: UseCaseSource = {
  contractId: "contract-festive-handwash-moment",
  version: 1,
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "lifebuoy",

  opportunity: {
    id: "opp-festive-handwash-moment",
    title: "Festive gathering hygiene moment",
    hypothesis:
      "A dated festive gathering window creates a shared-food hygiene occasion the brand is already cleared to serve.",
    signalClass: "live_moment",
    usefulUntil: "2026-08-17T15:30:00.000Z",
    evidence: [
      {
        id: "sig-festive-search",
        stance: "support",
        claim:
          "A dated public search snapshot shows the festive hygiene query pattern repeating on schedule.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=now%207-d&geo=IN&q=handwash",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-festive-news",
        stance: "support",
        claim: "A dated public news-index snapshot confirms the gathering window and its dates.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://api.gdeltproject.org/api/v2/doc/doc?query=festival%20gathering%20india&mode=artlist&format=html",
        capturedAt: "2026-08-15T08:05:00.000Z",
      },
      {
        id: "sig-festive-commerce",
        stance: "support",
        claim:
          "Invented aggregate commerce records show the same window converting in prior years, not just attracting attention.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:09:00.000Z",
        synthetic: true,
      },
      {
        id: "sig-festive-readiness",
        stance: "support",
        claim:
          "Invented aggregate operating records show stock built to forecast and creative rights cleared before the window opened.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:13:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 82,
    independentCorroboration: 84,
    behavioralProgression: 80,
    diffusion: 78,
    commercialSignal: 78,
    freshnessQuality: 90,
    sourceConcentration: 4,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "lifebuoy",
      displayName: "Lifebuoy",
      permission: {
        brandMeaning: 94,
        audienceOverlap: 90,
        distinctiveAssetFit: 86,
        historicalCredibility: 92,
        portfolioDistinctiveness: 82,
        culturalClaimsSafety: 75,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-lifebuoy"],
        blockers: [],
      },
      preparedness: preClearedForFestive("lifebuoy"),
      portfolioConflicts: [],
    },
    {
      brandId: "lux",
      displayName: "Lux",
      permission: {
        brandMeaning: 82,
        audienceOverlap: 80,
        distinctiveAssetFit: 78,
        historicalCredibility: 80,
        portfolioDistinctiveness: 74,
        culturalClaimsSafety: 77,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-lux"],
        blockers: [],
      },
      preparedness: preClearedForFestive("lux"),
      portfolioConflicts: [],
    },
    {
      brandId: "pears",
      displayName: "Pears",
      permission: {
        brandMeaning: 76,
        audienceOverlap: 74,
        distinctiveAssetFit: 72,
        historicalCredibility: 76,
        portfolioDistinctiveness: 70,
        culturalClaimsSafety: 75,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-pears"],
        blockers: [],
      },
      preparedness: preClearedForFestive("pears"),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Why this one can Act",
      value: "Stock, rights and claim substantiation were all completed before the window opened",
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
