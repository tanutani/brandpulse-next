import { Cable, LockKeyhole } from "lucide-react";

import { PRODUCTION_CONNECTIONS } from "@/lib/demo/model";

const LATER_CAPABILITIES = [
  "Authenticated enterprise roles and multi-user maker-checker workflow",
  "Server-side versioned contract, audit, and outcome storage",
  "Permissioned retrieval and model synthesis over approved enterprise evidence",
  "Event ingestion, data-quality monitoring, lineage, consent, and retention controls",
  "Experiment telemetry, statistical review, and contribution measurement",
  "Approved downstream campaign handoff—never autonomous publishing",
];

export function ProductionConnections() {
  return (
    <section className="production-connections" aria-labelledby="connections-title">
      <div className="connections-heading">
        <div>
          <p className="eyebrow">Where HUL data access would help</p>
          <h2 id="connections-title">Eight proposed connection contracts replace the demo fixtures.</h2>
        </div>
        <p className="connection-caveat"><LockKeyhole aria-hidden="true" size={17} /> Proposed interfaces—not confirmed HUL API paths or current access.</p>
      </div>
      <div className="connection-table" role="table" aria-label="Proposed production data connections">
        <div className="connection-row connection-header" role="row">
          <span role="columnheader">Model stage</span><span role="columnheader">Future interface and data</span><span role="columnheader">Decision it improves</span><span role="columnheader">What the prototype uses</span>
        </div>
        {PRODUCTION_CONNECTIONS.map((connection) => (
          <div className="connection-row" role="row" key={connection.proposedInterface}>
            <div role="cell"><Cable aria-hidden="true" size={15} /><strong>{connection.stage}</strong></div>
            <div role="cell"><code>{connection.proposedInterface}</code><small>{connection.accessPattern}</small><p>{connection.dataAccess}</p></div>
            <p role="cell">{connection.decisionUse}</p>
            <p role="cell">{connection.prototypeSubstitute}</p>
          </div>
        ))}
      </div>
      <div className="later-capabilities">
        <div><p className="eyebrow">Added after the competition prototype</p><h3>Production capabilities that are intentionally absent today.</h3></div>
        <ul>{LATER_CAPABILITIES.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>
  );
}
