import type { OpportunityContract } from "@/lib/contracts";
import { loadFixtureBundle } from "@/lib/fixtures/load-fixtures";

/**
 * Brand memory yield: how much of this decision is answerable from what the
 * organisation already recorded, versus what needs fresh research.
 *
 * This is the measure most at risk of becoming a flattering invented percentage,
 * so it is defined structurally rather than semantically. There is no similarity
 * score, no embedding, and no judgement call about whether a past decision is
 * "close enough". A question is answered if and only if a prior record with the
 * required shape exists. That makes the number checkable by hand.
 *
 * It is reported as a fraction first and a percentage second. Four out of six is
 * self-evidently honest in a way that sixty-seven per cent is not, and the
 * denominator being small is the point: an unanswered question is the system
 * stating what it does not know.
 */

export type MemoryQuestionId =
  | "brand-permission-precedent"
  | "claim-safety"
  | "portfolio-conflict"
  | "channel-effect-size"
  | "inventory-feasibility"
  | "measurement-design";

export interface MemoryQuestion {
  id: MemoryQuestionId;
  question: string;
  /** What a record must contain to count as answering this. */
  requires: string;
}

export const MEMORY_QUESTIONS: readonly MemoryQuestion[] = [
  {
    id: "brand-permission-precedent",
    question: "Has this brand been assessed for permission before?",
    requires: "A prior decision covering the same brand",
  },
  {
    id: "claim-safety",
    question: "Do we know which claims this brand may and may not make?",
    requires: "A brand-memory entry listing allowed and prohibited claims",
  },
  {
    id: "portfolio-conflict",
    question: "Do we know whether a sibling brand already occupies this territory?",
    requires: "A prior decision recording a portfolio conflict for a candidate",
  },
  {
    id: "channel-effect-size",
    question: "Do we know what effect size to expect in this channel?",
    requires: "A prior recorded outcome in the same channel",
  },
  {
    id: "inventory-feasibility",
    question: "Do we know whether supply can serve the demand this creates?",
    requires: "An operating record covering the scope being considered",
  },
  {
    id: "measurement-design",
    question: "Do we know how to measure this without designing a test from scratch?",
    requires: "A prior experiment using the same primary metric",
  },
] as const;

/**
 * What the organisation has retained. Assembled from contracts already decided
 * plus any experiment outcomes recorded against them.
 */
export interface MemoryCorpus {
  /** Brands that appear as a candidate in a prior decision. */
  assessedBrandIds: Set<string>;
  /** Brands with a claims entry in brand memory. */
  claimsKnownBrandIds: Set<string>;
  /** Brands recorded as conflicting with a sibling in a prior decision. */
  conflictedBrandIds: Set<string>;
  /** Channels with at least one recorded outcome. */
  channelsWithOutcomes: Set<string>;
  /** Scopes covered by an operating record. */
  scopesWithInventory: Set<string>;
  /** Primary metrics used by a prior experiment. */
  metricsWithDesigns: Set<string>;
}

export const EMPTY_CORPUS: MemoryCorpus = {
  assessedBrandIds: new Set(),
  claimsKnownBrandIds: new Set(),
  conflictedBrandIds: new Set(),
  channelsWithOutcomes: new Set(),
  scopesWithInventory: new Set(),
  metricsWithDesigns: new Set(),
};

/**
 * Builds the corpus from a set of prior contracts.
 *
 * `priorContracts` is deliberately a parameter rather than a global read: the
 * compounding claim is demonstrated by running this function over a smaller and
 * a larger slice of history, not by asserting that a number grows.
 */
export function buildCorpus(
  priorContracts: OpportunityContract[],
  knownClaimBrandIds: string[],
): MemoryCorpus {
  const corpus: MemoryCorpus = {
    assessedBrandIds: new Set(),
    claimsKnownBrandIds: new Set(knownClaimBrandIds),
    conflictedBrandIds: new Set(),
    channelsWithOutcomes: new Set(),
    scopesWithInventory: new Set(),
    metricsWithDesigns: new Set(),
  };

  for (const contract of priorContracts) {
    for (const assessment of contract.brandAssessments) {
      corpus.assessedBrandIds.add(assessment.brandId);
      if (assessment.portfolioConflicts?.length) {
        corpus.conflictedBrandIds.add(assessment.brandId);
      }
      for (const component of assessment.preparedness.components) {
        // An operating record is evidence that the scope was actually checked.
        for (const id of component.evidenceIds) {
          if (id.startsWith("inv-")) corpus.scopesWithInventory.add(id);
        }
      }
    }

    const sprint = contract.causalSprint;
    if (sprint) {
      corpus.metricsWithDesigns.add(sprint.primaryMetric);
      // Only a sprint that produced an outcome teaches an effect size.
      if (contract.outcome) corpus.channelsWithOutcomes.add(sprint.channel);
    }
  }

  return corpus;
}

