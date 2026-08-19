import { z } from "zod";

import { ProviderError, isAbortError } from "@/lib/ai/gemini-provider";

/**
 * Reads the GDELT DOC 2.0 open article API.
 *
 * GDELT needs no key and no account, which is why it is the live source here:
 * the demo can prove it reached the open internet without shipping a secret.
 * Only titles, domains, URLs and dates are kept — never article body text — so
 * nothing copyrighted is stored or forwarded to the model.
 */

const GDELT_ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc";

/** Enough articles for the model to find themes, few enough to stay inside the budget. */
const MAX_ARTICLES = 20;

/**
 * GDELT returns extra fields and occasionally omits optional ones, so this is
 * intentionally loose about unknown keys and strict about the four we use.
 */
const GdeltArticleSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  domain: z.string().min(1),
  seendate: z.string().min(1).optional(),
});

const GdeltResponseSchema = z.object({
  articles: z.array(GdeltArticleSchema).optional(),
});

export interface LiveArticle {
  title: string;
  url: string;
  domain: string;
  seenDate: string | null;
}

export type ArticleFetcher = (query: string, signal: AbortSignal) => Promise<LiveArticle[]>;

/** GDELT's `seendate` is compact ISO basic format: 20260815T083000Z. */
function parseSeenDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(raw.trim());
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

export function buildGdeltUrl(query: string): string {
  const params = new URLSearchParams({
    query,
    mode: "artlist",
    format: "json",
    maxrecords: String(MAX_ARTICLES),
    sort: "datedesc",
    timespan: "7d",
  });
  return `${GDELT_ENDPOINT}?${params.toString()}`;
}

export const fetchGdeltArticles: ArticleFetcher = async (query, signal) => {
  let response: Response;
  try {
    response = await fetch(buildGdeltUrl(query), {
      signal,
      headers: { accept: "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    throw isAbortError(error)
      ? new ProviderError("timeout", "GDELT request timed out.")
      : new ProviderError("transient", "GDELT unreachable.");
  }

  if (response.status === 429) throw new ProviderError("quota", "GDELT rate limit reached.");
  if (response.status >= 500) throw new ProviderError("transient", "GDELT unavailable.");
  if (!response.ok) throw new ProviderError("fatal", "GDELT rejected the query.");

  // GDELT answers an overloaded query with an HTML or plaintext error at HTTP 200,
  // so a parse failure here is a normal outcome rather than an exceptional one.
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ProviderError("transient", "GDELT returned a non-JSON body.");
  }

  const parsed = GdeltResponseSchema.safeParse(payload);
  if (!parsed.success) throw new ProviderError("transient", "GDELT returned an unexpected shape.");

  return (parsed.data.articles ?? [])
    .slice(0, MAX_ARTICLES)
    .map((article) => ({
      title: article.title.trim(),
      url: article.url.trim(),
      domain: article.domain.trim(),
      seenDate: parseSeenDate(article.seendate),
    }))
    .filter((article) => article.title.length > 0 && article.url.startsWith("http"));
};
