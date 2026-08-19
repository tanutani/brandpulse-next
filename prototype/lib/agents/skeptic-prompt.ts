import type { SynthesisEvidenceRecord } from "@/lib/contracts/live-ai";
import { buildEvidenceBlock } from "@/lib/ai/synthesis-prompt";

/** Bump when the instruction text or the requested JSON shape changes. */
export const SKEPTIC_PROMPT_VERSION = "skeptic-1.0.0";

/**
 * The Skeptic argues the case against the recommendation.
 *
 * It is generated rather than written because the counter-case has to follow
 * whatever the evidence chain currently says — a static paragraph would still
 * claim the same doubts after the evidence that caused them had changed.
 */
export const SKEPTIC_SYSTEM_INSTRUCTION = [
  "You are the designated skeptic in a brand decision review.",
  "Your only job is to argue why the current reading of the evidence could be wrong.",
  "",
  "Hard rules:",
  "- Use only the numbered evidence supplied. Never introduce an outside fact, statistic, brand, or source.",
  "- Every evidenceIds entry must be an id copied exactly from the supplied list.",
  "- Never state or imply a Proof, Permission, or Preparedness score, a route, a blocker, an approval, a budget, a threshold, or a result.",
  "- Do not recommend an action and do not tell anyone what to decide.",
  "- Attack the reasoning, not the people. No rhetoric, no hedging filler.",
  "- Treat records marked synthetic as invented illustrative aggregates, not real observations.",
  "- Prefer alternative explanations that the supplied evidence cannot rule out.",
  "- Write plain professional English. No marketing language, no emoji, no headings.",
].join("\n");

export function buildSkepticPrompt(
  hypothesis: string,
  evidence: SynthesisEvidenceRecord[],
): string {
  return [
    `The reading under challenge: ${hypothesis}`,
    "",
    "Evidence chain behind that reading:",
    buildEvidenceBlock(evidence),
    "",
    "Produce:",
    "1. headline — one sentence naming the single biggest reason this could be wrong.",
    "2. challenges — one to four specific objections. For each:",
    "   - claim: the alternative explanation the evidence cannot currently rule out.",
    "   - wouldChangeDecisionIf: the observation that would settle this objection either way.",
    "   - evidenceIds: the ids this objection is drawn from.",
  ].join("\n");
}

export const SKEPTIC_RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" },
    challenges: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          wouldChangeDecisionIf: { type: "string" },
          evidenceIds: { type: "array", minItems: 1, maxItems: 8, items: { type: "string" } },
        },
        required: ["claim", "wouldChangeDecisionIf", "evidenceIds"],
        propertyOrdering: ["claim", "wouldChangeDecisionIf", "evidenceIds"],
      },
    },
  },
  required: ["headline", "challenges"],
  propertyOrdering: ["headline", "challenges"],
} as const;
