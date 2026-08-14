# Feature Specification: BrandPulse Causal Opportunity Router

**Feature Branch**: `001-causal-opportunity-router`

**Created**: 2026-08-06

**Status**: Ready for implementation

**Input**: User description: "Create a governed signal-to-action product for HUL brand teams that combines fragmented consumer and market signals, distinguishes fads from durable trends, identifies the right portfolio brand and action, creates a causal test and approved activation brief, and keeps humans and brand/legal guardrails in control."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Turn a signal into an evidence-backed route (Priority: P1)

As a brand manager, I select an emerging cultural or consumer signal and receive a structured
Opportunity Contract that separates evidence from inference, shows the strongest counter-evidence,
and routes the signal to Act Now, Test, Incubate, Watch, or Ignore.

**Why this priority**: This replaces the fragmented manual synthesis described in the case and is
the smallest independently valuable product journey.

**Independent Test**: A user can select one bundled signal and reach a traceable route without using
any other feature; the route changes when a decisive evidence or readiness input changes.

**Acceptance Scenarios**:

1. **Given** a high-velocity signal with corroborating consumer and commerce evidence, **When** the
   user opens it, **Then** the system displays its evidence, counter-evidence, freshness, uncertainty,
   signal class, and recommended route.
2. **Given** a viral signal with weak persistence and no behavioral progression, **When** it is
   evaluated, **Then** the system does not label it a durable trend and explains the missing proof.
3. **Given** conflicting sources, **When** a route is produced, **Then** the system visibly lowers
   confidence and may route the signal to Watch or Test rather than Act Now.

---

### User Story 2 - Assign the opportunity to the right portfolio brand (Priority: P2)

As a portfolio or category leader, I compare multiple HUL brands against the same opportunity so I
can see which brand has consumer permission, the strongest commercial fit, the lowest portfolio
conflict, and sufficient execution readiness.

**Why this priority**: External trend tools can identify signals, but HUL's portfolio, consumer,
commerce, and operations data can determine which brand should own the opportunity.

**Independent Test**: A user can compare at least three configured brands and see an explainable
ranking; changing a brand rule, audience fit, inventory constraint, or conflict changes the result.

**Acceptance Scenarios**:

1. **Given** three candidate brands, **When** the opportunity is resolved, **Then** each brand receives
   separate Proof, Permission, and Preparedness results with supporting evidence.
2. **Given** a brand with strong semantic fit but insufficient inventory in the target market,
   **When** the route is calculated, **Then** the system blocks a national Act Now recommendation and
   proposes a narrower test, alternative market, or Watch state.
3. **Given** two brands targeting the same audience and need state, **When** portfolio conflict is
   detected, **Then** the system surfaces cannibalization risk rather than recommending both without
   qualification.

---

### User Story 3 - Convert uncertainty into a causal micro-experiment (Priority: P3)

As a brand manager, I convert a promising but uncertain opportunity into a pre-registered Causal
Sprint that defines treatment and comparison cells, audience, channel, budget cap, success metric,
scale threshold, kill threshold, and measurement window before any content is activated.

**Why this priority**: It changes BrandPulse from another insights dashboard into a learning system
that can distinguish correlation from incremental value.

**Independent Test**: A user can generate and approve a complete experiment contract from a single
opportunity, then inspect simulated results against the pre-registered thresholds.

**Acceptance Scenarios**:

1. **Given** an opportunity routed to Test, **When** the user creates a Causal Sprint, **Then** the
   system proposes comparable treatment and comparison cells plus explicit scale and kill rules.
2. **Given** a proposed test with inadequate stock or non-comparable cells, **When** it is checked,
   **Then** the system blocks approval and explains the required correction.
3. **Given** simulated results below the kill threshold, **When** the result is evaluated, **Then** the
   system recommends stopping rather than retroactively changing the success metric.

---

### User Story 4 - Approve a governed activation package (Priority: P4)

As the accountable brand manager, I review an activation brief, channel variants, evidence,
brand/legal checks, operational constraints, and prior approvals before choosing Approve Test,
Request Changes, Watch, or Reject.

**Why this priority**: The launch explicitly requires human oversight, maker-checker controls, and
reliability for probabilistic AI output.

**Independent Test**: A reviewer can complete the maker-checker decision and see an audit record;
activation remains blocked when mandatory checks or approval are missing.

