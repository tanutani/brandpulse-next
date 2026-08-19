import { ProviderError, classifyProviderError } from "@/lib/ai/gemini-provider";
import type { FallbackReason } from "@/lib/contracts/live-ai";

/**
 * The shared "try live, but never past the budget" wrapper.
 *
 * Every live step in the demo has the same obligation: answer inside a fixed
 * wall-clock allowance or hand back a reason so the caller can fall back. This
 * keeps that policy in one place, so no agent can quietly run longer than the
 * others and strand the demo mid-presentation.
 */

/** Total wall-clock allowance for one live step, including any retry. */
export const LIVE_BUDGET_MS = 6_000;

/** Below this, a retry cannot realistically complete, so we fall back instead. */
const MIN_RETRY_BUDGET_MS = 1_200;

export function toFallbackReason(error: unknown): FallbackReason {
  const failure = error instanceof ProviderError ? error : classifyProviderError(error);
  if (failure.kind === "quota") return "quota";
  // The reason enum has no "provider unavailable" value, so 5xx and abort both
  // report as timeout: no usable answer arrived inside the budget.
  if (failure.kind === "transient" || failure.kind === "timeout") return "timeout";
  return "invalid_output";
}

export interface BoundedAttemptOptions<T> {
  /** Receives the remaining budget and an abort signal wired to it. */
  attempt: (remainingMs: number, signal: AbortSignal) => Promise<T>;
  /** Rejects an otherwise successful answer, e.g. one citing unknown evidence. */
  validate?: (value: T) => boolean;
  budgetMs?: number;
  now?: () => number;
}

export type BoundedAttemptResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: FallbackReason };

export async function runBounded<T>({
  attempt,
  validate,
  budgetMs = LIVE_BUDGET_MS,
  now = Date.now,
}: BoundedAttemptOptions<T>): Promise<BoundedAttemptResult<T>> {
  const deadline = now() + budgetMs;
  let lastReason: FallbackReason = "invalid_output";

  for (let tries = 0; tries < 2; tries += 1) {
    const remainingMs = deadline - now();
    if (remainingMs <= 0) return { ok: false, reason: "timeout" };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), remainingMs);

    try {
      const value = await attempt(remainingMs, controller.signal);

      // A provider that ignores the signal still has to count as timed out.
      if (controller.signal.aborted) throw new ProviderError("timeout", "Live step timed out.");

      // A malformed or ungrounded answer is deterministic: retrying the same
      // prompt would produce the same rejection, so stop here.
      if (validate && !validate(value)) return { ok: false, reason: "invalid_output" };

      return { ok: true, value };
    } catch (error) {
      lastReason = toFallbackReason(error);

      const failure = error instanceof ProviderError ? error : classifyProviderError(error);
      const budgetLeft = deadline - now();
      if (failure.kind === "fatal" || tries === 1 || budgetLeft < MIN_RETRY_BUDGET_MS) {
        return { ok: false, reason: lastReason };
      }
    } finally {
      clearTimeout(timer);
    }
  }

  return { ok: false, reason: lastReason };
}
