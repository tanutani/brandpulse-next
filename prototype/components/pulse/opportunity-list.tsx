"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { RouteBadge } from "@/components/gates/route-badge";
import { useGuide } from "@/components/guide/guide-provider";
import type { ActionMode, Route } from "@/lib/contracts";

export interface OpportunitySummary {
  id: string;
  title: string;
  signalClass: string;
  evidenceCount: number;
  weakestGate: string;
  route: Route;
  actionMode: ActionMode;
  primary: "guided" | "act" | null;
}

export function OpportunityList({ opportunities }: { opportunities: OpportunitySummary[] }) {
  const guide = useGuide();
  const [filter, setFilter] = useState<Route | "all">("all");
  const visible = filter === "all" ? opportunities : opportunities.filter(({ route }) => route === filter);

  return (
    <>
      <div className="route-filters" role="group" aria-label="Filter opportunities by route">
        {(["all", "act_now", "test", "incubate", "watch", "ignore"] as const).map((route) => (
          <button aria-pressed={filter === route} key={route} onClick={() => setFilter(route)} type="button">
            {route === "all" ? "All" : route.replaceAll("_", " ")}
          </button>
        ))}
      </div>
      <div className="opportunity-list" aria-live="polite">
      {visible.map((opportunity) => (
        <Link
          className={`opportunity-row${opportunity.primary ? " is-primary" : ""}`}
          data-guide-anchor={opportunity.primary === "guided" ? "open-hero" : undefined}
          href={`/opportunities/${opportunity.id}`}
          key={opportunity.id}
          onClick={() => {
            if (opportunity.primary === "guided") guide.completeAction("open-hero");
          }}
        >
          <span>
            {opportunity.primary ? (
              <span className="primary-tag">
                <Star aria-hidden="true" size={11} /> {opportunity.primary === "guided" ? "Guided journey" : "ACT decision"}
              </span>
            ) : null}
            <strong>{opportunity.title}</strong>
            <span className="meta">
              <span>{opportunity.signalClass}</span>
              <span>{opportunity.evidenceCount} evidence records</span>
              <span className="mono">weakest {opportunity.weakestGate}</span>
            </span>
          </span>
          <span style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <RouteBadge route={opportunity.route} actionMode={opportunity.actionMode} />
            <span className="muted small" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Open <ArrowRight aria-hidden="true" size={13} />
            </span>
          </span>
        </Link>
      ))}
      </div>
    </>
  );
}