**Acceptance Scenarios**:

1. **Given** a compliant opportunity and valid experiment, **When** the responsible user approves it,
   **Then** a timestamped decision and rationale are added to the Opportunity Contract.
2. **Given** a prohibited claim, rights risk, or missing disclosure, **When** the activation package is
   reviewed, **Then** approval is blocked and the exact rule is shown.
3. **Given** no human approval, **When** a user attempts simulated activation, **Then** the system
   refuses the transition.

---

### User Story 5 - Learn from the result (Priority: P5)

As an insights leader, I compare the original hypothesis with the observed test result so that the
evidence, decision, activation, outcome, and human override become reusable organizational memory.

**Why this priority**: Without a learning ledger, the system accelerates output but does not improve
future decisions or reduce repeated research.

**Independent Test**: A completed test can be replayed from initial signal to outcome, including what
the system recommended, what humans changed, and whether the success threshold was met.

**Acceptance Scenarios**:

1. **Given** a completed simulated test, **When** the user opens its history, **Then** the original
   hypothesis, versioned evidence, approvals, changes, and result remain visible.
2. **Given** a human override, **When** the outcome is recorded, **Then** the override reason is retained
   and can be compared with the result.

### Edge Cases

- A signal is popular in one platform but absent from independent sources.
- A signal is durable but not relevant to any configured HUL brand.
- A brand has cultural permission but no product, inventory, or channel readiness.
- The best-fit brand conflicts with an existing campaign or another brand in the portfolio.
- Evidence is stale, geographically mismatched, duplicated, or based on a single creator.
- Public evidence disappears or becomes inaccessible after capture.
- A model response is malformed, times out, contradicts a policy rule, or cites no evidence.
- The system cannot form comparable treatment and comparison cells.
- A human requests activation after the opportunity's useful time window has expired.
- The prototype is opened while an external service is unavailable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a portfolio of emerging opportunities drawn from bundled public
  and synthetic HUL-like evidence.
- **FR-002**: The system MUST label every evidence item as observed public data, synthetic internal
  data, model inference, or business assumption.
- **FR-003**: The system MUST retain a source, collection date, geography, and freshness state for
  each observed evidence item.
- **FR-004**: The system MUST cluster evidence items into an opportunity without hiding the original
  records.
- **FR-005**: The system MUST classify each opportunity as a live moment, emerging shift, durable
  trend, fad/noise, or unresolved.
- **FR-006**: The system MUST calculate and explain separate Proof, Permission, and Preparedness
  results.
- **FR-007**: Proof MUST consider persistence, velocity, independent-source corroboration,
  geographic or cohort diffusion, behavioral progression, commercial evidence, and manipulation
  risk where data is available.
- **FR-008**: Permission MUST consider brand meaning, audience overlap, historical brand behavior,
  cultural ownership, portfolio conflict, and brand/legal risk.
- **FR-009**: Preparedness MUST consider relevant product or claim availability, target-market stock,
  channel coverage, creator or agency readiness, and approval timing.
- **FR-010**: A high score in one gate MUST NOT compensate for a failed mandatory gate.
- **FR-011**: The system MUST display the strongest supporting evidence and strongest
  counter-evidence before showing a final route.
- **FR-012**: The system MUST route opportunities to Act Now, Test, Incubate, Watch, or Ignore using
  explicit, inspectable decision rules.
- **FR-013**: The system MUST compare at least three configured portfolio brands for the same
  opportunity.
- **FR-014**: The system MUST surface potential cannibalization or conflicting brand ownership.
- **FR-015**: A user MUST be able to change a documented assumption and see the recommendation update.
- **FR-016**: The system MUST create a pre-registered experiment contract for Test routes, including
  hypothesis, cells, audience, channel, budget cap, measurement window, success threshold, and kill
  threshold.
- **FR-017**: Experiment approval MUST be blocked when minimum readiness, comparability, safety, or
  measurement requirements fail.
- **FR-018**: The system MUST generate a concise activation brief and at least two channel-specific
  variants for an approved test.
- **FR-019**: The system MUST check activation content against configured brand, claim, rights,
  disclosure, and channel rules.
- **FR-020**: Consequential simulated activation MUST require an explicit human maker-checker decision.
- **FR-021**: The system MUST record approval, rejection, requested changes, rationale, actor, and time
  in an audit history.
