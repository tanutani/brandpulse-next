import type { SynthesisResponse } from "@/lib/contracts/live-ai";

/**
 * A tiny in-process cache so repeated visits inside one demo session do not
 * re-bill a provider call. Deliberately not a database: it is bounded, in
 * memory, and safe to lose.
 */

const TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 16;

interface CacheEntry {
  response: SynthesisResponse;
  expiresAt: number;
}

const entries = new Map<string, CacheEntry>();

const keyFor = (opportunityId: string, evidenceVersion: string) =>
  `${opportunityId}::${evidenceVersion}`;

export function readCachedSynthesis(
  opportunityId: string,
  evidenceVersion: string,
  now: number = Date.now(),
): SynthesisResponse | null {
  const key = keyFor(opportunityId, evidenceVersion);
  const entry = entries.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now) {
    entries.delete(key);
    return null;
  }
  return entry.response;
}

/** Only live responses are worth caching; the fallback is already local. */
export function writeCachedSynthesis(
  opportunityId: string,
  evidenceVersion: string,
  response: SynthesisResponse,
  now: number = Date.now(),
): void {
  if (response.mode !== "live") return;

  if (entries.size >= MAX_ENTRIES) {
    const oldest = entries.keys().next();
    if (!oldest.done) entries.delete(oldest.value);
  }
  entries.set(keyFor(opportunityId, evidenceVersion), {
    response,
    expiresAt: now + TTL_MS,
  });
}

export function clearSynthesisCache(): void {
  entries.clear();
}
