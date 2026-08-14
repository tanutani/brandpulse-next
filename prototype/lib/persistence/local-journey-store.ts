import { JourneyStateSchema, type JourneyState } from "@/lib/contracts";

import type { StorageLike } from "./local-contract-store";

export const JOURNEY_STORAGE_KEY = "brandpulse-next:journey:1.0.0";

export class LocalJourneyStore {
  constructor(private readonly storage: StorageLike) {}

  load(): JourneyState | null {
    const raw = this.storage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JourneyStateSchema.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  save(state: JourneyState): JourneyState {
    const parsed = JourneyStateSchema.parse(state);
    this.storage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  }

  clear(): void {
    this.storage.removeItem(JOURNEY_STORAGE_KEY);
  }
}
