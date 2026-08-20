import { coolingChallenge } from "@/lib/fixtures/source/cooling-challenge";
import { heroExtraTime } from "@/lib/fixtures/source/hero-extra-time";
import { scalpSkinification } from "@/lib/fixtures/source/scalp-skinification";
import type { UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Every use case the demo knows about, in the order the Pulse Room lists them.
 *
 * Append rather than insert: some tests still index this positionally, and the
 * first entry is the guided journey.
 */
export const USE_CASE_SOURCES: UseCaseSource[] = [
  heroExtraTime,
  scalpSkinification,
  coolingChallenge,
];

export type { UseCaseSource } from "@/lib/fixtures/source/types";