export interface MemoryAnswer {
  question: MemoryQuestion;
  answered: boolean;
  /** The record that answers it, or what is missing. */
  detail: string;
}

export interface MemoryYield {
  answered: number;
  total: number;
  /** Rounded whole percent. Always presented after the fraction, never instead. */
  percent: number;
  answers: MemoryAnswer[];
}

export function computeMemoryYield(
  contract: OpportunityContract,
  corpus: MemoryCorpus,
): MemoryYield {
  const brandIds = contract.brandAssessments.map(({ brandId }) => brandId);
  const sprint = contract.causalSprint;

  const scopeEvidenceIds = contract.brandAssessments.flatMap((assessment) =>
    assessment.preparedness.components.flatMap((component) =>
      component.evidenceIds.filter((id) => id.startsWith("inv-")),
    ),
  );

  const check = (id: MemoryQuestionId): MemoryAnswer => {
    const question = MEMORY_QUESTIONS.find((item) => item.id === id)!;

    switch (id) {
      case "brand-permission-precedent": {
        const known = brandIds.filter((brandId) => corpus.assessedBrandIds.has(brandId));
        return {
          question,
          answered: known.length > 0,
          detail: known.length
            ? `${known.join(", ")} assessed in an earlier decision`
            : "No candidate here has been assessed before",
        };
      }
      case "claim-safety": {
        const known = brandIds.filter((brandId) => corpus.claimsKnownBrandIds.has(brandId));
        return {
          question,
          answered: known.length === brandIds.length && brandIds.length > 0,
          detail:
            known.length === brandIds.length
              ? "Claims recorded for every candidate"
              : `Claims missing for ${brandIds.filter((id) => !known.includes(id)).join(", ")}`,
        };
      }
      case "portfolio-conflict": {
        const known = brandIds.filter((brandId) => corpus.conflictedBrandIds.has(brandId));
        return {
          question,
          answered: known.length > 0,
          detail: known.length
            ? `${known.join(", ")} recorded in an overlapping territory before`
            : "No prior conflict recorded for these brands",
        };
      }
      case "channel-effect-size": {
        const channel = sprint?.channel;
        const answered = Boolean(channel && corpus.channelsWithOutcomes.has(channel));
        return {
          question,
          answered,
          detail: answered
            ? `A recorded outcome exists for ${channel}`
            : "No completed experiment in this channel yet",
        };
      }
      case "inventory-feasibility": {
        const known = scopeEvidenceIds.filter((id) => corpus.scopesWithInventory.has(id));
        return {
          question,
          answered: known.length > 0,
          detail: known.length
            ? `Operating records cover ${[...new Set(known)].length} of the cited cells`
            : "No operating record covers this scope",
        };
      }
      case "measurement-design": {
        const metric = sprint?.primaryMetric;
        const answered = Boolean(metric && corpus.metricsWithDesigns.has(metric));
        return {
          question,
          answered,
          detail: answered
            ? `A prior experiment used ${metric}`
            : "No prior experiment shares this primary metric",
        };
      }
    }
  };

  const answers = MEMORY_QUESTIONS.map(({ id }) => check(id));
  const answered = answers.filter((answer) => answer.answered).length;

  return {
    answered,
    total: MEMORY_QUESTIONS.length,
    percent: Math.round((answered / MEMORY_QUESTIONS.length) * 100),
    answers,
  };
}

/**
 * The compounding demonstration, run rather than asserted.
 *
 * Both figures come from the same function over different slices of history, so
 * the difference between them is a measurement rather than a claim.
 */
export function compareMemoryGrowth(
  contract: OpportunityContract,
  knownClaimBrandIds: string[],
): { firstDecision: MemoryYield; withHistory: MemoryYield } {
  const priors = loadFixtureBundle().contracts.filter(
    (candidate) => candidate.contractId !== contract.contractId,
  );

  return {
    // Nothing retained: what the very first decision in a category looks like.
    firstDecision: computeMemoryYield(contract, EMPTY_CORPUS),
    withHistory: computeMemoryYield(contract, buildCorpus(priors, knownClaimBrandIds)),
  };
}
