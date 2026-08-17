import { GoogleGenAI } from "@google/genai";

/**
 * The only place that talks to Gemini. It returns raw response text and a
 * coarse failure classification; interpreting or trusting that text is the
 * caller's job.
 */

export interface ProviderRequest {
  model: string;
  systemInstruction: string;
  prompt: string;
  jsonSchema: unknown;
  signal: AbortSignal;
}

export type SynthesisProvider = (request: ProviderRequest) => Promise<string>;

export type ProviderFailureKind = "quota" | "transient" | "timeout" | "fatal";

export function isAbortError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const candidate = error as { name?: unknown };
  return candidate.name === "AbortError" || candidate.name === "TimeoutError";
}

export class ProviderError extends Error {
  constructor(
    readonly kind: ProviderFailureKind,
    message: string,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

/** Reads an HTTP status from the assorted shapes SDK errors arrive in. */
function readStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null;
  const candidate = error as { status?: unknown; code?: unknown };
  for (const value of [candidate.status, candidate.code]) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

export function classifyProviderError(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error;
  if (isAbortError(error)) return new ProviderError("timeout", "Provider request timed out.");

  const status = readStatus(error);
  if (status === 429) return new ProviderError("quota", "Provider quota exceeded.");
  if (status !== null && status >= 500) return new ProviderError("transient", "Provider unavailable.");

  // Message sniffing is a fallback for SDK errors that carry no numeric status.
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("quota") || message.includes("resource_exhausted") || message.includes("429")) {
    return new ProviderError("quota", "Provider quota exceeded.");
  }
  if (message.includes("unavailable") || message.includes("internal") || message.includes("503")) {
    return new ProviderError("transient", "Provider unavailable.");
  }
  return new ProviderError("fatal", "Provider request failed.");
}

export function createGeminiProvider(apiKey: string): SynthesisProvider {
  const client = new GoogleGenAI({ apiKey });

  return async ({ model, systemInstruction, prompt, jsonSchema, signal }) => {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseJsonSchema: jsonSchema,
          temperature: 0,
          candidateCount: 1,
          maxOutputTokens: 1200,
          abortSignal: signal,
        },
      });
      return response.text ?? "";
    } catch (error) {
      throw classifyProviderError(error);
    }
  };
}
