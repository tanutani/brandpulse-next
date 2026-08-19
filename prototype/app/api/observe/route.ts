import { ObservationRequestSchema } from "@/lib/contracts/live-ai";
import { createGeminiProvider } from "@/lib/ai/gemini-provider";
import { readSynthesisConfig } from "@/lib/ai/synthesize";
import { prewarmObservations, runObservations } from "@/lib/agents/run-observations";
import { isKnownEvidenceVersion, isKnownOpportunityId } from "@/lib/evidence/evidence-registry";

/**
 * POST /api/observe
 *
 * Fetches live public articles from the GDELT open index and returns structured
 * observations. The GDELT query is chosen server-side from a fixed table keyed
 * by opportunity, so a caller can never author the search.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

/**
 * GET /api/observe?opportunityId=...
 *
 * Background warm-up only. Fills the GDELT article cache so the interactive
 * POST can answer inside its budget. Returns nothing a caller can act on.
 */
export async function GET(request: Request): Promise<Response> {
  const opportunityId = new URL(request.url).searchParams.get("opportunityId") ?? "";
  if (!isKnownOpportunityId(opportunityId)) return json({ warmed: false }, 200);

  try {
    const warmed = await prewarmObservations(opportunityId, { config: readSynthesisConfig() });
    return json({ warmed }, 200);
  } catch {
    // Warming is best-effort by design: a failure just means the click falls back.
    return json({ warmed: false }, 200);
  }
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const parsed = ObservationRequestSchema.safeParse(payload);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const { opportunityId, evidenceVersion, forceStatic } = parsed.data;
  if (!isKnownOpportunityId(opportunityId) || !isKnownEvidenceVersion(evidenceVersion)) {
    return json({ error: "unknown_opportunity_or_evidence_version" }, 400);
  }

  const config = readSynthesisConfig();
  const provider =
    !forceStatic && config.liveAiEnabled && config.apiKey
      ? createGeminiProvider(config.apiKey)
      : null;

  let response;
  try {
    response = await runObservations(parsed.data, { config, provider });
  } catch {
    return json({ error: "observations_unavailable" }, 503);
  }

  if (!response) return json({ error: "observations_unavailable" }, 503);
  return json(response, 200);
}
