/**
 * The designed parameter space, and the much smaller set actually scored.
 *
 * A model advertising twenty-five live parameters is less credible than one
 * advertising eight, not more: nobody can falsify a score with that many degrees
 * of freedom. So this file separates two claims that usually get blurred —
 * "we thought about this" and "this moves a number today" — and the drawer
 * renders the ratio rather than asserting a flattering one.
 *
 * Provenance is tracked per parameter because a judge asking "where does this
 * come from?" deserves a different answer for each:
 *   grounded  — rests on published marketing-science research, cited below.
 *   proposed  — our own design. Defensible, but ours, and labelled as such.
 */

export type ParameterProvenance = "grounded" | "proposed";

export type ParameterStageId =
  | "sense"
  | "define"
  | "build"
  | "launch"
  | "grow"
  | "renovate";

export interface ParameterStage {
  id: ParameterStageId;
  label: string;
  question: string;
  /** Which gate or output this stage feeds, in plain terms. */
  feeds: string;
}

export interface ModelParameter {
  id: string;
  stage: ParameterStageId;
  name: string;
  /** What this parameter asks, in one plain sentence. */
  question: string;
  provenance: ParameterProvenance;
  /** Present only for grounded parameters. Keys into CITATIONS. */
  citationId?: string;
  /** True when this parameter is computed and shown today. */
  scored: boolean;
  /** For scored parameters, why it earned its place. */
  earnsItsPlace?: string;
}

export const PARAMETER_STAGES: ParameterStage[] = [
  {
    id: "sense",
    label: "Sense and discover",
    question: "Is this signal real?",
    feeds: "Proof",
  },
  {
    id: "define",
    label: "Define and position",
    question: "Can we credibly speak to it?",
    feeds: "Permission",
  },
  {
    id: "build",
    label: "Build and test",
    question: "What is the smallest test that could actually settle this?",
    feeds: "The bounded experiment",
  },
  {
    id: "launch",
    label: "Launch",
    question: "How much should we commit, and when does that stop being safe?",
    feeds: "Preparedness and live guardrails",
  },
  {
    id: "grow",
    label: "Grow and scale",
    question: "Is it working, and is it working for the right reason?",
    feeds: "Outcome evaluation",
  },
  {
    id: "renovate",
    label: "Renovate or retire",
    question: "What should the organisation remember, and when is the model drifting?",
    feeds: "The learning record",
  },
];

