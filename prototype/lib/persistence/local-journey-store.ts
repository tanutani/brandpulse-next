import { JourneyStateSchema, type JourneyState } from "@/lib/contracts";

import type { StorageLike } from "./local-contract-store";

export const JOURNEY_STORAGE_KEY = "brandpulse-next:journey:1.0.0";

/**
 * Broadcast so the shell's Decision Pulse can follow the journey without every
 * screen having to thread state up through the layout.
 */
export const JOURNEY_CHANGED_EVENT = "brandpulse:journey-changed";

export function notifyJourneyChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(JOURNEY_CHANGED_EVENT));
  }
}

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
    notifyJourneyChanged();
    return parsed;
  }

  clear(): void {
    this.storage.removeItem(JOURNEY_STORAGE_KEY);
    notifyJourneyChanged();
  }
}
