"use client";

import {
  Boxes,
  Newspaper,
  Play,
  RotateCcw,
  ScanLine,
  ShieldAlert,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useGuide } from "@/components/guide/guide-provider";
import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import type { SignalSourceType, SyntheticSignalEvent } from "@/lib/contracts/live-ai";
import { eventsRevealedAt, type SignalReplay } from "@/lib/signals/signal-replay";

const SOURCE_ICONS: Record<SignalSourceType, ReactNode> = {
  sports_news: <Newspaper aria-hidden="true" size={12} />,
  search: <TrendingUp aria-hidden="true" size={12} />,
  consumer_language: <ScanLine aria-hidden="true" size={12} />,
  commerce: <ShoppingCart aria-hidden="true" size={12} />,
  inventory: <Boxes aria-hidden="true" size={12} />,
  rights: <ShieldAlert aria-hidden="true" size={12} />,
};

const SOURCE_LABELS: Record<SignalSourceType, string> = {
  sports_news: "Sports / news",
  search: "Search",
  consumer_language: "Consumer language",
  commerce: "Q-commerce",
  inventory: "Inventory",
  rights: "Rights",
};

const TICK_MS = 100;

function SignalRow({ event }: { event: SyntheticSignalEvent }) {
  return (
    <li className={`signal-event source-${event.sourceType}`}>
      <span className="signal-time">{(event.offsetMs / 1000).toFixed(1)}s</span>
      <div>
        <span className="signal-source">
          {SOURCE_ICONS[event.sourceType]} {SOURCE_LABELS[event.sourceType]}
        </span>
        <strong>{event.label}</strong>
        <p>{event.detail}</p>
        <span className="evidence-id mono">{event.evidenceIds.join(" · ")}</span>
      </div>
      <span className="signal-value">
        {event.value}
        {typeof event.delta === "number" ? (
          <span className={`signal-delta ${event.delta >= 0 ? "is-up" : "is-down"}`}>
            {event.delta >= 0 ? "+" : ""}
            {event.delta}
          </span>
        ) : null}
      </span>
    </li>
  );
}

export function SignalRoom({ replay }: { replay: SignalReplay }) {
  const guide = useGuide();
  // Starts complete: a first-time visitor sees the evidence, then replays it.
  const [elapsed, setElapsed] = useState<number>(replay.durationMs);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setRunning(false);
  }, []);

  useEffect(() => stop, [stop]);

  function replaySignal() {
    stop();
    setElapsed(-1);
    setRunning(true);
    const startedAt = Date.now();
    timer.current = window.setInterval(() => {
      const next = Date.now() - startedAt;
      if (next >= replay.durationMs) {
        setElapsed(replay.durationMs);
        stop();
        guide.completeAction("replay-signal");
      } else {
        setElapsed(next);
      }
    }, TICK_MS);
  }

  const events = eventsRevealedAt(replay, elapsed);
  const progress = Math.min(100, Math.max(0, (elapsed / replay.durationMs) * 100));

  return (
    <section className="surface" aria-labelledby="signal-room-title">
      <div className="signal-room-head">
        <div>
          <p className="section-kicker">Signal room</p>
          <h2 id="signal-room-title" style={{ fontSize: 18 }}>
            {replay.label}
          </h2>
        </div>
        <ProvenanceBadge type="synthetic_internal" label="Simulated · no network" />
      </div>

      <div aria-hidden="true" style={{ height: 2, background: "var(--surface-muted)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--signal-teal)",
            transition: "width 100ms linear",
          }}
        />
      </div>

      <ol className="signal-feed scroll-panel" aria-live="polite" aria-busy={running}>
        {events.map((event) => (
          <SignalRow event={event} key={event.id} />
        ))}
      </ol>

      <div className="signal-room-actions">
        <button
          className="btn btn-secondary"
          data-guide-anchor="replay-signal"
          disabled={running}
          onClick={replaySignal}
          type="button"
        >
          {running ? (
            <>
              <RotateCcw aria-hidden="true" size={15} /> Replaying…
            </>
          ) : (
            <>
              <Play aria-hidden="true" size={15} /> Replay signal
            </>
          )}
        </button>
        <span className="muted small" style={{ alignSelf: "center" }}>
          {events.length} of {replay.events.length} signals · fixed order, no live feed
        </span>
      </div>
    </section>
  );
}