export const MODEL_PARAMETERS: ModelParameter[] = [
  /* --- Stage 1 · Sense and discover ------------------------------------- */
  {
    id: "persistence",
    stage: "sense",
    name: "Persistence",
    question: "Has this outlived the event that started it?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Separates a moment from a spike, which is the first thing a router must do.",
  },
  {
    id: "independent-corroboration",
    stage: "sense",
    name: "Independent corroboration",
    question: "Do unrelated source families agree?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "One platform agreeing with itself is not evidence.",
  },
  {
    id: "behavioural-progression",
    stage: "sense",
    name: "Behavioural progression",
    question: "Has anyone moved from noticing to doing?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "This is the whole 'attention is not demand' claim, expressed as a number.",
  },
  {
    id: "diffusion",
    stage: "sense",
    name: "Diffusion",
    question: "Has it spread beyond where it started?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Distinguishes reach from a recommendation loop.",
  },
  {
    id: "commercial-signal",
    stage: "sense",
    name: "Commercial signal",
    question: "Is there any movement in baskets, not just in feeds?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "The only Proof input tied to money changing hands.",
  },
  {
    id: "freshness-quality",
    stage: "sense",
    name: "Freshness quality",
    question: "How dated is the evidence we are reasoning over?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "A stale observation and a live one should not weigh the same.",
  },
  {
    id: "source-concentration",
    stage: "sense",
    name: "Source concentration penalty",
    question: "How much of this rests on one source?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Does the work of telling a fad from a trend; visible on the sensitivity control.",
  },
  {
    id: "manipulation-risk",
    stage: "sense",
    name: "Manipulation risk penalty",
    question: "Could this have been bought rather than observed?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Seeded attention is indistinguishable from organic attention without this.",
  },
  {
    id: "confound-residual",
    stage: "sense",
    name: "Confound residual",
    question: "What remains after subtracting seasonality, weather and scheduled events?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "signal-half-life",
    stage: "sense",
    name: "Signal half-life",
    question: "How fast is this decaying, and what window does that imply?",
    provenance: "proposed",
    scored: false,
  },

  /* --- Stage 2 · Define and position ------------------------------------ */
  {
    id: "brand-meaning",
    stage: "define",
    name: "Brand meaning fit",
    question: "Does this sit inside what the brand already means?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "The largest weight in Permission, and the one that decides most owner questions.",
  },
  {
    id: "audience-overlap",
    stage: "define",
    name: "Audience overlap",
    question: "Are the people in this moment the people we serve?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "A relevant moment for the wrong audience is not an opportunity.",
  },
  {
    id: "distinctive-asset-fit",
    stage: "define",
    name: "Distinctive asset fit",
    question: "Can we execute using assets uniquely attributed to us?",
    provenance: "grounded",
    citationId: "romaniuk-2018",
    scored: true,
    earnsItsPlace: "Assets do the attribution work; without them the spend can credit a competitor.",
  },
  {
    id: "historical-credibility",
    stage: "define",
    name: "Historical credibility",
    question: "Have we earned the right to say this before?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Past permission is the cheapest evidence of future permission.",
  },
  {
    id: "portfolio-distinctiveness",
    stage: "define",
    name: "Portfolio distinctiveness",
    question: "Would this make us harder to tell apart from a sibling brand?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Turns a 400-brand portfolio from a list into a constraint.",
  },
  {
    id: "cultural-claims-safety",
    stage: "define",
    name: "Cultural and claims safety",
    question: "Is there a way to say this that is safe and substantiated?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Cheaper to ask before spend than after a complaint.",
  },
  {
    id: "portfolio-conflict-penalty",
    stage: "define",
    name: "Portfolio conflict penalty",
    question: "Is a sibling brand already occupying this territory?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Decides ownership when raw brand fit would pick the wrong brand.",
  },
  {
    id: "category-entry-point",
    stage: "define",
    name: "Category entry point match",
    question: "Does this attach to a real buying occasion, or only to a cultural topic?",
    provenance: "grounded",
    citationId: "romaniuk-sharp-2022",
    scored: false,
  },
  {
    id: "cannibalisation-distance",
    stage: "define",
    name: "Portfolio cannibalisation distance",
    question: "How far is this positioning from each sibling brand's territory?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "claim-substantiation-depth",
    stage: "define",
    name: "Claim substantiation depth",
    question: "How many days would it take to prove the claim this implies?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "meaning-stability",
    stage: "define",
    name: "Meaning stability",
    question: "Is the signal's meaning drifting under us?",
    provenance: "grounded",
    citationId: "sharp-2010",
    scored: false,
  },

  /* --- Stage 3 · Build and test ----------------------------------------- */
  {
    id: "cell-comparability",
    stage: "build",
    name: "Cell comparability",
    question: "Are the treatment and comparison cells actually alike?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "A comparison between unlike cells cannot support the word incremental.",
  },
  {
    id: "mde-vs-exposure",
    stage: "build",
    name: "Minimum detectable effect versus available exposure",
    question: "What is the smallest lift this test could actually detect?",
    provenance: "grounded",
    citationId: "binet-field-2013",
    scored: false,
  },
  {
    id: "contamination-risk",
    stage: "build",
    name: "Contamination risk",
    question: "Do delivery radii and media overlap leak treatment into control?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "rights-runway",
    stage: "build",
    name: "Rights runway",
    question: "How many days until the earliest clearance in the pack expires?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "pre-registration-completeness",
    stage: "build",
    name: "Pre-registration completeness",
    question: "What proportion of the decision rules were locked before exposure?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "creative-diversity",
    stage: "build",
    name: "Creative diversity index",
    question: "Are these genuinely different ideas or crops of one?",
    provenance: "proposed",
    scored: false,
  },

  /* --- Stage 4 · Launch ------------------------------------------------- */
  {
    id: "inventory-service",
    stage: "launch",
    name: "Inventory and service level",
    question: "Can we serve the demand this would create?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "The heaviest weight in Preparedness, and the one that blocks most often.",
  },
  {
    id: "channel-coverage",
    stage: "launch",
    name: "Channel coverage",
    question: "Can we reach these people where they actually buy?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "Reach without route-to-market is attention we cannot convert.",
  },
  {
    id: "rights-legal-approval",
    stage: "launch",
    name: "Rights and legal clearance",
    question: "Is every asset cleared for this use, in this window?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "The blocker that outranks every score, however high.",
  },
  {
    id: "esov",
    stage: "launch",
    name: "Excess share of voice",
    question: "Is our share of voice above our share of market?",
    provenance: "grounded",
    citationId: "binet-field-2013",
    scored: false,
  },
  {
    id: "burn-rate",
    stage: "launch",
    name: "Preparedness burn rate",
    question: "When does projected demand cross the service-level floor?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "crowding",
    stage: "launch",
    name: "Crowding at launch",
    question: "How many competitors are already inside this moment?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "gate-latency",
    stage: "launch",
    name: "Gate-decomposed latency",
    question: "Which gate is actually the bottleneck on time-to-decision?",
    provenance: "proposed",
    scored: false,
  },

  /* --- Stage 5 · Grow and scale ----------------------------------------- */
  {
    id: "share-of-search",
    stage: "grow",
    name: "Share of search",
    question: "Is our share of branded search rising or falling against the category?",
    provenance: "grounded",
    citationId: "binet-2020",
    scored: true,
    earnsItsPlace:
      "Free, published, weekly, and a leading rather than lagging measure — the only addition here that costs nothing to obtain.",
  },
  {
    id: "geographic-counterfactual",
    stage: "grow",
    name: "Incrementality against a geographic counterfactual",
    question: "Did exposed cells beat matched unexposed cells?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace: "The only design here that supports a causal reading, so it is the only one that earns the word.",
  },
  {
    id: "backlash-velocity",
    stage: "grow",
    name: "Backlash velocity",
    question: "How fast is negative sentiment changing, not how much there is?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "penetration-frequency",
    stage: "grow",
    name: "Penetration versus frequency split",
    question: "Are we recruiting new category buyers or re-hitting existing ones?",
    provenance: "grounded",
    citationId: "sharp-2010",
    scored: false,
  },
  {
    id: "creative-wearout",
    stage: "grow",
    name: "Creative wear-out",
    question: "Is engagement decaying per additional exposure?",
    provenance: "grounded",
    citationId: "binet-field-2013",
    scored: false,
  },

  /* --- Stage 6 · Renovate or retire ------------------------------------- */
  {
    id: "brand-memory-yield",
    stage: "renovate",
    name: "Brand memory yield",
    question: "How much of this decision could be answered from what we already know?",
    provenance: "proposed",
    scored: true,
    earnsItsPlace:
      "The only measure here that shows the system compounds with use rather than restarting each time.",
  },
  {
    id: "sos-divergence",
    stage: "renovate",
    name: "Share-of-search versus market-share divergence",
    question: "Has a sustained gap opened between what people search and what they buy?",
    provenance: "grounded",
    citationId: "binet-2020",
    scored: false,
  },
  {
    id: "decision-reversal-rate",
    stage: "renovate",
    name: "Decision reversal rate",
    question: "How often does the checker overturn the model, and on which gate?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "calibration-error",
    stage: "renovate",
    name: "Calibration error",
    question: "Are Proof scores still predicting the outcomes we observe?",
    provenance: "proposed",
    scored: false,
  },
  {
    id: "asset-erosion",
    stage: "renovate",
    name: "Distinctive asset erosion",
    question: "Is correct brand attribution of our assets declining over time?",
    provenance: "grounded",
    citationId: "romaniuk-2018",
    scored: false,
  },
];

