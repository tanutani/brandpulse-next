import type { DecisionBlocker } from "@/lib/contracts";
import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * The ownership conflict — a moment three brands could all plausibly claim.
 *
 * This is the portfolio question rather than the signal question. Proof and
 * Preparedness are effectively identical across the three candidates, because
 * they describe the same moment and the same supply chain. The only thing that
 * separates them is Permission.
 *
 * Pond's scores highest on raw brand fit and still loses. It is already running
 * an overlapping campaign, and the portfolio-conflict penalty takes its
 * Permission below Lakmé's. That is the intended behaviour: the brand with the
 * best fit is not automatically the right owner when the portfolio would end up
 * competing with itself.
 */

const overlapBlocker: DecisionBlocker = {
  code: "PORTFOLIO_CONFLICT_ACTIVE_GLOW_CAMPAIGN",
  severity: "remediable",
  message: "Pond's is already running an overlapping synthetic glow campaign in this window.",
  remediation:
    "Give ownership to a brand without an overlapping campaign, or separate the audience and proposition.",
};

const sharedReadiness = (brandId: string): PreparednessFor => () => ({
  productClaimAvailability: 70,
  inventoryService: 66,
  channelCoverage: 64,
  creatorAgencyReadiness: 68,
  rightsLegalApproval: 57,
  measurementReadiness: 72,
  evidenceIds: [`inv-${brandId}-national`],
  blockers: [],
});

export const beautyOwnershipConflict: UseCaseSource = {
  contractId: "contract-beauty-ownership-conflict",
  version: 1,
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "lakme",

  opportunity: {
    id: "opp-beauty-ownership-conflict",
    title: "Monsoon skin-glow moment",
    hypothesis:
      "A monsoon skin-dullness conversation is an ownable glow moment for one beauty brand.",
    signalClass: "emerging_shift",
    usefulUntil: "2026-09-30T18:30:00.000Z",
    evidence: [
      {
        id: "sig-glow-search",
        stance: "support",
        claim: "A dated public search snapshot shows rising monsoon skin-dullness interest.",
        evidenceType: "public",
        freshness: "recent",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=today%201-m&geo=IN&q=dull%20skin",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-glow-news",
        stance: "support",
        claim: "A dated public news-index snapshot provides a second independent source family.",
        evidenceType: "public",
        freshness: "recent",
        sourceUrl:
          "https://api.gdeltproject.org/api/v2/doc/doc?query=monsoon%20skin%20care&mode=artlist&format=html",
        capturedAt: "2026-08-15T08:06:00.000Z",
      },
      {
        id: "sig-glow-consumer",
        stance: "support",
        claim:
          "Invented aggregate consumer connects describe a monsoon dullness routine gap; this is not HUL research.",
        evidenceType: "synthetic_internal",
        freshness: "recent",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:10:00.000Z",
        synthetic: true,
      },
      {
        id: "sig-glow-portfolio",
        stance: "contradict",
        claim:
          "Invented aggregate campaign records show an active overlapping glow campaign already in market.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:14:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 72,
    independentCorroboration: 74,
    behavioralProgression: 66,
    diffusion: 70,
    commercialSignal: 64,
    freshnessQuality: 78,
    sourceConcentration: 10,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "lakme",
      displayName: "Lakmé",
      permission: {
        brandMeaning: 88,
        audienceOverlap: 84,
        distinctiveAssetFit: 80,
        historicalCredibility: 82,
        portfolioDistinctiveness: 74,
        culturalClaimsSafety: 78,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-lakme"],
        blockers: [],
      },
      preparedness: sharedReadiness("lakme"),
      portfolioConflicts: [],
    },
    {
      brandId: "ponds",
      displayName: "Pond's",
      permission: {
        // The strongest raw fit in the portfolio for this moment.
        brandMeaning: 90,
        audienceOverlap: 88,
        distinctiveAssetFit: 84,
        historicalCredibility: 86,
        portfolioDistinctiveness: 80,
        culturalClaimsSafety: 84,
        // ...and the reason raw fit is not the whole question.
        portfolioConflictPenalty: 10,
        evidenceIds: ["brand-memory-ponds"],
        blockers: [overlapBlocker],
      },
      preparedness: sharedReadiness("ponds"),
      portfolioConflicts: ["Active synthetic glow campaign already occupies this territory."],
    },
    {
      brandId: "simple",
      displayName: "Simple",
      permission: {
        brandMeaning: 70,
        audienceOverlap: 68,
        distinctiveAssetFit: 66,
        historicalCredibility: 70,
        portfolioDistinctiveness: 64,
        culturalClaimsSafety: 69,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-simple"],
        blockers: [],
      },
      preparedness: sharedReadiness("simple"),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Portfolio conflict penalty applied to the overlapping brand",
      value: 10,
      evidenceType: "business_assumption",
    },
    {
      label: "Proof and Preparedness are shared across candidates",
      value: "Same moment, same supply chain — so Permission is what decides the owner",
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
