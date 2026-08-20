import type { DecisionBlocker } from "@/lib/contracts";
import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * The real trend that cannot be entered yet — the Incubate case.
 *
 * pH and "harsh chemicals" discourse around cleansers is durable, corroborated
 * and commercially live. Dove has the standing to speak to it. What stops the
 * decision is that entering the conversation means making a comparative,
 * substantiation-grade claim, and no approved substantiation exists on file.
 *
 * Incubate is the honest answer: the trend is real and worth building toward,
 * but the work is claim development, not a campaign. What actually kills a short
 * window is not whether a claim is true but how many days it takes to prove.
 *
 * The blocker is advisory rather than mandatory on purpose. A mandatory blocker
 * would route this to Watch, which would say "wait and see" when the correct
 * instruction is "start the substantiation work now".
 */

const claimDepthNote: DecisionBlocker = {
  code: "COMPARATIVE_PH_CLAIM_NEEDS_SUBSTANTIATION",
  severity: "advisory",
  message:
    "Entering this conversation implies a comparative pH claim with no approved substantiation on file.",
  remediation:
    "Complete comparative substantiation testing and legal review before any claim-bearing creative.",
};

const claimConstrained =
  (values: Omit<ReturnType<PreparednessFor>, "evidenceIds" | "blockers">, brandId: string): PreparednessFor =>
  () => ({ ...values, evidenceIds: [`brand-memory-${brandId}`], blockers: [claimDepthNote] });

export const phCleanserDiscourse: UseCaseSource = {
  contractId: "contract-ph-cleanser-discourse",
  version: 1,
  actionMode: "capability_build",
  portfolioContext: "hul_current",
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "rights_safe_creator",
  selectedBrandId: "dove",

  opportunity: {
    id: "opp-ph-cleanser-discourse",
    title: "pH and harsh-chemicals discourse",
    hypothesis:
      "Durable consumer scrutiny of cleanser pH is an opening for a substantiated gentleness position.",
    signalClass: "durable_trend",
    usefulUntil: "2026-12-31T18:30:00.000Z",
    evidence: [
      {
        id: "sig-ph-search",
        stance: "support",
        claim:
          "A dated public search snapshot shows sustained interest in cleanser pH over three months.",
        evidenceType: "public",
        freshness: "recent",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=today%203-m&geo=IN&q=soap%20ph",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-ph-news",
        stance: "support",
        claim: "A dated public news-index snapshot supplies a second independent source family.",
        evidenceType: "public",
        freshness: "recent",
        sourceUrl:
          "https://api.gdeltproject.org/api/v2/doc/doc?query=soap%20ph%20skin&mode=artlist&format=html",
        capturedAt: "2026-08-15T08:08:00.000Z",
      },
      {
        id: "sig-ph-appeal-2021",
        stance: "contradict",
        claim:
          "The Bombay High Court appeal order dated 21 January 2021 permitted parts of the comparison to continue, subject to restrictions. It was an interlocutory order, not a final merits judgment.",
        evidenceType: "public",
        freshness: "aging",
        sourceUrl: "https://indiankanoon.org/doc/183690875/",
        capturedAt: "2026-08-15T08:12:00.000Z",
      },
      {
        id: "sig-ph-interim-2022",
        stance: "contradict",
        claim:
          "The Bombay High Court interim decision dated 16 June 2022 restrained the impugned comparative campaign pending the suit. It did not finally decide the suit on its merits.",
        evidenceType: "public",
        freshness: "aging",
        sourceUrl: "https://indiankanoon.org/doc/102784225/",
        capturedAt: "2026-08-15T08:13:00.000Z",
      },
      {
        id: "sig-ph-consumer",
        stance: "support",
        claim:
          "Invented aggregate consumer connects describe ingredient scrutiny before purchase; this is not HUL research.",
        evidenceType: "synthetic_internal",
        freshness: "recent",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:16:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 86,
    independentCorroboration: 84,
    behavioralProgression: 72,
    diffusion: 78,
    commercialSignal: 62,
    freshnessQuality: 80,
    sourceConcentration: 8,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "dove",
      displayName: "Dove",
      permission: {
        brandMeaning: 90,
        audienceOverlap: 86,
        distinctiveAssetFit: 80,
        historicalCredibility: 88,
        portfolioDistinctiveness: 76,
        culturalClaimsSafety: 77,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-dove"],
        blockers: [],
      },
      preparedness: claimConstrained(
        {
          productClaimAvailability: 22,
          inventoryService: 55,
          channelCoverage: 48,
          creatorAgencyReadiness: 45,
          rightsLegalApproval: 53,
          measurementReadiness: 60,
        },
        "dove",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "lux",
      displayName: "Lux",
      permission: {
        brandMeaning: 78,
        audienceOverlap: 80,
        distinctiveAssetFit: 72,
        historicalCredibility: 74,
        portfolioDistinctiveness: 68,
        culturalClaimsSafety: 74,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-lux"],
        blockers: [],
      },
      preparedness: claimConstrained(
        {
          productClaimAvailability: 18,
          inventoryService: 52,
          channelCoverage: 44,
          creatorAgencyReadiness: 42,
          rightsLegalApproval: 45,
          measurementReadiness: 58,
        },
        "lux",
      ),
      portfolioConflicts: [],
    },
    {
      brandId: "pears",
      displayName: "Pears",
      permission: {
        brandMeaning: 74,
        audienceOverlap: 72,
        distinctiveAssetFit: 70,
        historicalCredibility: 76,
        portfolioDistinctiveness: 64,
        culturalClaimsSafety: 76,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-pears"],
        blockers: [],
      },
      preparedness: claimConstrained(
        {
          productClaimAvailability: 16,
          inventoryService: 50,
          channelCoverage: 42,
          creatorAgencyReadiness: 40,
          rightsLegalApproval: 43,
          measurementReadiness: 56,
        },
        "pears",
      ),
      portfolioConflicts: [],
    },
  ],

  assumptions: [
    {
      label: "Days to substantiate a comparative pH claim",
      value: "estimated 60-90, longer than any live window",
      evidenceType: "business_assumption",
    },
    {
      label: "Litigation precedent is cited from the public record, not from HUL counsel",
      value: true,
      evidenceType: "business_assumption",
    },
    {
      label: "Claims capability instruction",
      value: "Incubate — blocked on claims; build substantiation and legal-review capability before activation",
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
