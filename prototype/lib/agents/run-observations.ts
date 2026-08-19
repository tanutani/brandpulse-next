import {
  ObservationModelOutputSchema,
  ObservationResponseSchema,
  REPLAY_DURATION_MS,
} from "@/lib/contracts/live-ai";
import type {
  FallbackReason,
  ObservationRequest,
  ObservationResponse,
  SignalObservation,
} from "@/lib/contracts/live-ai";
import { runBounded } from "@/lib/ai/bounded-attempt";
import { fetchGdeltArticles, type ArticleFetcher, type LiveArticle } from "@/lib/agents/gdelt-client";
import { readCachedArticles, writeCachedArticles } from "@/lib/agents/gdelt-cache";
import {
  OBSERVATION_QUERIES,
  OBSERVATION_RESPONSE_JSON_SCHEMA,
  OBSERVATION_SYSTEM_INSTRUCTION,
  buildObservationPrompt,
} from "@/lib/agents/observation-prompt";
import { getSignalReplay } from "@/lib/signals/signal-replay";
import type { SynthesisProvider } from "@/lib/ai/gemini-provider";
import type { SynthesisConfig } from "@/lib/ai/synthesize";

/**
 * Fetches live public articles from GDELT and turns them into observations.
 *
 * Two live hops share one budget: the open GDELT read, then a Gemini pass that
 * structures the headlines. Either can fail, and both fall back to the same
 * checked-in replay the offline demo uses.
 *
 * A live observation is evidence we noticed, not evidence we accepted. These
 * records are shown and labelled, but they never enter the approved evidence
 * registry and therefore never reach Proof, Permission, Preparedness, or any
 * route. The deterministic scoring stays on the frozen fixture set.
 */

/** Live articles carry a distinct prefix so no live id can collide with a fixture id. */
const LIVE_EVIDENCE_PREFIX = "live-gdelt";

export interface RunObservationsOptions {
  config: SynthesisConfig;
  provider: SynthesisProvider | null;
  fetchArticles?: ArticleFetcher;
  now?: () => number;
  timestamp?: () => string;
  budgetMs?: number;
}

/** The checked-in replay, reshaped as observations. Identical to the offline path. */
function fixtureObservations(opportunityId: string): SignalObservation[] | null {
  const replay = getSignalReplay(opportunityId);
  if (!replay) return null;

  return replay.events.map((event) => ({
    id: event.id,
    offsetMs: event.offsetMs,
    sourceType: event.sourceType,
    label: event.label,
    detail: event.detail,
    value: event.value,
    evidenceIds: event.evidenceIds,
    evidenceType: event.evidenceType,
    synthetic: event.synthetic,
  }));
}

function buildFallback(
  opportunityId: string,
  reason: FallbackReason,
  generatedAt: string,
): ObservationResponse | null {
  const observations = fixtureObservations(opportunityId);
  if (!observations) return null;

  return ObservationResponseSchema.parse({
    mode: "fixture_fallback",
    observations,
    model: null,
    query: null,
    generatedAt,
    fallbackReason: reason,
  });
}

/**
 * Spaces observations evenly across the replay window so the live path animates
 * exactly like the fixture path a judge may have seen in rehearsal.
 */
function offsetFor(index: number, total: number): number {
  if (total <= 1) return 0;
  return Math.round((index / (total - 1)) * REPLAY_DURATION_MS);
}

/**
 * Fills the article cache ahead of the click, off the interactive path.
 *
 * Nobody is waiting on this, so it gets a budget matched to GDELT's real
 * latency rather than the six-second demo allowance. Failure is silent and
 * expected: an unwarmed cache simply means the click falls back.
 */
export const PREWARM_BUDGET_MS = 20_000;

