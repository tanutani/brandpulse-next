import { OpportunityList } from "@/components/pulse/opportunity-list";
import { SignalRoom } from "@/components/pulse/signal-room";
import { SynthesisPanel } from "@/components/pulse/synthesis-panel";
import { HERO_OPPORTUNITY_ID } from "@/lib/demo/journey";
import { loadFixtureBundle } from "@/lib/fixtures";
import { getWeakestGate } from "@/lib/routing/select-route";
import { getSignalReplay } from "@/lib/signals/signal-replay";

/** The command centre: live signal replay, bounded synthesis, and open decisions. */
export default function PulseRoomPage() {
  const contracts = loadFixtureBundle().contracts;
  const replay = getSignalReplay(HERO_OPPORTUNITY_ID);

  const opportunities = contracts.map((contract) => {
    const assessment =
      contract.brandAssessments.find(({ brandId }) => brandId === contract.selectedBrandId) ??
      contract.brandAssessments[0];
    const weakest = getWeakestGate(assessment.proof, assessment.permission, assessment.preparedness);

    return {
      id: contract.opportunity.id,
      title: contract.opportunity.title,
      signalClass: contract.opportunity.signalClass.replaceAll("_", " "),
      evidenceCount: contract.opportunity.evidence.length,
      weakestGate: `${weakest.gate} ${weakest.score}`,
      route: contract.recommendedRoute,
      primary: contract.opportunity.id === HERO_OPPORTUNITY_ID,
    };
  });

  return (
    <div className="shell-frame">
      <header className="page-head">
        <div>
          <h1>Pulse Room</h1>
          <p>
            Signal arrives, evidence is grouped and challenged, then one decision moves forward. The
            Rexona window is the live journey; the other two show what the router rejects and defers.
          </p>
        </div>
      </header>

      <div className="pulse-room">
        <div className="stack">
          {replay ? (
            <SignalRoom replay={replay} />
          ) : (
            <section className="system-state">
              <h2>No bundled replay for this workspace</h2>
              <p>The deterministic decision chain below is unaffected.</p>
            </section>
          )}
          <SynthesisPanel opportunityId={HERO_OPPORTUNITY_ID} />
        </div>

        <div className="stack">
          <section aria-labelledby="open-decisions-title">
            <div className="section-head">
              <div>
                <p className="section-kicker">Open decisions</p>
                <h2 id="open-decisions-title">Three signals, three different answers</h2>
              </div>
            </div>
            <OpportunityList opportunities={opportunities} />
          </section>
        </div>
      </div>
    </div>
  );
}
