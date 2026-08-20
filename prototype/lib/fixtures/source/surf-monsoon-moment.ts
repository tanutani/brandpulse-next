import type { DecisionBlocker } from "@/lib/contracts";
import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Prepared growth ACT case: the first monsoon rain turns muddy outdoor play into
 * a short, predictable laundry occasion. The evidence is corroborated and the
 * operating work was completed before the weather window opened.
 */

const rightsBlocker: DecisionBlocker = {
  code: "RIGHTS_CREATOR_PACKAGE_UNAVAILABLE",
  severity: "mandatory",
  message: "The muddy-play creator footage is not cleared for this activation window.",
  remediation: "Restore the pre-cleared creator package and verify its usage expiry.",
};

const preparedForMonsoon = (brandId: string): PreparednessFor => (scope, assetMode) => {
  const rightsSafe = assetMode === "rights_safe_creator";
  const national = scope === "national";

  return {
    productClaimAvailability: 88,
    inventoryService: national ? 87 : 92,
    channelCoverage: national ? 82 : 88,
    creatorAgencyReadiness: rightsSafe ? 86 : 38,
    rightsLegalApproval: rightsSafe ? 82 : 12,
    measurementReadiness: 84,
    evidenceIds: [`inv-${brandId}-national`, `brand-memory-${brandId}`, "sig-monsoon-rights"],
    blockers: rightsSafe ? [] : [rightsBlocker],
  };
};

export const surfMonsoonMoment: UseCaseSource = {
  contractId: "contract-surf-first-monsoon",
  version: 1,
  actionMode: "growth_activation",
  portfolioContext: "hul_current",
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "surf-excel",

  opportunity: {
    id: "opp-surf-first-monsoon",
    title: "First-monsoon muddy-play moment",
    hypothesis:
      "The first widespread monsoon rain creates a short muddy-play and stain-removal occasion that Surf Excel is already prepared to serve.",
    signalClass: "live_moment",
    usefulUntil: "2026-08-17T18:30:00.000Z",
    evidence: [
      {
        id: "sig-monsoon-weather",
        stance: "support",
        claim: "A dated IMD weather snapshot shows the first widespread monsoon rain across target markets.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://mausam.imd.gov.in/",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-monsoon-search",
        stance: "support",
        claim: "A dated public search snapshot shows muddy-clothes and stain-removal queries rising with the rain.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=now%207-d&geo=IN&q=mud%20stain%20removal",
        capturedAt: "2026-08-15T08:04:00.000Z",
      },
      {
        id: "sig-monsoon-social",
        stance: "support",
        claim: "A dated public social-video search shows muddy outdoor play diffusing beyond one creator.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://www.youtube.com/results?search_query=first+monsoon+muddy+play+india",
        capturedAt: "2026-08-15T08:08:00.000Z",
      },
      {
        id: "sig-monsoon-commerce",
        stance: "support",
        claim: "Invented aggregate commerce records show stain-removal searches progressing to laundry purchases.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:12:00.000Z",
        synthetic: true,
      },
      {
        id: "sig-monsoon-rights",
        stance: "support",
        claim: "Invented aggregate operating records show prepared inventory, cleared creator rights, and an existing substantiated stain-removal claim.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:16:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 82,
    independentCorroboration: 88,
    behavioralProgression: 82,
    diffusion: 80,
    commercialSignal: 80,
    freshnessQuality: 92,
    sourceConcentration: 4,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "surf-excel",
      displayName: "Surf Excel",
      permission: {
        brandMeaning: 96,
        audienceOverlap: 92,
        distinctiveAssetFit: 94,
        historicalCredibility: 94,
        portfolioDistinctiveness: 88,
        culturalClaimsSafety: 82,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-surf-excel"],
        blockers: [],
      },
      preparedness: preparedForMonsoon("surf-excel"),
      portfolioConflicts: [],
    },
    {
      brandId: "rin",
      displayName: "Rin",
      permission: {
        brandMeaning: 78,
        audienceOverlap: 82,
        distinctiveAssetFit: 70,
        historicalCredibility: 76,
        portfolioDistinctiveness: 72,
        culturalClaimsSafety: 78,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-rin"],
        blockers: [],
      },
      preparedness: preparedForMonsoon("rin"),
      portfolioConflicts: [],
    },
    {
      brandId: "comfort",
      displayName: "Comfort",
      permission: {
        brandMeaning: 62,
        audienceOverlap: 74,
        distinctiveAssetFit: 64,
        historicalCredibility: 66,
        portfolioDistinctiveness: 70,
        culturalClaimsSafety: 80,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-comfort"],
        blockers: [],
      },
      preparedness: preparedForMonsoon("comfort"),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Why this one can Act",
      value: "Inventory, creator rights and stain-removal claim support were completed before the weather window opened",
      evidenceType: "business_assumption",
    },
    {
      label: "Activation boundary",
      value: "A human maker-checker decision is required; the system never publishes",
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
