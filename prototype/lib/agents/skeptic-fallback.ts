import { z } from "zod";

import fallbackFixture from "@/public/data/precomputed-skeptic.json";
import { SkepticModelOutputSchema, SkepticResponseSchema } from "@/lib/contracts/live-ai";
import type { FallbackReason, SkepticResponse } from "@/lib/contracts/live-ai";
import { citesOnlyKnownEvidence } from "@/lib/evidence/evidence-registry";
import { SKEPTIC_PROMPT_VERSION } from "@/lib/agents/skeptic-prompt";

/**
 * The checked-in counter-case. Same schema and same evidence-grounding rule as
 * a live one, so a provider outage changes the wording on screen and nothing
 * else about the journey.
 */

const FallbackOutputSchema = SkepticModelOutputSchema.extend({
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
      const cited = output.challenges.flatMap((challenge) => challenge.evidenceIds);
      if (!citesOnlyKnownEvidence(output.opportunityId, cited)) {
        context.addIssue({
          code: "custom",
          message: `Precomputed skeptic for ${output.opportunityId} cites evidence outside the approved set.`,
          path: ["outputs", index],
        });
      }
    });
  });

const parsedFixture = FallbackFixtureSchema.parse(fallbackFixture);

export const SKEPTIC_FALLBACK_DISCLOSURE = parsedFixture.disclosure;

export function buildFallbackSkeptic(
  opportunityId: string,
  fallbackReason: FallbackReason,
): SkepticResponse | null {
  const output = parsedFixture.outputs.find((item) => item.opportunityId === opportunityId);
  if (!output) return null;

  return SkepticResponseSchema.parse({
    headline: output.headline,
    challenges: output.challenges,
    mode: "precomputed_fallback",
    model: null,
    promptVersion: SKEPTIC_PROMPT_VERSION,
    generatedAt: parsedFixture.generatedAt,
    fallbackReason,
  });
}
