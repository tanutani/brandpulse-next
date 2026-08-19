import { describe, expect, it, vi } from "vitest";

import { runObservations } from "@/lib/agents/run-observations";
import { runSkeptic } from "@/lib/agents/run-skeptic";
import { buildGdeltUrl } from "@/lib/agents/gdelt-client";
import type { LiveArticle } from "@/lib/agents/gdelt-client";
import { isStaticModeQuery } from "@/lib/demo/static-mode";
import type { SynthesisConfig } from "@/lib/ai/synthesize";

const HERO = "opp-extra-time-sweat-confidence";

const liveConfig: SynthesisConfig = {
  liveAiEnabled: true,
  apiKey: "test-key",
  model: "gemini-3.5-flash-lite",
};

const request = { opportunityId: HERO, evidenceVersion: "evidence-1.0.0" };

const articles: LiveArticle[] = [
  {
    title: "Humid week forecast across four metros",
    url: "https://example.com/humid-week",
    domain: "example.com",
    seenDate: "2026-08-15T08:30:00.000Z",
  },
];

describe("static-mode flag", () => {
  it("treats a bare flag as on and only 0/false as off", () => {
    expect(isStaticModeQuery("?static=1")).toBe(true);
    expect(isStaticModeQuery("?static")).toBe(true);
    expect(isStaticModeQuery("?static=true")).toBe(true);
    expect(isStaticModeQuery("?static=0")).toBe(false);
    expect(isStaticModeQuery("?static=false")).toBe(false);
    expect(isStaticModeQuery("")).toBe(false);
  });
});

describe("GDELT query", () => {
  it("asks the open article endpoint for recent JSON without a key", () => {
    const url = buildGdeltUrl("test query");
    expect(url).toContain("api.gdeltproject.org/api/v2/doc/doc");
    expect(url).toContain("format=json");
    expect(url).toContain("timespan=7d");
    expect(url.toLowerCase()).not.toContain("key");
  });
});

describe("the Skeptic", () => {
  it("returns the checked-in counter-case when the URL forces static mode", async () => {
    const provider = vi.fn();
    const result = await runSkeptic(
      { ...request, forceStatic: true },
      { config: liveConfig, provider },
    );

    expect(provider).not.toHaveBeenCalled();
    expect(result?.mode).toBe("precomputed_fallback");
    expect(result?.fallbackReason).toBe("disabled");
  });

  it("falls back rather than surfacing a challenge that cites unknown evidence", async () => {
    const provider = vi.fn().mockResolvedValue(
      JSON.stringify({
        headline: "This could be wrong.",
        challenges: [
          {
            claim: "An invented source says otherwise.",
            wouldChangeDecisionIf: "Someone checks the invented source.",
            evidenceIds: ["sig-does-not-exist"],
          },
        ],
      }),
    );

    const result = await runSkeptic(request, { config: liveConfig, provider });

    expect(result?.mode).toBe("precomputed_fallback");
    expect(result?.fallbackReason).toBe("invalid_output");
  });

  it("accepts a grounded live counter-case", async () => {
    const provider = vi.fn().mockResolvedValue(
      JSON.stringify({
        headline: "Heat alone may explain this.",
        challenges: [
          {
            claim: "Seasonal humidity moved at the same time as the match.",
            wouldChangeDecisionIf: "The pattern repeats in a week with no match.",
            evidenceIds: ["sig-hero-weather"],
          },
        ],
      }),
    );

    const result = await runSkeptic(request, {
      config: liveConfig,
      provider,
      timestamp: () => "2026-08-15T09:00:00.000Z",
    });

    expect(result?.mode).toBe("live");
    expect(result?.challenges[0].evidenceIds).toEqual(["sig-hero-weather"]);
  });
});

describe("GDELT evidence extraction", () => {
  it("falls back to the checked-in replay when GDELT is unreachable", async () => {
    const result = await runObservations(request, {
      config: liveConfig,
      provider: vi.fn(),
      fetchArticles: async () => {
        throw new Error("network down");
      },
    });

    expect(result?.mode).toBe("fixture_fallback");
    expect(result?.observations.length).toBeGreaterThan(0);
    // The offline demo is unchanged: the fallback is the same replay it always was.
    expect(result?.observations[0].id).toContain("replay-hero");
  });

  it("rejects an observation pointing at an article that was never retrieved", async () => {
    const result = await runObservations(request, {
      config: liveConfig,
      fetchArticles: async () => articles,
      provider: vi.fn().mockResolvedValue(
        JSON.stringify({
          observations: [
            {
              sourceType: "sports_news",
              label: "Invented article",
              detail: "Refers to an article index that was never fetched.",
              articleIndex: 9,
            },
          ],
        }),
      ),
    });

    expect(result?.mode).toBe("fixture_fallback");
    expect(result?.fallbackReason).toBe("invalid_output");
  });

  it("emits observations that carry the live article link and no synthetic flag", async () => {
    const result = await runObservations(request, {
      config: liveConfig,
      fetchArticles: async () => articles,
      timestamp: () => "2026-08-15T09:00:00.000Z",
      provider: vi.fn().mockResolvedValue(
        JSON.stringify({
          observations: [
            {
              sourceType: "sports_news",
              label: "Humid week reported",
              detail: "A forecast reports high humidity across four metros this week.",
              articleIndex: 0,
            },
          ],
        }),
      ),
    });

    expect(result?.mode).toBe("live");
    expect(result?.query).toContain("sourcecountry:india");
    expect(result?.observations[0]).toMatchObject({
      sourceUrl: "https://example.com/humid-week",
      sourceDomain: "example.com",
      evidenceType: "public",
      synthetic: false,
    });
  });

  it("never lets a live observation id collide with an approved fixture id", async () => {
    const result = await runObservations(request, {
      config: liveConfig,
      fetchArticles: async () => articles,
      provider: vi.fn().mockResolvedValue(
        JSON.stringify({
          observations: [
            {
              sourceType: "sports_news",
              label: "Humid week reported",
              detail: "A forecast reports high humidity across four metros this week.",
              articleIndex: 0,
            },
          ],
        }),
      ),
    });

    // Live evidence must stay outside the approved set, so it can never be cited
    // as grounding by the synthesis or skeptic boundaries.
    const { citesOnlyKnownEvidence } = await import("@/lib/evidence/evidence-registry");
    const liveIds = result!.observations.flatMap((observation) => observation.evidenceIds);
    expect(citesOnlyKnownEvidence(HERO, liveIds)).toBe(false);
  });
});
