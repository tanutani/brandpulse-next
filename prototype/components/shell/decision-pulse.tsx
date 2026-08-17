"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PULSE_STATIONS, type PulsePosition } from "@/lib/demo/journey";

/**
 * The continuous journey rail: Signal, Evidence, Route, Blocked action, Safe
 * test, Learning. It is the only ambient visual in the product and it animates
 * only when the active station genuinely changes.
 */
export function DecisionPulse({ position }: { position: PulsePosition }) {
  const [justChanged, setJustChanged] = useState(false);
  const previousIndex = useRef(position.activeIndex);

  useEffect(() => {
    if (previousIndex.current === position.activeIndex) return;
    previousIndex.current = position.activeIndex;
    setJustChanged(true);
    const timer = window.setTimeout(() => setJustChanged(false), 450);
    return () => window.clearTimeout(timer);
  }, [position.activeIndex]);

  return (
    <nav className="decision-pulse" aria-label="Decision journey">
      <div className="shell-frame">
        <ol className="pulse-track">
          {PULSE_STATIONS.map((station, index) => {
            const complete = index < position.completedCount;
            const current = index === position.activeIndex;
            const status = complete ? "complete" : current ? "current" : "upcoming";

            return (
              <li
                key={station.id}
                className={[
                  "pulse-station",
                  complete ? "is-complete" : "",
                  current ? "is-current" : "",
                  current && justChanged ? "just-changed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ ["--pulse-accent" as string]: station.accent }}
                aria-current={current ? "step" : undefined}
              >
                <span className="pulse-node" aria-hidden="true">
                  {complete ? <Check size={11} strokeWidth={3} /> : null}
                </span>
                <span className="pulse-label">{station.label}</span>
                <span className="visually-hidden">{status}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
