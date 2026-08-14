import { z } from "zod";

import fixture from "@/public/data/activation-packages.json";
import { ActivationVariantSchema } from "@/lib/contracts";

const ActivationPackageFixtureSchema = z.object({
  fixtureVersion: z.literal("1.0.0"),
  generatedAt: z.iso.datetime({ offset: true }),
  disclosure: z.string(),
  sprintId: z.string(),
  variants: z.array(ActivationVariantSchema).min(3),
}).strict();

export const activationPackageFixture = ActivationPackageFixtureSchema.parse(fixture);

export function getActivationVariant(id: string) {
  return activationPackageFixture.variants.find((variant) => variant.id === id) ?? null;
}
