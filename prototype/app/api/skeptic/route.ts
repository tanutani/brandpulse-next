import { SkepticRequestSchema } from "@/lib/contracts/live-ai";
import { createGeminiProvider } from "@/lib/ai/gemini-provider";
import { readSynthesisConfig } from "@/lib/ai/synthesize";
import { runSkeptic } from "@/lib/agents/run-skeptic";
import { isKnownEvidenceVersion, isKnownOpportunityId } from "@/lib/evidence/evidence-registry";

/**
 * POST /api/skeptic
 *
 * Accepts an opportunity ID and an evidence version — never a prompt. The
 * evidence chain is loaded server-side, so a caller cannot steer what the
 * Skeptic argues against. Provider errors are swallowed: the client learns the
 * fallback reason and nothing about the provider, the key, or the stack.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const parsed = SkepticRequestSchema.safeParse(payload);
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
    response = await runSkeptic(parsed.data, { config, provider });
  } catch {
    // runSkeptic converts provider failures into fallbacks, so reaching here
    // means the fallback itself threw: a 503 rather than a leak.
    return json({ error: "skeptic_unavailable" }, 503);
  }

  if (!response) return json({ error: "skeptic_unavailable" }, 503);
  return json(response, 200);
}
