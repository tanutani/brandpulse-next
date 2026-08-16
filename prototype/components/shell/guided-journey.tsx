"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CONTRACT_STORAGE_KEY } from "@/lib/persistence/local-contract-store";
import { JOURNEY_STORAGE_KEY } from "@/lib/persistence/local-journey-store";
import { DEMO_STEPS, HERO_OPPORTUNITY_ID, type DemoStepId } from "@/lib/demo/model";

export function GuidedJourney({ activeStep }: { activeStep: DemoStepId }) {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const activeIndex = DEMO_STEPS.findIndex(({ id }) => id === activeStep);

  function resetDemo() {
    setResetting(true);
    window.localStorage.removeItem(JOURNEY_STORAGE_KEY);
    window.localStorage.removeItem(CONTRACT_STORAGE_KEY);
    router.push(`/opportunities/${HERO_OPPORTUNITY_ID}`);
    router.refresh();
  }

  return (
    <nav className="guided-journey" aria-label="Guided demo progress">
      <div className="guided-journey-heading">
        <div>
          <span>Guided Rexona use case</span>
          <strong>One signal. One accountable decision chain.</strong>
        </div>
        <button type="button" onClick={resetDemo} disabled={resetting}>
          <RotateCcw aria-hidden="true" size={14} /> {resetting ? "Resetting…" : "Reset demo"}
        </button>
      </div>
      <ol>
        {DEMO_STEPS.map((step, index) => {
          const status = index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming";
          return (
            <li className={status} aria-current={status === "current" ? "step" : undefined} key={step.id}>
              <span>{status === "complete" ? <Check aria-hidden="true" size={13} /> : step.number}</span>
              <div><strong>{step.label}</strong><small>{step.plainLanguage}</small></div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
