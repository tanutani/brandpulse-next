import { SynthesisRequestSchema } from "@/lib/contracts/live-ai";
import { createGeminiProvider } from "@/lib/ai/gemini-provider";
import { readCachedSynthesis, writeCachedSynthesis } from "@/lib/ai/synthesis-cache";
import { readSynthesisConfig, runSynthesis } from "@/lib/ai/synthesize";
import { isKnownEvidenceVersion, isKnownOpportunityId } from "@/lib/evidence/evidence-registry";

/**
 * POST /api/synthesize
 *
 * Accepts an opportunity ID and an evidence version — never a prompt. Evidence
 * is loaded server-side, so a caller cannot influence what the model sees.
 * Provider errors are swallowed: the client learns the fallback reason and
 * nothing about the provider, the key, or the stack.
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

  const parsed = SynthesisRequestSchema.safeParse(payload);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const { opportunityId, evidenceVersion } = parsed.data;
  if (!isKnownOpportunityId(opportunityId) || !isKnownEvidenceVersion(evidenceVersion)) {
    return json({ error: "unknown_opportunity_or_evidence_version" }, 400);
  }

  const cached = readCachedSynthesis(opportunityId, evidenceVersion);
  if (cached) return json(cached, 200);

  const config = readSynthesisConfig();
  const provider =
    config.liveAiEnabled && config.apiKey ? createGeminiProvider(config.apiKey) : null;

  let response;
  try {
    response = await runSynthesis(parsed.data, { config, provider });
  } catch {
    // runSynthesis already converts provider failures into fallbacks; reaching
    // here means the fallback itself threw, which is a 503 rather than a leak.
    return json({ error: "synthesis_unavailable" }, 503);
  }

  if (!response) return json({ error: "synthesis_unavailable" }, 503);

  writeCachedSynthesis(opportunityId, evidenceVersion, response);
  return json(response, 200);
}
