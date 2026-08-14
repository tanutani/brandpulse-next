import type { HumanDecision, OpportunityContract } from "./opportunity";

export interface StoredContractState {
  storageVersion: "1.0.0";
  contractVersions: OpportunityContract[];
  decisions: HumanDecision[];
}

export interface ContractPersistence {
  load(): StoredContractState | null;
  appendContractVersion(contract: OpportunityContract): StoredContractState;
  appendDecision(decision: HumanDecision): StoredContractState;
  clear(): void;
}
