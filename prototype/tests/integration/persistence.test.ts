import { describe, expect, it } from "vitest";

import { minimalOpportunityContract } from "@/lib/contracts";
import { CONTRACT_STORAGE_KEY, LocalContractStore, type StorageLike } from "@/lib/persistence/local-contract-store";

class MemoryStorage implements StorageLike {
  private readonly records = new Map<string, string>();

  getItem(key: string) { return this.records.get(key) ?? null; }
  setItem(key: string, value: string) { this.records.set(key, value); }
  removeItem(key: string) { this.records.delete(key); }
}

describe("LocalContractStore", () => {
  it("persists a validated contract across store instances", () => {
    const storage = new MemoryStorage();
    new LocalContractStore(storage).appendContractVersion(minimalOpportunityContract);

    const refreshedStore = new LocalContractStore(storage);
    expect(refreshedStore.load()?.contractVersions).toEqual([minimalOpportunityContract]);
  });

  it("returns a safe empty signal for malformed or unknown storage", () => {
    const storage = new MemoryStorage();
    storage.setItem(CONTRACT_STORAGE_KEY, "not-json");
    expect(new LocalContractStore(storage).load()).toBeNull();

    storage.setItem(CONTRACT_STORAGE_KEY, JSON.stringify({ storageVersion: "0.9.0" }));
    expect(new LocalContractStore(storage).load()).toBeNull();
  });
});
