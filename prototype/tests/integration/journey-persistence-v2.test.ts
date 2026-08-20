import { describe, expect, it } from "vitest";

import type { JourneyState } from "@/lib/contracts";
import { createSurfMonitoredPlan } from "@/lib/activation/monitored-plan";
import {
  JOURNEY_STORAGE_KEY,
  LEGACY_JOURNEY_STORAGE_KEY,
  LocalJourneyStore,
} from "@/lib/persistence/local-journey-store";
import type { StorageLike } from "@/lib/persistence/local-contract-store";

class MemoryStorage implements StorageLike {
  private readonly records = new Map<string, string>();
  getItem(key: string) { return this.records.get(key) ?? null; }
  setItem(key: string, value: string) { this.records.set(key, value); }
  removeItem(key: string) { this.records.delete(key); }
}

const rexona: JourneyState = {
  storageVersion: "2.0.0",
  kind: "test",
  contractId: "contract-extra-time-sweat-confidence",
  contractVersion: 3,
  scope: "four_city",
  assetMode: "rights_safe_creator",
  selectedBrandId: "rexona",
  sprint: null,
  activationPlan: null,
  selectedVariantId: null,
  decisions: [],
  outcome: null,
};

const surf: JourneyState = {
  storageVersion: "2.0.0",
  kind: "act",
  contractId: "contract-surf-first-monsoon",
  contractVersion: 1,
  scope: "national",
  assetMode: "rights_safe_creator",
  selectedBrandId: "surf-excel",
  sprint: null,
  activationPlan: createSurfMonitoredPlan("national"),
  selectedVariantId: null,
  decisions: [],
  outcome: null,
};

describe("journey store v2", () => {
  it("persists Rexona and Surf independently", () => {
    const storage = new MemoryStorage();
    const store = new LocalJourneyStore(storage);
    store.save(rexona);
    store.save(surf);

    expect(store.load(rexona.contractId)).toEqual(rexona);
    expect(store.load(surf.contractId)).toEqual(surf);
    expect(Object.keys(store.loadAll()).sort()).toEqual([rexona.contractId, surf.contractId].sort());
  });

  it("migrates the single v1 Rexona record into the keyed v2 map", () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_JOURNEY_STORAGE_KEY, JSON.stringify({
      ...rexona,
      storageVersion: "1.0.0",
      kind: undefined,
      activationPlan: undefined,
    }));

    const migrated = new LocalJourneyStore(storage).load(rexona.contractId);
    expect(migrated).toMatchObject({ storageVersion: "2.0.0", kind: "test", contractId: rexona.contractId });
    expect(storage.getItem(JOURNEY_STORAGE_KEY)).not.toBeNull();
    expect(storage.getItem(LEGACY_JOURNEY_STORAGE_KEY)).toBeNull();
  });
});
