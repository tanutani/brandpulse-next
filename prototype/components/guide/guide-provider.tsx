"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { GUIDE_STEPS, GUIDE_STORAGE_KEY, type GuideAnchorId, type GuideStep } from "@/lib/demo/journey";

/**
 * The guided conversation. Messages are anchored to real controls and an action
 * step advances only when that control actually succeeds, so the tour cannot
 * narrate something the product did not do.
 */

type GuideStatus = "inactive" | "running" | "skipped" | "finished";

interface GuideState {
  status: GuideStatus;
  index: number;
}

interface GuideApi extends GuideState {
  step: GuideStep | null;
  totalSteps: number;
  start: () => void;
  skip: () => void;
  restart: () => void;
  finish: () => void;
  /** Called by a control after its real action succeeded. */
  completeAction: (anchor: GuideAnchorId) => void;
}

const INITIAL: GuideState = { status: "inactive", index: 0 };

const GuideContext = createContext<GuideApi | null>(null);

function readStored(): GuideState {
  try {
    const raw = window.localStorage.getItem(GUIDE_STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<GuideState>;
    const status = parsed.status;
    const index = parsed.index;
    if (
      (status === "inactive" || status === "running" || status === "skipped" || status === "finished") &&
      typeof index === "number" &&
      index >= 0 &&
      index < GUIDE_STEPS.length
    ) {
      return { status, index };
    }
  } catch {
    // A corrupt or unavailable store must not break the product.
  }
  return INITIAL;
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuideState>(INITIAL);

  // Progress is restored after mount so the server and client markup agree.
  useEffect(() => {
    const stored = readStored();
    queueMicrotask(() => {
      if (stored.status !== INITIAL.status || stored.index !== INITIAL.index) setState(stored);
    });
  }, []);

  const persist = useCallback((next: GuideState) => {
    setState(next);
    try {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The tour still works for this session without persistence.
    }
  }, []);

  const completeAction = useCallback(
    (anchor: GuideAnchorId) => {
      setState((current) => {
        if (current.status !== "running") return current;
        if (GUIDE_STEPS[current.index]?.id !== anchor) return current;

        const nextIndex = current.index + 1;
        const next: GuideState =
          nextIndex >= GUIDE_STEPS.length
            ? { status: "finished", index: GUIDE_STEPS.length - 1 }
            : { status: "running", index: nextIndex };
        try {
          window.localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignored: see persist().
        }
        return next;
      });
    },
    [],
  );

  const api = useMemo<GuideApi>(
    () => ({
      ...state,
      step: state.status === "running" ? (GUIDE_STEPS[state.index] ?? null) : null,
      totalSteps: GUIDE_STEPS.length,
      start: () => persist({ status: "running", index: state.index }),
      skip: () => persist({ status: "skipped", index: state.index }),
      restart: () => persist({ status: "running", index: 0 }),
      finish: () => persist({ status: "finished", index: GUIDE_STEPS.length - 1 }),
      completeAction,
    }),
    [completeAction, persist, state],
  );

  return <GuideContext.Provider value={api}>{children}</GuideContext.Provider>;
}

/**
 * Safe outside the provider (server-rendered previews, tests) so a control can
 * always report its action without checking first.
 */
export function useGuide(): GuideApi {
  const context = useContext(GuideContext);
  return (
    context ?? {
      ...INITIAL,
      step: null,
      totalSteps: GUIDE_STEPS.length,
      start: () => {},
      skip: () => {},
      restart: () => {},
      finish: () => {},
      completeAction: () => {},
    }
  );
}
