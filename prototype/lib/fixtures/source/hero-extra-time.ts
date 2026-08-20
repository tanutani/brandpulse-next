import type { DecisionBlocker } from "@/lib/contracts";
import type { PreparednessFor, UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Rexona · extra-time sweat confidence — the guided demo journey.
 *
 * The contract opens on the unresolved starting position: national scope with
 * unlicensed match footage, which routes to Watch. Narrowing scope and switching
 * to rights-safe creative is what earns Test, and that happens on the resolver
 * rather than being pre-baked here.
 *
 * These brand inputs are the single definition. The resolver reads the same
 * `preparedness` functions, so the two screens cannot show different numbers for
 * the same brand.
 */

const rightsBlocker: DecisionBlocker = {
  code: "RIGHTS_MATCH_FOOTAGE_UNAVAILABLE",
  severity: "mandatory",
  message: "Match footage is unlicensed for this demonstration package.",
  remediation: "Use original creator-led content without event footage, marks, or commentary audio.",
};

const conflictBlocker: DecisionBlocker = {
  code: "PORTFOLIO_CONFLICT_ACTIVE_GAME_NIGHT_TERRITORY",
  severity: "remediable",
  message: "Axe already occupies an overlapping synthetic game-night territory.",
  remediation: "Keep ownership with Rexona or separate the audience and proposition.",
};

/**
 * Shared operating readiness. Stock and channel reach are the same facts whoever
 * owns the moment, which is why Preparedness barely separates the candidates and
 * why the owner is chosen on Permission instead.
 */
const sharedPreparedness = (national: boolean, unlicensed: boolean) => ({
  productClaimAvailability: 90,
  inventoryService: national ? 58 : 96,
  channelCoverage: national ? 54 : 88,
  creatorAgencyReadiness: national ? 72 : 90,
  rightsLegalApproval: unlicensed ? 15 : 95,
  measurementReadiness: 90,
  evidenceIds: national
    ? ["inv-rex-national", unlicensed ? "rights-match-footage" : "rights-original-creator"]
    : [
        "inv-rex-mumbai",
        "inv-rex-delhi",
        "inv-rex-bengaluru",
        "inv-rex-hyderabad",
        "rights-original-creator",
      ],
  blockers: unlicensed ? [rightsBlocker] : [],
});

const preparednessFor =
  (overrides: (national: boolean) => Record<string, number> = () => ({})): PreparednessFor =>
  (scope, assetMode) => {
    const national = scope === "national";
    const unlicensed = assetMode === "unlicensed_match_footage";
    return { ...sharedPreparedness(national, unlicensed), ...overrides(national) };
  };

export const heroExtraTime: UseCaseSource = {
  contractId: "contract-extra-time-sweat-confidence",
  version: 1,
  actionMode: "bounded_test",
  portfolioContext: "hul_current",
  evaluatedAt: "2026-08-15T08:30:00.000Z",
  storedScope: "national",
  storedAssetMode: "unlicensed_match_footage",
  selectedBrandId: "rexona",

  opportunity: {
    id: "opp-extra-time-sweat-confidence",
    title: "Extra-time sweat confidence",
    hypothesis:
      "A late-match sports moment is creating a time-bound need around staying confident under heat and pressure.",
    signalClass: "live_moment",
    usefulUntil: "2026-08-17T06:30:00.000Z",
    evidence: [
      {
        id: "sig-hero-search",
        stance: "support",
        claim: "A dated public search snapshot shows directional category acceleration.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://trends.google.com/trends/explore?date=now%207-d&geo=IN&q=deodorant",
        capturedAt: "2026-08-15T08:00:00.000Z",
      },
      {
        id: "sig-hero-weather",
        stance: "support",
        claim: "A dated public weather snapshot supplies relevant heat and humidity context.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl: "https://mausam.imd.gov.in/",
        capturedAt: "2026-08-15T08:05:00.000Z",
      },
      {
        id: "sig-hero-news",
        stance: "support",
        claim: "A dated public news-index snapshot shows diffusion beyond search.",
        evidenceType: "public",
        freshness: "live",
        sourceUrl:
          "https://api.gdeltproject.org/api/v2/doc/doc?query=sport%20heat&mode=artlist&format=html",
        capturedAt: "2026-08-15T08:10:00.000Z",
      },
      {
        id: "sig-hero-consumer",
        stance: "support",
        claim:
          "Invented aggregate consumer connects repeat confidence despite sweat; this is not HUL research.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:15:00.000Z",
        synthetic: true,
      },
      {
        id: "sig-hero-commerce",
        stance: "contradict",
        claim:
          "Invented aggregate commerce progression is positive but weak and does not prove incrementality.",
        evidenceType: "synthetic_internal",
        freshness: "live",
        sourceUrl: null,
        capturedAt: "2026-08-15T08:20:00.000Z",
        synthetic: true,
      },
    ],
  },

  proof: {
    persistence: 70,
    independentCorroboration: 75,
    behavioralProgression: 60,
    diffusion: 70,
    commercialSignal: 55,
    freshnessQuality: 80,
    sourceConcentration: 0,
    manipulationRisk: 0,
  },

  brands: [
    {
      brandId: "rexona",
      displayName: "Rexona",
      permission: {
        brandMeaning: 96,
        audienceOverlap: 90,
        distinctiveAssetFit: 88,
        historicalCredibility: 92,
        portfolioDistinctiveness: 86,
        culturalClaimsSafety: 88,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-rexona"],
        blockers: [],
      },
      preparedness: preparednessFor(),
      portfolioConflicts: [],
    },
    {
      brandId: "dove",
      displayName: "Dove",
      permission: {
        brandMeaning: 68,
        audienceOverlap: 74,
        distinctiveAssetFit: 60,
        historicalCredibility: 70,
        portfolioDistinctiveness: 72,
        culturalClaimsSafety: 94,
        portfolioConflictPenalty: 0,
        evidenceIds: ["brand-memory-dove"],
        blockers: [],
      },
      preparedness: preparednessFor((national) => ({
        productClaimAvailability: 82,
        inventoryService: national ? 82 : 88,
        creatorAgencyReadiness: 78,
      })),
      portfolioConflicts: [],
    },
    {
      brandId: "axe",
      displayName: "Axe",
      permission: {
        brandMeaning: 74,
        audienceOverlap: 79,
        distinctiveAssetFit: 82,
        historicalCredibility: 70,
        portfolioDistinctiveness: 45,
        culturalClaimsSafety: 76,
        portfolioConflictPenalty: 8,
        evidenceIds: ["brand-memory-axe"],
        blockers: [conflictBlocker],
      },
      preparedness: preparednessFor((national) => ({
        productClaimAvailability: 84,
        inventoryService: national ? 90 : 86,
        creatorAgencyReadiness: 75,
      })),
      portfolioConflicts: ["Active synthetic game-night campaign creates ownership ambiguity."],
    },
  ],

  assumptions: [
    {
      label: "Current source concentration percentage",
      value: 0,
      evidenceType: "business_assumption",
    },
    {
      label: "Current manipulation risk percentage",
      value: 0,
      evidenceType: "business_assumption",
    },
    {
      label: "Later source-concentration sensitivity",
      value: { assumedPercent: 70, penaltyPoints: 14, calculation: "70 × 0.20 = 14" },
      evidenceType: "business_assumption",
    },
    {
      label: "All internal-like records are invented aggregates, not HUL facts",
      value: true,
      evidenceType: "business_assumption",
    },
  ],

  causalSprint: {
    id: "sprint-extra-time-four-city",
    hypothesis: "Rights-safe creator content will lift q-commerce conversion versus matched cells.",
    // Treatment and comparison cells must both sit inside HERO_READY_CELLS, or
    // validateSprint rejects the design as CELL_STOCK_NOT_READY.
    treatmentCells: ["Mumbai-West", "Bengaluru-Central"],
    comparisonCells: ["Delhi-South", "Hyderabad-Central"],
    channel: "q_commerce",
    budgetCapInr: 500000,
    primaryMetric: "incremental q-commerce conversion",
    measurementWindow: {
      start: "2026-08-15T18:30:00.000Z",
      end: "2026-08-18T18:30:00.000Z",
    },
    scaleThreshold: { incrementalEffectAtLeast: 0.01 },
    killThreshold: { incrementalEffectBelow: 0, serviceLevelBelow: 0.9 },
    validationStatus: "valid",
  },

  humanDecisions: [],
};
