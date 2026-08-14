import { z } from "zod";

import fallbackFixture from "@/public/data/precomputed-synthesis.json";

const AgentTraceSchema = z.object({
  evidenceType: z.literal("model_inference"),
  generatedFrom: z.array(z.string()).optional(),
  alternativeExplanation: z.string().optional(),
  sensitivityNote: z.string().optional(),
  rationale: z.string().optional(),
});

const SynthesisOutputSchema = z.object({
  opportunityId: z.string(),
  mode: z.literal("precomputed_fallback"),
  summary: z.string(),
  strongestSupport: z.array(z.string()),
  strongestCounterEvidence: z.array(z.string()).min(1),
  missingEvidence: z.array(z.string()),
  evidenceAnalyst: AgentTraceSchema,
  skeptic: AgentTraceSchema,
  experimentArchitect: AgentTraceSchema.optional(),
});

const FallbackFixtureSchema = z.object({
  fixtureVersion: z.literal("1.0.0"),
  generatedAt: z.iso.datetime({ offset: true }),
  disclosure: z.string(),
  outputs: z.array(SynthesisOutputSchema).min(1),
});

export type PrecomputedSynthesis = z.infer<typeof SynthesisOutputSchema>;

const parsedFixture = FallbackFixtureSchema.parse(fallbackFixture);

export const precomputedSynthesis = parsedFixture.outputs;

export function getFallbackSynthesis(opportunityId: string): PrecomputedSynthesis {
  const output = precomputedSynthesis.find((item) => item.opportunityId === opportunityId);
  if (!output) {
    throw new Error(`No bundled synthesis for opportunity: ${opportunityId}`);
  }
  return output;
}

export function createDegradedSynthesisResponse(
  opportunityId: string,
  reason: "provider_unavailable" | "timeout" | "invalid_response" = "provider_unavailable",
) {
  return {
    ...getFallbackSynthesis(opportunityId),
    degraded: true as const,
    degradedReason: reason,
    disclosure: parsedFixture.disclosure,
  };
}
