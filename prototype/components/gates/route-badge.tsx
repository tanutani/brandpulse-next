import { Route } from "lucide-react";

import type { Route as RouteValue } from "@/lib/contracts";

const LABELS: Record<RouteValue, string> = {
  act_now: "Act now",
  test: "Test",
  incubate: "Incubate",
  watch: "Watch",
  ignore: "Ignore",
};

export function RouteBadge({ route }: { route: RouteValue }) {
  return (
    <span className={`route-badge route-${route}`}>
      <Route aria-hidden="true" size={13} /> {LABELS[route]}
    </span>
  );
}
