import type { OpportunityContract } from "./opportunity";

export interface FixtureBundle {
  fixtureVersion: "1.0.0";
  generatedAt: string;
  contracts: OpportunityContract[];
}

export interface FixtureLoader {
  load(): Promise<FixtureBundle>;
}