- **FR-022**: The system MUST show the opportunity's estimated useful time window and warn when it has
  expired.
- **FR-023**: The system MUST support a simulated test result and compare it with the pre-registered
  scale and kill rules.
- **FR-024**: The system MUST retain the relationship among signal, opportunity, brand decision,
  experiment, activation package, human decision, and outcome.
- **FR-025**: The primary demonstration MUST remain usable from a bundled snapshot when live data,
  model services, or persistence services are unavailable.
- **FR-026**: A failed or malformed model response MUST never bypass a deterministic decision or
  approval gate.
- **FR-027**: The interface MUST distinguish the competition prototype from the envisioned HUL
  production system and MUST not imply access to real HUL data.

### Key Entities

- **Signal Record**: A dated public or synthetic observation such as search interest, conversation,
  consumer-connect theme, commerce behavior, sales movement, inventory state, creator signal, or
  agency input.
- **Opportunity**: A cluster of related signal records with a hypothesis, scope, useful time window,
  signal class, and uncertainty.
- **Evidence Item**: A supporting or contradicting claim connected to its provenance, freshness,
  geography, quality, and synthetic/public status.
- **Brand Profile**: A configured portfolio brand's meaning, audience, products, claims, taboos,
  distinctive assets, historical actions, and approval rules.
- **Gate Assessment**: The Proof, Permission, or Preparedness calculation, component evidence,
  blocking rule, and explanation for one opportunity-brand pair.
- **Opportunity Contract**: The versioned decision object connecting the opportunity, selected brand,
  route, evidence, assumptions, counter-evidence, approvals, experiment, and outcome.
- **Causal Sprint**: A pre-registered test with hypothesis, treatment and comparison cells, exposure,
  budget, time window, measures, success rule, and kill rule.
- **Activation Package**: The approved brief, channel variants, creator or agency instructions,
  disclosures, and compliance status associated with a Causal Sprint.
- **Human Decision**: A timestamped approval, rejection, override, or change request with actor role
  and rationale.
- **Outcome**: The observed or simulated test result compared with its original success and kill
  thresholds.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can move from selecting a signal to understanding its recommended
  route and decisive evidence in under three minutes.
- **SC-002**: Every displayed recommendation includes at least two supporting evidence items, one
  counter-evidence item, a freshness state, and a visible uncertainty statement.
- **SC-003**: In all test scenarios, a failed mandatory legal, brand, inventory, or approval gate
  blocks Act Now and simulated activation.
- **SC-004**: Changing a decisive brand or readiness assumption updates the route in under two
  seconds and visibly identifies what changed.
- **SC-005**: A user can create and approve a complete Causal Sprint in under five minutes without
  entering data outside the application.
- **SC-006**: The full judged journey completes successfully from the bundled snapshot when all
  external services are disabled.
- **SC-007**: At least four of five proxy brand or marketing users can complete the primary task
  without facilitator help and correctly explain why the system chose its route.
- **SC-008**: All synthetic HUL-like records and simulated outcomes are visibly labeled throughout
  the interface and exported materials.
- **SC-009**: The audit history can reconstruct every state change, human decision, and rule that
  led from the selected signal to the final simulated outcome.
- **SC-010**: The submitted prototype demonstrates one credible scale decision and one caught failure
  or rejection within a five-minute walkthrough.

## Assumptions

- The registered competition team contains three eligible members, while one member is the primary
  prototype builder.
- The first-round submission uses three slides and is due on 20 August 2026; the internal build target
  is ten days.
- No private HUL data is available. Public evidence and clearly labeled synthetic HUL-like datasets
  will demonstrate how production integrations would work.
- Three representative HUL brands will be configured for portfolio comparison; the product remains
  brand-agnostic.
- The prototype demonstrates decision support and simulated activation rather than publishing to a
  real consumer channel or changing real inventory.
- Consumer and commerce data is aggregated to cohorts or geographic cells; person-level targeting is
  outside prototype scope.
- Live cultural-signal ingestion is optional for the judged flow; a dated snapshot is the reliable
  source of truth.
- Production deployment would integrate existing HUL capabilities rather than replace social
  listening, consumer research, media, creative, supply-planning, or assurance systems.
- Cost and value estimates will be ranges based on an explicit resource model and labeled assumptions.
