import { z } from "zod";

import { JourneyStateSchema, type JourneyState } from "@/lib/contracts";

import type { StorageLike } from "./local-contract-store";

export const JOURNEY_STORAGE_KEY = "brandpulse-next:journey:2.0.0";
export const LEGACY_JOURNEY_STORAGE_KEY = "brandpulse-next:journey:1.0.0";

const JourneyStoreSchema = z.object({
  storageVersion: z.literal("2.0.0"),
  activeContractId: z.string().nullable(),
  journeys: z.record(z.string(), JourneyStateSchema),
}).strict();

const LegacyJourneySchema = z.object({
  storageVersion: z.literal("1.0.0"),
  contractId: z.string(),
  contractVersion: z.number().int().min(1),
  scope: z.enum(["national", "four_city"]),
  assetMode: z.enum(["unlicensed_match_footage", "rights_safe_creator"]),
  selectedBrandId: z.string(),
  sprint: z.unknown().nullable(),
  selectedVariantId: z.string().nullable(),
  decisions: z.array(z.unknown()),
  outcome: z.unknown().nullable(),
}).passthrough();

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

  private readStore(): z.infer<typeof JourneyStoreSchema> {
    const raw = this.storage.getItem(JOURNEY_STORAGE_KEY);
    if (raw) {
      try {
        return JourneyStoreSchema.parse(JSON.parse(raw));
      } catch {
        return { storageVersion: "2.0.0", activeContractId: null, journeys: {} };
      }
    }

    const legacyRaw = this.storage.getItem(LEGACY_JOURNEY_STORAGE_KEY);
    if (!legacyRaw) return { storageVersion: "2.0.0", activeContractId: null, journeys: {} };
    try {
      const legacy = LegacyJourneySchema.parse(JSON.parse(legacyRaw));
      const migrated = JourneyStateSchema.parse({
        ...legacy,
        storageVersion: "2.0.0",
        kind: "test",
        activationPlan: null,
      });
      const next = {
        storageVersion: "2.0.0" as const,
        activeContractId: migrated.contractId,
        journeys: { [migrated.contractId]: migrated },
      };
      this.storage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(next));
      this.storage.removeItem(LEGACY_JOURNEY_STORAGE_KEY);
      return next;
    } catch {
      return { storageVersion: "2.0.0", activeContractId: null, journeys: {} };
    }
  }

  load(contractId?: string): JourneyState | null {
    const store = this.readStore();
    const key = contractId ?? store.activeContractId;
    return key ? store.journeys[key] ?? null : null;
  }

  loadAll(): Record<string, JourneyState> {
    return this.readStore().journeys;
  }

  save(state: JourneyState): JourneyState {
    const parsed = JourneyStateSchema.parse(state);
    const current = this.readStore();
    this.storage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify({
      storageVersion: "2.0.0",
      activeContractId: parsed.contractId,
      journeys: { ...current.journeys, [parsed.contractId]: parsed },
    }));
    notifyJourneyChanged();
    return parsed;
  }

  clear(): void {
    this.storage.removeItem(JOURNEY_STORAGE_KEY);
    this.storage.removeItem(LEGACY_JOURNEY_STORAGE_KEY);
    notifyJourneyChanged();
  }
}
