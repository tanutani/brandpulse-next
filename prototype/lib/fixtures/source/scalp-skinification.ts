import type { DecisionBlocker } from "@/lib/contracts";
import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Scalp skinification — a durable trend the system defers rather than rejects.
 *
 * Proof is strong and persistent. What stops it is Preparedness: participating
 * means making a scalp-health claim nobody has substantiated yet, and days to
 * substantiate is what actually decides whether a window is reachable.
 *
 * Scope and creative mode do not move these numbers. The constraint is a claims
 * file, which is the same whether the campaign runs in four cities or forty.
 */

const claimBlocker: DecisionBlocker = {
  code: "SCALP_CLAIM_NOT_SUBSTANTIATED",
  severity: "mandatory",
  message: "The implied scalp-health claim has no approved substantiation on file.",
  remediation:
    "Complete claim substantiation testing before any activation that implies a scalp-health benefit.",
};

const fixedPreparedness =
  (values: Omit<ReturnType<PreparednessFor>, "evidenceIds" | "blockers">, brandId: string): PreparednessFor =>
  () => ({
    ...values,
    evidenceIds: [`brand-memory-${brandId}`],
    blockers: [claimBlocker],
  });

export const scalpSkinification: UseCaseSource = {
  contractId: "contract-scalp-skinification",
  version: 1,
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "dove-hair",

  opportunity: {
    id: "opp-scalp-skinification",
    title: "Scalp skinification",
    hypothesis:
      "Persistent scalp-care language warrants concept and claim development before activation.",
    signalClass: "durable_trend",
    usefulUntil: "2026-12-31T18:30:00.000Z",
    evidence: [
      {
        id: "sig-durable-search",
        stance: "support",
        claim: "A dated public search snapshot shows persistent scalp-care interest.",
        evidenceType: "public",
        freshness: "recent",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=today%203-m&geo=IN&q=scalp%20care",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-durable-news",
        stance: "support",
        claim: "A dated public news-index snapshot provides a second source family.",
        evidenceType: "public",
        freshness: "recent",
        sourceUrl:
          "https://api.gdeltproject.org/api/v2/doc/doc?query=scalp%20care&mode=artlist&format=html",
        capturedAt: "2026-08-15T08:12:00.000Z",
      },
      {
        id: "sig-durable-consumer",
        stance: "support",
        claim:
          "Invented aggregate consumer connects describe scalp-first routines and claim scrutiny.",
        evidenceType: "synthetic_internal",
        freshness: "recent",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:15:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 88,
    independentCorroboration: 72,
    behavioralProgression: 62,
    diffusion: 64,
    commercialSignal: 48,
    freshnessQuality: 76,
    sourceConcentration: 5,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "dove-hair",
      displayName: "Dove Hair",
      permission: {
        brandMeaning: 84,
        audienceOverlap: 80,
        distinctiveAssetFit: 72,
        historicalCredibility: 79,
        portfolioDistinctiveness: 70,
        culturalClaimsSafety: 78,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-dove-hair"],
        blockers: [],
      },
      preparedness: fixedPreparedness(
        {
          productClaimAvailability: 20,
          inventoryService: 52,
          channelCoverage: 46,
          creatorAgencyReadiness: 61,
          rightsLegalApproval: 18,
          measurementReadiness: 62,
        },
        "dove-hair",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "sunsilk",
      displayName: "Sunsilk",
      permission: {
        brandMeaning: 76,
        audienceOverlap: 78,
        distinctiveAssetFit: 68,
        historicalCredibility: 70,
        portfolioDistinctiveness: 66,
        culturalClaimsSafety: 78,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-sunsilk"],
        blockers: [],
      },
      preparedness: fixedPreparedness(
        {
          productClaimAvailability: 16,
          inventoryService: 48,
          channelCoverage: 42,
          creatorAgencyReadiness: 57,
          rightsLegalApproval: 14,
          measurementReadiness: 58,
        },
        "sunsilk",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "tresemme",
      displayName: "TRESemmé",
      permission: {
        brandMeaning: 60,
        audienceOverlap: 66,
        distinctiveAssetFit: 58,
        historicalCredibility: 62,
        portfolioDistinctiveness: 56,
        culturalClaimsSafety: 74,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-tresemme"],
        blockers: [],
      },
      preparedness: fixedPreparedness(
        {
          productClaimAvailability: 14,
          inventoryService: 46,
          channelCoverage: 40,
          creatorAgencyReadiness: 55,
          rightsLegalApproval: 12,
          measurementReadiness: 56,
        },
        "tresemme",
      ),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Concept-test route before claim or activation",
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
