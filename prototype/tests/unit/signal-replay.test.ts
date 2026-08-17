import { describe, expect, it } from "vitest";

import { REPLAY_DURATION_MS, SyntheticSignalEventSchema } from "@/lib/contracts/live-ai";
import { getApprovedEvidenceIds } from "@/lib/evidence/evidence-registry";
import { eventsRevealedAt, getSignalReplay, isReplayComplete } from "@/lib/signals/signal-replay";

const HERO = "opp-extra-time-sweat-confidence";

describe("synthetic signal replay", () => {
  const replay = getSignalReplay(HERO);

  it("bundles a labelled five-second replay for the hero opportunity", () => {
    expect(replay).not.toBeNull();
    expect(replay?.label).toBe("Simulated live replay");
    expect(replay?.durationMs).toBe(REPLAY_DURATION_MS);
  });

  it("covers every required signal family", () => {
    const sourceTypes = replay!.events.map((event) => event.sourceType);
    expect(new Set(sourceTypes)).toEqual(
      new Set(["sports_news", "search", "consumer_language", "commerce", "inventory", "rights"]),
    );
  });

  it("keeps a fixed ascending order inside the five-second window", () => {
    const offsets = replay!.events.map((event) => event.offsetMs);
    expect(offsets).toEqual([...offsets].sort((a, b) => a - b));
    expect(new Set(offsets).size).toBe(offsets.length);
    expect(Math.max(...offsets)).toBeLessThanOrEqual(REPLAY_DURATION_MS);
  });

  it("validates every event against the strict event schema", () => {
    for (const event of replay!.events) {
      expect(SyntheticSignalEventSchema.safeParse(event).success).toBe(true);
    }
  });

  it("cites only approved evidence and flags synthetic records", () => {
    const approved = getApprovedEvidenceIds(HERO);
    for (const event of replay!.events) {
      expect(event.evidenceIds.length).toBeGreaterThan(0);
      for (const id of event.evidenceIds) expect(approved.has(id)).toBe(true);
      expect(event.synthetic).toBe(event.evidenceType === "synthetic_internal");
    }
  });

  it("reveals the same events for the same elapsed time", () => {
    expect(eventsRevealedAt(replay!, 0)).toHaveLength(1);
    expect(eventsRevealedAt(replay!, 1_599).map((event) => event.id)).toEqual(
      eventsRevealedAt(replay!, 1_599).map((event) => event.id),
    );
    expect(eventsRevealedAt(replay!, 2_400)).toHaveLength(4);
    expect(eventsRevealedAt(replay!, REPLAY_DURATION_MS)).toHaveLength(replay!.events.length);
  });

  it("resets to an empty board before the first event", () => {
    expect(eventsRevealedAt(replay!, -1)).toHaveLength(0);
    expect(isReplayComplete(replay!, 0)).toBe(false);
    expect(isReplayComplete(replay!, REPLAY_DURATION_MS)).toBe(true);
  });

  it("has no replay for a non-hero opportunity", () => {
    expect(getSignalReplay("opp-scalp-skinification")).toBeNull();
  });
});
