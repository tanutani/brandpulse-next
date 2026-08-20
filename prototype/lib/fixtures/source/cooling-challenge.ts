import type { DecisionBlocker } from "@/lib/contracts";
import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Single-creator cooling challenge — the signal the system refuses.
 *
 * Attention is real and visible, but it sits in one creator family with no
 * category search and no commerce movement behind it. The concentration and
 * manipulation penalties take Proof to zero, and Proof below the ignore
 * threshold ends the decision before any brand question is asked.
 *
 * No brand is selected. That is the point: the correct answer is that nobody
 * should own this.
 */

const conflictBlocker: DecisionBlocker = {
  code: "PORTFOLIO_CONFLICT_ACTIVE_GAME_NIGHT_TERRITORY",
  severity: "remediable",
  message: "Axe already occupies an overlapping synthetic game-night territory.",
  remediation: "Separate the audience and proposition before any Axe-led response.",
};

const nationalPreparedness =
  (
    values: Omit<ReturnType<PreparednessFor>, "evidenceIds" | "blockers">,
    evidenceId: string,
  ): PreparednessFor =>
  () => ({ ...values, evidenceIds: [evidenceId], blockers: [] });

export const coolingChallenge: UseCaseSource = {
  contractId: "contract-single-creator-cooling-challenge",
  version: 1,
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: null,

  opportunity: {
    id: "opp-single-creator-cooling-challenge",
    title: "Single-creator cooling challenge",
    hypothesis:
      "A creator-led cooling challenge represents broad consumer demand for a deodorant activation.",
    signalClass: "fad_noise",
    usefulUntil: "2026-08-16T18:30:00.000Z",
    evidence: [
      {
        id: "sig-noise-social",
        stance: "support",
        claim: "One dated public creator-search snapshot shows concentrated attention.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://www.youtube.com/results?search_query=cooling+deodorant+challenge",
        capturedAt: "2026-08-15T08:18:00.000Z",
      },
      {
        id: "sig-noise-commerce",
        stance: "contradict",
        claim: "Invented aggregate commerce and category-search progression are flat.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:20:00.000Z",
        synthetic: true,
      },
      {
        id: "noise-alt-explanation",
        stance: "contradict",
        claim: "Paid seeding, novelty, or entertainment value is a stronger alternative explanation.",
        evidenceType: "model_inference",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:30:00.000Z",
      },
    ],
  },

  proof: {
    persistence: 18,
    independentCorroboration: 12,
    behavioralProgression: 8,
    diffusion: 15,
    commercialSignal: 5,
    freshnessQuality: 78,
    sourceConcentration: 90,
    manipulationRisk: 45,
  },

  brands: [
    {
      brandId: "rexona",
      displayName: "Rexona",
      permission: {
        brandMeaning: 58,
        audienceOverlap: 52,
        distinctiveAssetFit: 46,
        historicalCredibility: 50,
        portfolioDistinctiveness: 44,
        culturalClaimsSafety: 41,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-rexona"],
        blockers: [],
      },
      preparedness: nationalPreparedness(
        {
          productClaimAvailability: 72,
          inventoryService: 58,
          channelCoverage: 54,
          creatorAgencyReadiness: 62,
          rightsLegalApproval: 45,
          measurementReadiness: 70,
        },
        "inv-rex-national",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "dove",
      displayName: "Dove",
      permission: {
        brandMeaning: 50,
        audienceOverlap: 48,
        distinctiveAssetFit: 42,
        historicalCredibility: 46,
        portfolioDistinctiveness: 44,
        culturalClaimsSafety: 41,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-dove"],
        blockers: [],
      },
      preparedness: nationalPreparedness(
        {
          productClaimAvailability: 70,
          inventoryService: 56,
          channelCoverage: 52,
          creatorAgencyReadiness: 60,
          rightsLegalApproval: 43,
          measurementReadiness: 68,
        },
        "inv-dove-national",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "axe",
      displayName: "Axe",
      permission: {
        brandMeaning: 62,
        audienceOverlap: 58,
        distinctiveAssetFit: 60,
        historicalCredibility: 56,
        portfolioDistinctiveness: 52,
        culturalClaimsSafety: 77,
        // Axe scores highest here on raw fit, and the overlap penalty is exactly
        // why raw fit is not the whole question.
        portfolioConflictPenalty: 8,
        evidenceIds: ["brand-memory-axe"],
        blockers: [conflictBlocker],
      },
      preparedness: nationalPreparedness(
        {
          productClaimAvailability: 76,
          inventoryService: 64,
          channelCoverage: 58,
          creatorAgencyReadiness: 66,
          rightsLegalApproval: 47,
          measurementReadiness: 72,
        },
        "inv-axe-national",
      ),
      portfolioConflicts: ["Active synthetic game-night territory overlaps the noise signal."],
    },
  ],

  assumptions: [
    { label: "Source concentration percentage", value: 90, evidenceType: "business_assumption" },
    { label: "Manipulation risk percentage", value: 45, evidenceType: "business_assumption" },
    {
      label: "All internal-like records are invented aggregates, not HUL facts",
      value: true,
      evidenceType: "business_assumption",
    },
  ],

  causalSprint: null,
  humanDecisions: [],
};
