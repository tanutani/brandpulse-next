import { describe, expect, it } from "vitest";

import { activationPackageFixture } from "@/lib/activation/draft-package";
import type { JourneyState } from "@/lib/contracts";
import { createHeroSprint } from "@/lib/experiment/hero-sprint";
import { lockSprint } from "@/lib/experiment/validate-sprint";
import { findOpportunityContract } from "@/lib/fixtures";
import { approveCurrentVersion } from "@/lib/governance/approve-contract";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";
import type { StorageLike } from "@/lib/persistence/local-contract-store";
import { evaluateActivationVariant } from "@/lib/policies/evaluate-package";

class MemoryStorage implements StorageLike {
  private readonly records = new Map<string, string>();
  getItem(key: string) { return this.records.get(key) ?? null; }
  setItem(key: string, value: string) { this.records.set(key, value); }
  removeItem(key: string) { this.records.delete(key); }
}

describe("governed review persistence", () => {
  it("retains only append-only current-version approval after corrected selection", () => {
    const contract = findOpportunityContract("opp-extra-time-sweat-confidence")!;
    const storage = new MemoryStorage();
    const store = new LocalJourneyStore(storage);
    const sprint = lockSprint(createHeroSprint(contract), "2026-08-15T12:10:00.000Z");
    const initial: JourneyState = {
      storageVersion: "2.0.0", kind: "test", contractId: contract.contractId, contractVersion: 3,
      scope: "four_city", assetMode: "rights_safe_creator", selectedBrandId: "rexona",
      sprint, activationPlan: null, selectedVariantId: null, decisions: [], outcome: null,
    };
    store.save(initial);
    const checks = evaluateActivationVariant(activationPackageFixture.variants[1], "2026-08-15T12:20:00.000Z");
    const approval = approveCurrentVersion({
      actor: "brand_legal_checker", actorDisplayName: "A. Rao", rationale: "Corrected rights-safe version.",
      reviewedContractVersion: 3, currentContractVersion: 3, checks, decidedAt: "2026-08-15T12:25:00.000Z",
    });
    store.save({ ...initial, selectedVariantId: activationPackageFixture.variants[1].id, decisions: [...initial.decisions, approval] });

    expect(new LocalJourneyStore(storage).load()).toMatchObject({
      selectedVariantId: "variant-creator-rights-safe",
      decisions: [{ decision: "approve_test", contractVersion: 3 }],
    });
  });
});