export async function prewarmObservations(
  opportunityId: string,
  options: Pick<RunObservationsOptions, "config" | "fetchArticles" | "budgetMs" | "now">,
): Promise<boolean> {
  const { config } = options;
  if (!config.liveAiEnabled || !config.apiKey) return false;

  const query = OBSERVATION_QUERIES[opportunityId];
  if (!query) return false;
  if (readCachedArticles(query)) return true;

  const fetchArticles = options.fetchArticles ?? fetchGdeltArticles;
  const fetched = await runBounded<LiveArticle[]>({
    budgetMs: options.budgetMs ?? PREWARM_BUDGET_MS,
    now: options.now,
    attempt: (_remainingMs, signal) => fetchArticles(query, signal),
    validate: (result) => result.length > 0,
  });
  if (!fetched.ok) return false;

  writeCachedArticles(query, fetched.value);
  return true;
}

export async function runObservations(
  request: ObservationRequest,
  options: RunObservationsOptions,
): Promise<ObservationResponse | null> {
  const { config, provider } = options;
  const timestamp = options.timestamp ?? (() => new Date().toISOString());
  const fetchArticles = options.fetchArticles ?? fetchGdeltArticles;
  const fallback = (reason: FallbackReason) =>
    buildFallback(request.opportunityId, reason, timestamp());

  if (request.forceStatic) return fallback("disabled");
  if (!config.liveAiEnabled) return fallback("disabled");
  if (!config.apiKey || !provider) return fallback("missing_key");

  const query = OBSERVATION_QUERIES[request.opportunityId];
  if (!query) return fallback("invalid_output");

  // A warm cache is the normal interactive path: GDELT is far slower than the
  // budget allows, so the read happens in the background before the click.
  let articles: LiveArticle[];
  const cached = readCachedArticles(query);

  if (cached) {
    articles = cached.articles;
  } else {
    const fetched = await runBounded<LiveArticle[]>({
      budgetMs: options.budgetMs,
      now: options.now,
      attempt: (_remainingMs, signal) => fetchArticles(query, signal),
      validate: (result) => result.length > 0,
    });
    if (!fetched.ok) return fallback(fetched.reason);
    articles = fetched.value;
    writeCachedArticles(query, articles);
  }

  const extracted = await runBounded<string>({
    budgetMs: options.budgetMs,
    now: options.now,
    attempt: (_remainingMs, signal) =>
      provider({
        model: config.model,
        systemInstruction: OBSERVATION_SYSTEM_INSTRUCTION,
        prompt: buildObservationPrompt(articles),
        jsonSchema: OBSERVATION_RESPONSE_JSON_SCHEMA,
        signal,
      }),
    validate: (raw) => {
      try {
        const parsed = ObservationModelOutputSchema.safeParse(JSON.parse(raw));
        // Every observation must point at an article we actually retrieved.
        return (
          parsed.success &&
          parsed.data.observations.every(({ articleIndex }) => articleIndex < articles.length)
        );
      } catch {
        return false;
      }
    },
  });
  if (!extracted.ok) return fallback(extracted.reason);

  try {
    const output = ObservationModelOutputSchema.parse(JSON.parse(extracted.value));
    const total = output.observations.length;

    const observations: SignalObservation[] = output.observations.map((item, index) => {
      const article = articles[item.articleIndex];
      return {
        id: `${LIVE_EVIDENCE_PREFIX}-${index + 1}`,
        offsetMs: offsetFor(index, total),
        sourceType: item.sourceType,
        label: item.label,
        detail: item.detail,
        value: article.domain,
        evidenceIds: [`${LIVE_EVIDENCE_PREFIX}-${item.articleIndex + 1}`],
        // Live public articles are public evidence by definition, and never
        // synthetic — the synthetic flag is reserved for invented aggregates.
        evidenceType: "public" as const,
        synthetic: false,
        sourceUrl: article.url,
        sourceDomain: article.domain,
      };
    });

    return ObservationResponseSchema.parse({
      mode: "live",
      observations,
      model: config.model,
      query,
      generatedAt: timestamp(),
    });
  } catch {
    return fallback("invalid_output");
  }
}
