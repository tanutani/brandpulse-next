import { beautyOwnershipConflict } from "@/lib/fixtures/source/beauty-ownership-conflict";
import { coolingChallenge } from "@/lib/fixtures/source/cooling-challenge";
import { surfMonsoonMoment } from "@/lib/fixtures/source/surf-monsoon-moment";
import { heatwaveQcommerce } from "@/lib/fixtures/source/heatwave-qcommerce";
import { heroExtraTime } from "@/lib/fixtures/source/hero-extra-time";
import { ingredientMisinformation } from "@/lib/fixtures/source/ingredient-misinformation";
import { phCleanserDiscourse } from "@/lib/fixtures/source/ph-cleanser-discourse";
import { scalpSkinification } from "@/lib/fixtures/source/scalp-skinification";
import { viralLaundryHack } from "@/lib/fixtures/source/viral-laundry-hack";
import type { UseCaseSource } from "@/lib/fixtures/source/types";

/**
 * Every use case the demo knows about, in the order the Pulse Room lists them.
 *
 * Between them they exercise all five routes, including the two the catalogue
 * never used to reach. Append rather than insert: some tests index this
 * positionally, and the first entry is the guided journey.
 */
export const USE_CASE_SOURCES: UseCaseSource[] = [
  heroExtraTime,
  surfMonsoonMoment,
  ingredientMisinformation,
  heatwaveQcommerce,
  beautyOwnershipConflict,
  phCleanserDiscourse,
  scalpSkinification,
  viralLaundryHack,
  coolingChallenge,
];

export type { UseCaseSource } from "@/lib/fixtures/source/types";
