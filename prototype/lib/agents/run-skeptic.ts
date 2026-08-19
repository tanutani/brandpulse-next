import {
  SkepticModelOutputSchema,
  SkepticResponseSchema,
} from "@/lib/contracts/live-ai";
import type { SkepticRequest, SkepticResponse } from "@/lib/contracts/live-ai";
import { runBounded } from "@/lib/ai/bounded-attempt";
import { buildFallbackSkeptic } from "@/lib/agents/skeptic-fallback";
import { citesOnlyKnownEvidence, getApprovedEvidence } from "@/lib/evidence/evidence-registry";
import { loadFixtureBundle } from "@/lib/fixtures/load-fixtures";
import type { SynthesisProvider } from "@/lib/ai/gemini-provider";
import type { SynthesisConfig } from "@/lib/ai/synthesize";
import {
  SKEPTIC_PROMPT_VERSION,
  SKEPTIC_RESPONSE_JSON_SCHEMA,
  SKEPTIC_SYSTEM_INSTRUCTION,
  buildSkepticPrompt,
} from "@/lib/agents/skeptic-prompt";

/**
 * Generates the counter-case live from the current evidence chain.
 *
 * Same discipline as the synthesis boundary: bounded budget, silent fallback to
 * the checked-in counter-case, and a hard rejection of any challenge that cites
 * evidence outside the approved set. A skeptic that invents its doubts is worse
 * than one that repeats known doubts.
 */

export interface RunSkepticOptions {
  config: SynthesisConfig;
  provider: SynthesisProvider | null;
  now?: () => number;
  timestamp?: () => string;
  budgetMs?: number;
}

function getHypothesis(opportunityId: string): string | null {
  const contract = loadFixtureBundle().contracts.find(
    ({ opportunity }) => opportunity.id === opportunityId,
  );
  return contract?.opportunity.hypothesis ?? null;
}

function isGrounded(opportunityId: string, raw: string): boolean {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return false;
  }

  const parsed = SkepticModelOutputSchema.safeParse(parsedJson);
  if (!parsed.success) return false;

  const cited = parsed.data.challenges.flatMap((challenge) => challenge.evidenceIds);
  return citesOnlyKnownEvidence(opportunityId, cited);
}

export async function runSkeptic(
  request: SkepticRequest,
  options: RunSkepticOptions,
): Promise<SkepticResponse | null> {
  const { config, provider } = options;
  const timestamp = options.timestamp ?? (() => new Date().toISOString());
  const fallback = (reason: Parameters<typeof buildFallbackSkeptic>[1]) =>
    buildFallbackSkeptic(request.opportunityId, reason);

  if (request.forceStatic) return fallback("disabled");
  if (!config.liveAiEnabled) return fallback("disabled");
  if (!config.apiKey || !provider) return fallback("missing_key");

  const hypothesis = getHypothesis(request.opportunityId);
  if (hypothesis === null) return fallback("invalid_output");

  const evidence = getApprovedEvidence(request.opportunityId);

  const result = await runBounded<string>({
    budgetMs: options.budgetMs,
    now: options.now,
    attempt: (_remainingMs, signal) =>
      provider({
        model: config.model,
        systemInstruction: SKEPTIC_SYSTEM_INSTRUCTION,
        prompt: buildSkepticPrompt(hypothesis, evidence),
        jsonSchema: SKEPTIC_RESPONSE_JSON_SCHEMA,
        signal,
      }),
    validate: (raw) => isGrounded(request.opportunityId, raw),
  });

  if (!result.ok) return fallback(result.reason);

  try {
    const output = SkepticModelOutputSchema.parse(JSON.parse(result.value));
    return SkepticResponseSchema.parse({
      ...output,
      mode: "live",
      model: config.model,
      promptVersion: SKEPTIC_PROMPT_VERSION,
      generatedAt: timestamp(),
    });
  } catch {
    // isGrounded already parsed this once, so reaching here means the response
    // changed shape between checks; treat it as unusable rather than trusting it.
    return fallback("invalid_output");
  }
}
