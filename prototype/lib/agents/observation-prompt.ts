import type { LiveArticle } from "@/lib/agents/gdelt-client";

/** Bump when the instruction text or the requested JSON shape changes. */
export const OBSERVATION_PROMPT_VERSION = "observation-1.0.0";

/**
 * The GDELT query for each opportunity, written out rather than generated.
 *
 * A model-authored query would make the live step unreproducible and would let
 * prompt text steer what the system "finds". These are fixed and inspectable.
 */
export const OBSERVATION_QUERIES: Record<string, string> = {
  "opp-extra-time-sweat-confidence":
    '(sweat OR deodorant OR humidity OR heatwave) sourcecountry:india sourcelang:english',
  "opp-scalp-skinification":
    '(scalp OR "hair care" OR dandruff) sourcecountry:india sourcelang:english',
  "opp-single-creator-cooling-challenge":
    '(cooling OR "heat relief") sourcecountry:india sourcelang:english',
};

export const OBSERVATION_SYSTEM_INSTRUCTION = [
  "You are an evidence extraction agent for a brand decision system.",
  "You convert raw news headlines into neutral, structured observations.",
  "",
  "Hard rules:",
  "- Use only the numbered articles supplied. Never introduce an outside fact, statistic, brand, or source.",
  "- articleIndex must be the index of the single article an observation is drawn from.",
  "- Describe only what a headline reports. Never infer demand, intent, sales, or consumer behaviour from a headline.",
  "- Never state or imply a Proof, Permission, or Preparedness score, a route, a blocker, an approval, a budget, or a result.",
  "- Never name or recommend a brand or product.",
  "- If the articles are off-topic, say so plainly in the detail rather than inventing relevance.",
  "- Write plain professional English. No marketing language, no emoji.",
  "",
  "sourceType must be one of: sports_news, search, consumer_language, commerce, inventory, rights.",
  "Headlines almost always map to sports_news or consumer_language; do not use inventory or rights,",
  "which describe internal operating records that news articles cannot evidence.",
].join("\n");

export function buildObservationPrompt(articles: LiveArticle[]): string {
  const list = articles
    .map(
      (article, index) =>
        `${index}. [${article.domain}] ${article.title}${article.seenDate ? ` (seen ${article.seenDate})` : ""}`,
    )
    .join("\n");

  return [
    "Live public news headlines retrieved just now from the GDELT open article index:",
    "",
    list,
    "",
    "Produce one to six observations. Each needs:",
    "- sourceType — the category of signal this headline represents.",
    "- label — at most six words naming what was observed.",
    "- detail — one sentence describing what the headline reports, and nothing beyond it.",
    "- articleIndex — the index of the article the observation came from.",
  ].join("\n");
}

export const OBSERVATION_RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    observations: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          sourceType: {
            type: "string",
            enum: ["sports_news", "search", "consumer_language", "commerce", "inventory", "rights"],
          },
          label: { type: "string" },
          detail: { type: "string" },
          articleIndex: { type: "integer" },
        },
        required: ["sourceType", "label", "detail", "articleIndex"],
        propertyOrdering: ["sourceType", "label", "detail", "articleIndex"],
      },
    },
  },
  required: ["observations"],
  propertyOrdering: ["observations"],
} as const;
