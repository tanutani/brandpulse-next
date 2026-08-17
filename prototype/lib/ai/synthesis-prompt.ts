import type { SynthesisEvidenceRecord } from "@/lib/contracts/live-ai";

/** Bump when the instruction text or the requested JSON shape changes. */
export const SYNTHESIS_PROMPT_VERSION = "synthesis-1.0.0";

export const DEFAULT_SYNTHESIS_MODEL = "gemini-3.5-flash-lite";

/**
 * The complete instruction sent to the provider. There is no user-authored
 * prompt anywhere in this system: the caller supplies an opportunity ID and an
 * evidence version, and the server builds the rest from checked-in fixtures.
 */
export const SYNTHESIS_SYSTEM_INSTRUCTION = [
  "You are an evidence analyst for a brand decision system.",
  "You summarise and challenge evidence. You never decide anything.",
  "",
  "Hard rules:",
  "- Use only the numbered evidence supplied in the request. Never introduce an outside fact, statistic, brand, or source.",
  "- Every themes[].evidenceIds and counterHypothesis.evidenceIds entry must be an evidence id copied exactly from the supplied list.",
  "- Never state or imply a Proof, Permission, or Preparedness score, a route (act, test, incubate, watch, ignore), a blocker decision, an approval, a budget, a threshold, or a result.",
  "- Do not recommend an action. Describe what the evidence shows and what would disprove it.",
  "- Treat records marked synthetic as invented illustrative aggregates, not real observations.",
  "- Write plain professional English. No marketing language, no emoji, no headings.",
].join("\n");

export function buildEvidenceBlock(evidence: SynthesisEvidenceRecord[]): string {
  return evidence
    .map(
      (record) =>
        `- id: ${record.id} | stance: ${record.stance} | type: ${record.evidenceType} | freshness: ${record.freshness} | geography: ${record.geography}\n  claim: ${record.claim}`,
    )
    .join("\n");
}

export function buildSynthesisPrompt(
  hypothesis: string,
  evidence: SynthesisEvidenceRecord[],
): string {
  return [
    `Opportunity hypothesis under review: ${hypothesis}`,
    "",
    "Approved evidence:",
    buildEvidenceBlock(evidence),
    "",
    "Produce:",
    "1. summary — at most four sentences describing what this evidence does and does not establish.",
    "2. themes — one to four groupings of the evidence, each with a short label and the ids it covers.",
    "3. counterHypothesis — the strongest alternative explanation, with the ids that support that doubt.",
    "4. missingEvidence — up to four short descriptions of evidence that would resolve the remaining uncertainty.",
  ].join("\n");
}

/** Response schema handed to the provider so it returns bounded structured JSON. */
export const SYNTHESIS_RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    themes: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          evidenceIds: { type: "array", minItems: 1, maxItems: 8, items: { type: "string" } },
        },
        required: ["label", "evidenceIds"],
        propertyOrdering: ["label", "evidenceIds"],
      },
    },
    counterHypothesis: {
      type: "object",
      properties: {
        claim: { type: "string" },
        evidenceIds: { type: "array", minItems: 1, maxItems: 8, items: { type: "string" } },
      },
      required: ["claim", "evidenceIds"],
      propertyOrdering: ["claim", "evidenceIds"],
    },
    missingEvidence: { type: "array", maxItems: 4, items: { type: "string" } },
  },
  required: ["summary", "themes", "counterHypothesis", "missingEvidence"],
  propertyOrdering: ["summary", "themes", "counterHypothesis", "missingEvidence"],
} as const;
