import { SynthesisModelOutputSchema, SynthesisResponseSchema } from "@/lib/contracts/live-ai";
import type { FallbackReason, SynthesisRequest, SynthesisResponse } from "@/lib/contracts/live-ai";
import { buildFallbackSynthesis } from "@/lib/agents/fallback";
import { citesOnlyKnownEvidence, getApprovedEvidence } from "@/lib/evidence/evidence-registry";
import { loadFixtureBundle } from "@/lib/fixtures/load-fixtures";
import {
  DEFAULT_SYNTHESIS_MODEL,
  SYNTHESIS_PROMPT_VERSION,
  SYNTHESIS_RESPONSE_JSON_SCHEMA,
  SYNTHESIS_SYSTEM_INSTRUCTION,
  buildSynthesisPrompt,
} from "@/lib/ai/synthesis-prompt";
import { ProviderError, classifyProviderError, type SynthesisProvider } from "@/lib/ai/gemini-provider";

/**
 * Orchestrates one synthesis attempt.
 *
 * Every failure mode lands on the checked-in fallback, so the caller only ever
 * sees a valid SynthesisResponse (or null when even the fallback is missing).
 * A live response that cites an unknown evidence ID is treated as malformed —
 * a fluent answer that invents a source is worse than no answer.
 */

/** Total wall-clock allowance for the provider, including the single retry. */
export const SYNTHESIS_BUDGET_MS = 6_000;

/** Below this, a retry cannot realistically complete, so we fall back instead. */
const MIN_RETRY_BUDGET_MS = 1_200;

export interface SynthesisConfig {
  liveAiEnabled: boolean;
  apiKey: string | null;
  model: string;
}

export function readSynthesisConfig(
  env: Record<string, string | undefined> = process.env,
): SynthesisConfig {
  const demoMode = env.DEMO_MODE?.trim().toLowerCase();
  const liveFlag = env.LIVE_AI_ENABLED?.trim().toLowerCase() === "true";
  const apiKey = env.GEMINI_API_KEY?.trim();

  return {
    // Hybrid is the only mode that may reach a provider; static stays offline.
    liveAiEnabled: liveFlag && demoMode === "hybrid",
    apiKey: apiKey ? apiKey : null,
    model: env.BRANDPULSE_MODEL?.trim() || DEFAULT_SYNTHESIS_MODEL,
  };
}

export interface RunSynthesisOptions {
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

/** Rejects a response whose citations are not all approved evidence. */
function isGrounded(opportunityId: string, output: unknown): boolean {
  const parsed = SynthesisModelOutputSchema.safeParse(output);
  if (!parsed.success) return false;
  const cited = [
    ...parsed.data.themes.flatMap((theme) => theme.evidenceIds),
    ...parsed.data.counterHypothesis.evidenceIds,
  ];
  return citesOnlyKnownEvidence(opportunityId, cited);
}

async function attemptLive(
  opportunityId: string,
  provider: SynthesisProvider,
  model: string,
  remainingMs: number,
): Promise<string> {
  const hypothesis = getHypothesis(opportunityId);
  if (hypothesis === null) throw new ProviderError("fatal", "Unknown opportunity.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), remainingMs);
  try {
    return await provider({
      model,
      systemInstruction: SYNTHESIS_SYSTEM_INSTRUCTION,
      prompt: buildSynthesisPrompt(hypothesis, getApprovedEvidence(opportunityId)),
      jsonSchema: SYNTHESIS_RESPONSE_JSON_SCHEMA,
      signal: controller.signal,
    });
  } catch (error) {
    // A provider that ignores the signal still has to be treated as timed out.
    throw controller.signal.aborted
      ? new ProviderError("timeout", "Provider request timed out.")
      : classifyProviderError(error);
  } finally {
    clearTimeout(timer);
  }
}

export async function runSynthesis(
  request: SynthesisRequest,
  options: RunSynthesisOptions,
): Promise<SynthesisResponse | null> {
  const { config, provider } = options;
  const now = options.now ?? Date.now;
  const timestamp = options.timestamp ?? (() => new Date().toISOString());
  const budgetMs = options.budgetMs ?? SYNTHESIS_BUDGET_MS;

  const fallback = (reason: FallbackReason) =>
    buildFallbackSynthesis(request.opportunityId, reason);

  // The URL flag outranks the server config: it can only ever remove network access.
  if (request.forceStatic) return fallback("disabled");
  if (!config.liveAiEnabled) return fallback("disabled");
  if (!config.apiKey || !provider) return fallback("missing_key");

  const deadline = now() + budgetMs;
  let lastReason: FallbackReason = "invalid_output";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const remainingMs = deadline - now();
    if (remainingMs <= 0) return fallback("timeout");

    try {
      const raw = await attemptLive(request.opportunityId, provider, config.model, remainingMs);

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(raw);
      } catch {
        return fallback("invalid_output");
      }

      if (!isGrounded(request.opportunityId, parsedJson)) return fallback("invalid_output");

      const output = SynthesisModelOutputSchema.parse(parsedJson);
      return SynthesisResponseSchema.parse({
        ...output,
        mode: "live",
        model: config.model,
        promptVersion: SYNTHESIS_PROMPT_VERSION,
        generatedAt: timestamp(),
      });
    } catch (error) {
      // A malformed body is deterministic; only transport failures are worth retrying.
      const failure = error instanceof ProviderError ? error : classifyProviderError(error);
      // The contract's reason enum has no dedicated "provider unavailable" value,
      // so 5xx and abort both report as timeout: no answer arrived in the budget.
      lastReason =
        failure.kind === "quota"
          ? "quota"
          : failure.kind === "transient" || failure.kind === "timeout"
            ? "timeout"
            : "invalid_output";

      const retryable = failure.kind !== "fatal";
      const budgetLeft = deadline - now();
      if (!retryable || attempt === 1 || budgetLeft < MIN_RETRY_BUDGET_MS) {
        return fallback(lastReason);
      }
    }
  }

  return fallback(lastReason);
}
