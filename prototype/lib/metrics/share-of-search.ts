import { z } from "zod";

import fixture from "@/public/data/share-of-search.json";

/**
 * Share of search, computed from a dated weekly series.
 *
 * Binet (2020) reports that share of organic branded search tracks market share
 * and tends to lead it. This is deliberately NOT folded into Proof: Proof asks
 * whether a signal is real right now, and a measure that leads by six to twelve
 * months is on a different clock. Mixing the two would also have rescaled every
 * existing gate score, because the six Proof weights sum to one.
 *
 * So it sits alongside the gates as its own indicator, and the UI is careful to
 * present the lead time as a property of the published research rather than as a
 * forecast about any brand shown here.
 */

const PointSchema = z
  .object({
    weekStarting: z.string().min(1),
    index: z.number().min(0),
  })
  .strict();

const BrandSeriesSchema = z
  .object({
    brandId: z.string().min(1),
    points: z.array(PointSchema).min(8),
  })
  .strict();

const CategorySeriesSchema = z
  .object({
    category: z.string().min(1),
    geography: z.string().min(1),
    evidenceType: z.enum(["public", "synthetic_internal"]),
    synthetic: z.boolean(),
    displayLabel: z.string().min(1),
    sourceUrl: z.url(),
    capturedAt: z.iso.datetime({ offset: true }),
    brands: z.array(BrandSeriesSchema).min(2),
  })
  .strict()
  .superRefine((series, context) => {
    const weeks = series.brands[0].points.map(({ weekStarting }) => weekStarting).join("|");
    series.brands.forEach((brand, index) => {
      if (brand.points.map(({ weekStarting }) => weekStarting).join("|") !== weeks) {
        context.addIssue({
          code: "custom",
          // Shares are only meaningful if every brand covers the same weeks.
          message: `Brand ${brand.brandId} does not cover the same weeks as the rest of the category.`,
          path: ["brands", index, "points"],
        });
      }
    });
  });

const FixtureSchema = z
  .object({
    fixtureVersion: z.literal("share-of-search-1.0.0"),
    generatedAt: z.iso.datetime({ offset: true }),
    disclosure: z.string().min(1),
    method: z
      .object({
        citationId: z.string().min(1),
        leadTimeMonths: z.tuple([z.number(), z.number()]),
        flatBandPp: z.number().positive(),
        note: z.string().min(1),
      })
      .strict(),
    series: z.array(CategorySeriesSchema).min(1),
  })
  .strict();

const parsed = FixtureSchema.parse(fixture);

export const SHARE_OF_SEARCH_DISCLOSURE = parsed.disclosure;
export const SHARE_OF_SEARCH_METHOD = parsed.method;

export type ShareDirection = "rising" | "flat" | "falling";

export interface ShareOfSearchReading {
  brandId: string;
  /** Latest weekly share, as a percentage to one decimal place. */
  latestSharePct: number;
  /** Mean share over the last four weeks. */
  trailingFourWeekPct: number;
  /** Mean share over the four weeks before those. */
  priorFourWeekPct: number;
  /** trailing minus prior, in percentage points. */
  deltaPp: number;
  direction: ShareDirection;
}

export interface ShareOfSearchResult {
  category: string;
  geography: string;
  weeks: string[];
  synthetic: boolean;
  displayLabel: string;
  sourceUrl: string;
  capturedAt: string;
  readings: ShareOfSearchReading[];
}

const round1 = (value: number) => Math.round(value * 10) / 10;
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

/**
 * Weekly share for one brand: its index over the category total for that week.
 * Returns an empty array when a week has no search at all, rather than dividing
 * by zero and reporting a confident nonsense number.
 */
function weeklyShares(
  brandPoints: number[],
  categoryTotals: number[],
): number[] {
  return brandPoints.map((value, index) =>
    categoryTotals[index] === 0 ? 0 : (value / categoryTotals[index]) * 100,
  );
}

export function computeShareOfSearch(category: string): ShareOfSearchResult | null {
  const series = parsed.series.find((entry) => entry.category === category);
  if (!series) return null;

  const weeks = series.brands[0].points.map(({ weekStarting }) => weekStarting);
  const categoryTotals = weeks.map((_, index) =>
    series.brands.reduce((sum, brand) => sum + brand.points[index].index, 0),
  );

  const readings = series.brands.map((brand) => {
    const shares = weeklyShares(
      brand.points.map(({ index }) => index),
      categoryTotals,
    );
    const trailing = shares.slice(-4);
    const prior = shares.slice(-8, -4);
    const deltaPp = round1(mean(trailing) - mean(prior));

    return {
      brandId: brand.brandId,
      latestSharePct: round1(shares[shares.length - 1]),
      trailingFourWeekPct: round1(mean(trailing)),
      priorFourWeekPct: round1(mean(prior)),
      deltaPp,
      // An explicit flat band, so a rounding-scale wobble never reads as a trend.
      direction:
        Math.abs(deltaPp) < parsed.method.flatBandPp
          ? "flat"
          : deltaPp > 0
            ? "rising"
            : "falling",
    } satisfies ShareOfSearchReading;
  });

  return {
    category: series.category,
    geography: series.geography,
    weeks,
    synthetic: series.synthetic,
    displayLabel: series.displayLabel,
    sourceUrl: series.sourceUrl,
    capturedAt: series.capturedAt,
    readings,
  };
}
