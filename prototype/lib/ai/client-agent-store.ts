"use client";

import {
  ObservationResponseSchema,
  SkepticResponseSchema,
  type ObservationResponse,
  type SkepticResponse,
} from "@/lib/contracts/live-ai";
import { isStaticMode } from "@/lib/demo/static-mode";
import { EVIDENCE_VERSION } from "@/lib/evidence/evidence-registry";

/**
 * One call per agent per opportunity per browsing session.
 *
 * The evidence version is part of the key, so changing fixtures invalidates
 * anything held here rather than showing an answer about evidence that has
 * since moved.
 */

interface AgentEndpoint<T> {
  path: string;
  parse: (value: unknown) => T | null;
  cache: Map<string, T>;
  inFlight: Map<string, Promise<T | null>>;
}

function createEndpoint<T>(
  path: string,
  schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } },
): AgentEndpoint<T> {
  return {
    path,
    parse: (value) => {
      const parsed = schema.safeParse(value);
      return parsed.success ? parsed.data : null;
    },
    cache: new Map(),
    inFlight: new Map(),
  };
}

const observations = createEndpoint<ObservationResponse>(
  "/api/observe",
  ObservationResponseSchema,
);
const skeptic = createEndpoint<SkepticResponse>("/api/skeptic", SkepticResponseSchema);

const keyFor = (opportunityId: string) => `${opportunityId}::${EVIDENCE_VERSION}`;

async function callAgent<T>(
  endpoint: AgentEndpoint<T>,
  opportunityId: string,
): Promise<T | null> {
  const key = keyFor(opportunityId);
  const cached = endpoint.cache.get(key);
  if (cached) return cached;

  const existing = endpoint.inFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      const response = await fetch(endpoint.path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          evidenceVersion: EVIDENCE_VERSION,
          forceStatic: isStaticMode(),
        }),
      });
      if (!response.ok) return null;

      const parsed = endpoint.parse(await response.json());
      if (!parsed) return null;

      endpoint.cache.set(key, parsed);
      return parsed;
    } catch {
      // Offline or blocked: the caller renders its own degraded state.
      return null;
    } finally {
      endpoint.inFlight.delete(key);
    }
  })();

  endpoint.inFlight.set(key, request);
  return request;
}

/**
 * Asks the server to warm its GDELT cache. Fire-and-forget: the caller does not
 * wait on it and never learns whether it worked.
 */
export function prewarmObservations(opportunityId: string): void {
  if (isStaticMode()) return;
  void fetch(`/api/observe?opportunityId=${encodeURIComponent(opportunityId)}`, {
    method: "GET",
    keepalive: true,
  }).catch(() => {});
}

export function readObservations(opportunityId: string): ObservationResponse | null {
  return observations.cache.get(keyFor(opportunityId)) ?? null;
}

export function fetchObservations(opportunityId: string): Promise<ObservationResponse | null> {
  return callAgent(observations, opportunityId);
}

export function readSkeptic(opportunityId: string): SkepticResponse | null {
  return skeptic.cache.get(keyFor(opportunityId)) ?? null;
}

export function fetchSkeptic(opportunityId: string): Promise<SkepticResponse | null> {
  return callAgent(skeptic, opportunityId);
}

export function clearAgentStore(): void {
  for (const endpoint of [observations, skeptic]) {
    endpoint.cache.clear();
    endpoint.inFlight.clear();
  }
}