export interface Citation {
  id: string;
  apa: string;
  /** What this source is actually used to support here. */
  usedFor: string;
}

export const CITATIONS: Citation[] = [
  {
    id: "binet-2020",
    apa: "Binet, L. (2020). Share of search: A fast, cheap, predictive metric [Conference presentation]. IPA EffWorks Global 2020, London, United Kingdom.",
    usedFor:
      "Share of organic branded search tracks market share and tends to lead it, giving a cheap early indicator.",
  },
  {
    id: "binet-field-2013",
    apa: "Binet, L., & Field, P. (2013). The long and the short of it: Balancing short and long-term marketing strategies. Institute of Practitioners in Advertising.",
    usedFor:
      "Excess share of voice, effect sizing and wear-out. IPA Databank analyses report roughly 0.5 to 0.7 percentage points of annual share growth per 10 points of positive ESOV, varying by category; the range is cited rather than a single figure.",
  },
  {
    id: "sharp-2010",
    apa: "Sharp, B. (2010). How brands grow: What marketers don't know. Oxford University Press.",
    usedFor: "Growth comes predominantly from penetration rather than from loyalty or frequency.",
  },
  {
    id: "romaniuk-sharp-2022",
    apa: "Romaniuk, J., & Sharp, B. (2022). How brands grow: Part 2 (Rev. ed.). Oxford University Press.",
    usedFor:
      "Category entry points: brands grow by being retrieved in buying situations, so a moment with no entry point is entertainment rather than marketing.",
  },
  {
    id: "romaniuk-2018",
    apa: "Romaniuk, J. (2018). Building distinctive brand assets. Oxford University Press.",
    usedFor: "Distinctive asset fame and uniqueness, and the erosion of correct attribution.",
  },
];

export function getCitation(id: string | undefined): Citation | null {
  return CITATIONS.find((citation) => citation.id === id) ?? null;
}

export function parametersForStage(stage: ParameterStageId): ModelParameter[] {
  return MODEL_PARAMETERS.filter((parameter) => parameter.stage === stage);
}

export interface CatalogueCounts {
  specified: number;
  scored: number;
  grounded: number;
}

/** Counted from the data rather than asserted, so the claim cannot drift. */
export function countParameters(): CatalogueCounts {
  return {
    specified: MODEL_PARAMETERS.length,
    scored: MODEL_PARAMETERS.filter((parameter) => parameter.scored).length,
    grounded: MODEL_PARAMETERS.filter((parameter) => parameter.provenance === "grounded").length,
  };
}
