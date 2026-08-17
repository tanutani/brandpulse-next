import { z } from "zod";

import fallbackFixture from "@/public/data/precomputed-synthesis.json";
import { SynthesisModelOutputSchema, SynthesisResponseSchema } from "@/lib/contracts/live-ai";
import type { FallbackReason, SynthesisResponse } from "@/lib/contracts/live-ai";
import { citesOnlyKnownEvidence } from "@/lib/evidence/evidence-registry";
import { SYNTHESIS_PROMPT_VERSION } from "@/lib/ai/synthesis-prompt";

/**
 * The checked-in synthesis. It satisfies exactly the same schema and the same
 * evidence-grounding rule as a live response, so the journey is identical
 * whether or not a provider is configured.
 */

const FallbackOutputSchema = SynthesisModelOutputSchema.extend({
  opportunityId: z.string().min(1),
}).strict();

const FallbackFixtureSchema = z
  .object({
    fixtureVersion: z.literal("1.0.0"),
    generatedAt: z.iso.datetime({ offset: true }),
    disclosure: z.string().min(1),
    outputs: z.array(FallbackOutputSchema).min(1),
  })
  .strict()
  .superRefine((fixture, context) => {
    fixture.outputs.forEach((output, index) => {
      const cited = [
        ...output.themes.flatMap((theme) => theme.evidenceIds),
        ...output.counterHypothesis.evidenceIds,
      ];
      if (!citesOnlyKnownEvidence(output.opportunityId, cited)) {
        context.addIssue({
          code: "custom",
          message: `Precomputed synthesis for ${output.opportunityId} cites evidence outside the approved set.`,
          path: ["outputs", index],
        });
      }
    });
  });

const parsedFixture = FallbackFixtureSchema.parse(fallbackFixture);

export const FALLBACK_DISCLOSURE = parsedFixture.disclosure;

export function hasFallbackSynthesis(opportunityId: string): boolean {
  return parsedFixture.outputs.some((output) => output.opportunityId === opportunityId);
}

/**
 * Returns the bundled synthesis as a full response, or null when no fixture
 * exists. Callers turn null into a 503; every other path stays on 200.
 */
export function buildFallbackSynthesis(
  opportunityId: string,
  fallbackReason: FallbackReason,
): SynthesisResponse | null {
  const output = parsedFixture.outputs.find((item) => item.opportunityId === opportunityId);
  if (!output) return null;

  return SynthesisResponseSchema.parse({
    summary: output.summary,
    themes: output.themes,
    counterHypothesis: output.counterHypothesis,
    missingEvidence: output.missingEvidence,
    mode: "precomputed_fallback",
    model: null,
    promptVersion: SYNTHESIS_PROMPT_VERSION,
    generatedAt: parsedFixture.generatedAt,
    fallbackReason,
  });
}
