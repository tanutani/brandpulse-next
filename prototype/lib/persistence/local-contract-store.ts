import { HumanDecisionSchema, OpportunityContractSchema } from "@/lib/contracts";
import type { ContractPersistence, HumanDecision, OpportunityContract, StoredContractState } from "@/lib/contracts";

export const CONTRACT_STORAGE_KEY = "brandpulse-next:contracts:1.0.0";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const EMPTY_STATE: StoredContractState = { storageVersion: "1.0.0", contractVersions: [], decisions: [] };

export class LocalContractStore implements ContractPersistence {
  constructor(private readonly storage: StorageLike) {}

  load(): StoredContractState | null {
    const raw = this.storage.getItem(CONTRACT_STORAGE_KEY);
    if (!raw) return null;

    try {
      const candidate = JSON.parse(raw) as Partial<StoredContractState>;
      if (candidate.storageVersion !== "1.0.0") return null;
      return {
        storageVersion: "1.0.0",
        contractVersions: (candidate.contractVersions ?? []).map((contract) => OpportunityContractSchema.parse(contract)),
        decisions: (candidate.decisions ?? []).map((decision) => HumanDecisionSchema.parse(decision)),
      };
    } catch {
      return null;
    }
  }

  appendContractVersion(contract: OpportunityContract): StoredContractState {
    const current = this.load() ?? EMPTY_STATE;
    const next = { ...current, contractVersions: [...current.contractVersions, OpportunityContractSchema.parse(contract)] };
    this.storage.setItem(CONTRACT_STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  appendDecision(decision: HumanDecision): StoredContractState {
    const current = this.load() ?? EMPTY_STATE;
    const next = { ...current, decisions: [...current.decisions, HumanDecisionSchema.parse(decision)] };
    this.storage.setItem(CONTRACT_STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  clear(): void {
    this.storage.removeItem(CONTRACT_STORAGE_KEY);
  }
}
