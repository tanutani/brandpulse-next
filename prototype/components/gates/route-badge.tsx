import { Route } from "lucide-react";

import type { ActionMode, Route as RouteValue } from "@/lib/contracts";

const LABELS: Record<RouteValue, string> = {
  act_now: "Act now",
  test: "Test",
  incubate: "Incubate",
  watch: "Watch",
  ignore: "Ignore",
};

export function getActionLabel(route: RouteValue, actionMode?: ActionMode): string {
  if (route === "act_now") {
    return actionMode === "defensive_response"
      ? "Act now — defensive response"
      : "Act now — growth activation";
  }
  return {
    test: "Test — bounded experiment",
    incubate: "Incubate — claims capability",
    watch: "Watch — gather evidence",
    ignore: "Ignore — no action",
  }[route];
}

export function RouteBadge({ route, actionMode }: { route: RouteValue; actionMode?: ActionMode }) {
  return (
    <span className={`route-badge route-${route}`}>
      <Route aria-hidden="true" size={13} /> {actionMode ? getActionLabel(route, actionMode) : LABELS[route]}
    </span>
  );
}
