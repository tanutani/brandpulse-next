"use client";

import { SynthesisResponseSchema, type SynthesisResponse } from "@/lib/contracts/live-ai";
import { EVIDENCE_VERSION } from "@/lib/evidence/evidence-registry";

/**
 * One synthesis per opportunity per browsing session. The panel and the
 * "Ask why?" answers share this, so opening both never bills a second call.
 */

const cache = new Map<string, SynthesisResponse>();
const inFlight = new Map<string, Promise<SynthesisResponse | null>>();

const keyFor = (opportunityId: string) => `${opportunityId}::${EVIDENCE_VERSION}`;

export function readSynthesis(opportunityId: string): SynthesisResponse | null {
  return cache.get(keyFor(opportunityId)) ?? null;
}

export async function fetchSynthesis(opportunityId: string): Promise<SynthesisResponse | null> {
  const key = keyFor(opportunityId);
  const cached = cache.get(key);
  if (cached) return cached;

  const existing = inFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ opportunityId, evidenceVersion: EVIDENCE_VERSION }),
      });
      if (!response.ok) return null;

      const parsed = SynthesisResponseSchema.safeParse(await response.json());
      if (!parsed.success) return null;

      cache.set(key, parsed.data);
      return parsed.data;
    } catch {
      // Offline or blocked: the caller shows its own degraded state.
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, request);
  return request;
}

export function clearSynthesisStore(): void {
  cache.clear();
  inFlight.clear();
}
