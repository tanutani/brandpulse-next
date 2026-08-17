import { z } from "zod";

import replayFixture from "@/public/data/signal-replay.json";
import { REPLAY_DURATION_MS, SyntheticSignalEventSchema } from "@/lib/contracts/live-ai";
import type { SyntheticSignalEvent } from "@/lib/contracts/live-ai";
import { citesOnlyKnownEvidence, isKnownOpportunityId } from "@/lib/evidence/evidence-registry";

/**
 * A fixed replay of checked-in evidence, not a live feed. Order and timing are
 * validated at module load so tests and the demo observe the same sequence every
 * run: the replay is a rehearsal aid, and a drifting one would be worse than none.
 */

const SignalReplaySchema = z
  .object({
    opportunityId: z.string().min(1),
    label: z.literal("Simulated live replay"),
    durationMs: z.literal(REPLAY_DURATION_MS),
    events: z.array(SyntheticSignalEventSchema).min(1),
  })
  .strict()
  .superRefine((replay, context) => {
    if (!isKnownOpportunityId(replay.opportunityId)) {
      context.addIssue({
        code: "custom",
        message: `Replay references an unknown opportunity: ${replay.opportunityId}`,
        path: ["opportunityId"],
      });
    }

    const seen = new Set<string>();
    let previousOffset = -1;

    replay.events.forEach((event, index) => {
      if (seen.has(event.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate replay event id: ${event.id}`,
          path: ["events", index, "id"],
        });
      }
      seen.add(event.id);

      if (event.offsetMs <= previousOffset) {
        context.addIssue({
          code: "custom",
          message: "Replay events must be stored in strictly ascending offset order.",
          path: ["events", index, "offsetMs"],
        });
      }
      previousOffset = event.offsetMs;

      if (!citesOnlyKnownEvidence(replay.opportunityId, event.evidenceIds)) {
        context.addIssue({
          code: "custom",
          message: `Replay event ${event.id} cites evidence outside the approved set.`,
          path: ["events", index, "evidenceIds"],
        });
      }

      if (event.synthetic !== (event.evidenceType === "synthetic_internal")) {
        context.addIssue({
          code: "custom",
          message: `Replay event ${event.id} has a synthetic flag that contradicts its evidence type.`,
          path: ["events", index, "synthetic"],
        });
      }
    });
  });

const ReplayFixtureSchema = z
  .object({
    fixtureVersion: z.literal("1.0.0"),
    generatedAt: z.iso.datetime({ offset: true }),
    disclosure: z.string().min(1),
    replays: z.array(SignalReplaySchema).min(1),
  })
  .strict();

export type SignalReplay = z.infer<typeof SignalReplaySchema>;

const parsedReplayFixture = ReplayFixtureSchema.parse(replayFixture);

export const REPLAY_DISCLOSURE = parsedReplayFixture.disclosure;

export function getSignalReplay(opportunityId: string): SignalReplay | null {
  return (
    parsedReplayFixture.replays.find((replay) => replay.opportunityId === opportunityId) ?? null
  );
}

/**
 * Events visible at a point in the replay. Callers drive `elapsedMs` from a
 * clock or a test, so the same elapsed value always yields the same list.
 */
export function eventsRevealedAt(replay: SignalReplay, elapsedMs: number): SyntheticSignalEvent[] {
  return replay.events.filter((event) => event.offsetMs <= elapsedMs);
}

export function isReplayComplete(replay: SignalReplay, elapsedMs: number): boolean {
  return elapsedMs >= replay.durationMs;
}
