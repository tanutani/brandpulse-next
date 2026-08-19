"use client";

import {
  Boxes,
  ExternalLink,
  Newspaper,
  Play,
  RadioTower,
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
import {
  fetchObservations,
  prewarmObservations,
  readObservations,
} from "@/lib/ai/client-agent-store";
import type {
  FallbackReason,
  ObservationResponse,
  SignalSourceType,
} from "@/lib/contracts/live-ai";
import { isStaticMode } from "@/lib/demo/static-mode";
import { eventsRevealedAt, type SignalReplay } from "@/lib/signals/signal-replay";

/**
 * The signal room plays evidence arriving over a five-second window.
 *
 * It renders two sources through one path: the checked-in replay, and live
 * public articles fetched from the GDELT open index at demo time. They look
 * alike on purpose — a failed live fetch falls back to the replay without the
 * layout shifting — but every live row is labelled and links to its article,
 * so no viewer can mistake one for the other.
 */

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

const LIVE_FALLBACK_EXPLANATIONS: Record<FallbackReason, string> = {
  disabled: "Offline mode — showing the checked-in evidence.",
  missing_key: "No provider key configured — showing the checked-in evidence.",
  timeout: "The live fetch ran past six seconds — showing the checked-in evidence.",
  quota: "The provider quota was exhausted — showing the checked-in evidence.",
  invalid_output: "The live response failed validation — showing the checked-in evidence.",
};

const TICK_MS = 100;

interface FeedRow {
  id: string;
  offsetMs: number;
  sourceType: SignalSourceType;
  label: string;
  detail: string;
  value: number | string;
  evidenceIds: string[];
  delta?: number;
  sourceUrl?: string;
  sourceDomain?: string;
}

function SignalRow({ row, isLive }: { row: FeedRow; isLive: boolean }) {
  return (
    <li className={`signal-event source-${row.sourceType}${isLive ? " is-live-row" : ""}`}>
      <span className="signal-time">{(row.offsetMs / 1000).toFixed(1)}s</span>
      <div>
        <span className="signal-source">
          {SOURCE_ICONS[row.sourceType]} {SOURCE_LABELS[row.sourceType]}
          {isLive ? <span className="live-tag">Live · AI-read</span> : null}
        </span>
        <strong>{row.label}</strong>
        <p>{row.detail}</p>
        {row.sourceUrl ? (
          <a className="signal-source-link" href={row.sourceUrl} rel="noreferrer" target="_blank">
            {row.sourceDomain} <ExternalLink aria-hidden="true" size={11} />
          </a>
        ) : (
          <span className="evidence-id mono">{row.evidenceIds.join(" · ")}</span>
        )}
      </div>
      <span className="signal-value">
        {row.value}
        {typeof row.delta === "number" ? (
          <span className={`signal-delta ${row.delta >= 0 ? "is-up" : "is-down"}`}>
            {row.delta >= 0 ? "+" : ""}
            {row.delta}
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
  const [fetching, setFetching] = useState(false);
  const [live, setLive] = useState<ObservationResponse | null>(() =>
    readObservations(replay.opportunityId),
  );
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setRunning(false);
  }, []);

  useEffect(() => stop, [stop]);

  // GDELT is far slower than the interactive budget, so start the read as soon
  // as the room opens. By the time anyone clicks, the cache is usually warm.
  useEffect(() => {
    prewarmObservations(replay.opportunityId);
  }, [replay.opportunityId]);

  const play = useCallback(
    (durationMs: number, onComplete?: () => void) => {
      stop();
      setElapsed(-1);
      setRunning(true);
      const startedAt = Date.now();
      timer.current = window.setInterval(() => {
        const next = Date.now() - startedAt;
        if (next >= durationMs) {
          setElapsed(durationMs);
          stop();
          onComplete?.();
        } else {
          setElapsed(next);
        }
      }, TICK_MS);
    },
    [stop],
  );

  function replaySignal() {
    play(replay.durationMs, () => guide.completeAction("replay-signal"));
  }

  async function fetchLive() {
    setFetching(true);
    const result = await fetchObservations(replay.opportunityId);
    setFetching(false);
    if (!result) return;

    setLive(result);
    // Play whichever feed we ended up with, so a silent fallback still animates.
    play(replay.durationMs, () => guide.completeAction("replay-signal"));
  }

  const isLiveFeed = live?.mode === "live";

  const rows: FeedRow[] = isLiveFeed
    ? live.observations.map((observation) => ({ ...observation }))
    : eventsRevealedAt(replay, replay.durationMs).map((event) => ({ ...event }));

  const visible = rows.filter((row) => row.offsetMs <= elapsed);
  const progress = Math.min(100, Math.max(0, (elapsed / replay.durationMs) * 100));
  const staticMode = isStaticMode();

  return (
    <section className="surface" aria-labelledby="signal-room-title">
      <div className="signal-room-head">
        <div>
          <p className="section-kicker">Signal room</p>
          <h2 id="signal-room-title" style={{ fontSize: 18 }}>
            {isLiveFeed ? "Live public evidence" : replay.label}
          </h2>
        </div>
        {isLiveFeed ? (
          <span className="mode-chip is-live">Live · GDELT</span>
        ) : (
          <ProvenanceBadge type="synthetic_internal" label="Simulated · no network" />
        )}
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

      {fetching ? (
        <div className="synthesis-idle is-loading-shimmer" aria-live="polite">
          <span className="muted small">
            Reading the GDELT open news index and extracting observations…
          </span>
          <span className="skeleton-line" />
          <span className="skeleton-line short" />
        </div>
      ) : (
        <ol className="signal-feed scroll-panel" aria-live="polite" aria-busy={running}>
          {visible.map((row) => (
            <SignalRow isLive={isLiveFeed} key={row.id} row={row} />
          ))}
        </ol>
      )}

      <div className="signal-room-actions">
        <button
          className="btn btn-secondary"
          data-guide-anchor="replay-signal"
          disabled={running || fetching}
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

        {staticMode ? null : (
          <button
            className="btn btn-secondary"
            disabled={running || fetching}
            onClick={fetchLive}
            type="button"
          >
            <RadioTower aria-hidden="true" size={15} />{" "}
            {fetching ? "Fetching…" : "Fetch live evidence"}
          </button>
        )}

        <span className="muted small" style={{ alignSelf: "center" }}>
          {visible.length} of {rows.length} signals ·{" "}
          {isLiveFeed
            ? "fetched just now from public news"
            : "fixed order, no live feed"}
        </span>
      </div>

      {live && live.mode === "fixture_fallback" && live.fallbackReason ? (
        <p className="muted small signal-fallback-note" aria-live="polite">
          {LIVE_FALLBACK_EXPLANATIONS[live.fallbackReason]} Nothing else on the following
          screens changes.
        </p>
      ) : null}
    </section>
  );
}
