import { z } from "zod";

import fixture from "@/public/data/activation-packages.json";
import { ActivationVariantSchema } from "@/lib/contracts";

const ActivationPackageFixtureSchema = z.object({
  fixtureVersion: z.literal("2.0.0"),
  generatedAt: z.iso.datetime({ offset: true }),
  disclosure: z.string(),
  packages: z.array(z.object({
    opportunityId: z.string().min(1),
    planId: z.string().min(1),
    variants: z.array(ActivationVariantSchema).min(2),
  }).strict()).min(2),
}).strict();

export const activationPackagesFixture = ActivationPackageFixtureSchema.parse(fixture);

export function getActivationPackage(opportunityId: string) {
  return activationPackagesFixture.packages.find((item) => item.opportunityId === opportunityId) ?? null;
}

/** Hero alias retained for older unit-level consumers. */
export const activationPackageFixture = getActivationPackage("opp-extra-time-sweat-confidence")!;

export function getActivationVariant(id: string) {
  return activationPackagesFixture.packages.flatMap(({ variants }) => variants).find((variant) => variant.id === id) ?? null;
}
