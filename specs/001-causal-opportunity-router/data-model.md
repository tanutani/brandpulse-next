# Data Model: BrandPulse Causal Opportunity Router

## Modeling rules

- All identifiers are stable strings. Every decision object carries a schema version.
- `public`, `synthetic_internal`, `model_inference`, and `business_assumption` are distinct evidence
  types and must never be collapsed.
- Derived scores retain their input components and ruleset version.
- Human decisions are append-only. A correction creates a new record rather than rewriting history.
- Timestamps are ISO 8601 UTC; geographic scope is explicit; optional values are `null`, not silently
  omitted when their absence changes interpretation.

## Entity relationships

```text
Opportunity 1 --- * SignalRecord
Opportunity 1 --- * EvidenceItem
Opportunity 1 --- * OpportunityContractVersion
OpportunityContractVersion * --- * BrandProfile (through BrandAssessment)
BrandAssessment 1 --- 3 GateAssessment (Proof, Permission, Preparedness)
OpportunityContractVersion 0 --- 1 CausalSprint
CausalSprint 0 --- 1 ActivationPackage
OpportunityContractVersion 0 --- 1 MonitoredActivationPlan
OpportunityContractVersion 0 --- * HumanDecision
CausalSprint 0 --- 1 CausalOutcome
MonitoredActivationPlan 0 --- 1 MonitoredOutcome
```

## Core entities

### SignalRecord

| Field | Type | Notes |
|---|---|---|
| id | string | Stable source observation ID |
| observedAt | datetime | When the signal occurred |
| capturedAt | datetime | When the prototype snapshot was created |
| sourceType | enum | search, social, news, consumer_connect, commerce, offtake, inventory, creator, agency |
| topic | string | Normalized topic label |
| geography | string | Market or synthetic cell |
| metrics | object | Source-specific numeric values |
| sourceUrl | URL or null | Required for public evidence |
| evidenceType | enum | public, synthetic_internal, model_inference, business_assumption |
| synthetic | boolean | Redundant visible safety flag |

### EvidenceItem

| Field | Type | Notes |
|---|---|---|
| id | string | Stable ID |
| signalIds | string[] | Underlying records |
| stance | enum | support, contradict, neutral |
| claim | string | Short claim, not hidden chain-of-thought |
| quality | number 0-100 | Rule-based quality assessment |
| freshness | enum | live, recent, aging, stale |
| independentSourceFamily | string | Used for corroboration, not raw count |
| geography | string | Explicit applicability |
| evidenceType | enum | Same provenance taxonomy |

### Opportunity

| Field | Type | Notes |
|---|---|---|
| id | string | Stable opportunity ID |
| title | string | Judge-readable title |
| hypothesis | string | Falsifiable consumer/business claim |
| signalClass | enum | live_moment, emerging_shift, durable_trend, fad_noise, unresolved |
| usefulUntil | datetime | Expiry for action |
| geography | string[] | Applicable markets/cells |
| audience | string[] | Aggregated cohorts |
| signalIds | string[] | Original records |
| evidenceIds | string[] | Supporting and contradicting evidence |

### BrandProfile

| Field | Type | Notes |
|---|---|---|
| id | string | Brand key |
| name | string | Display name |
| category | string | Portfolio grouping |
| positioning | string | Configured brand meaning |
| audience | string[] | Priority cohorts |
| claimsAllowed | string[] | Prototype policy vocabulary |
| claimsProhibited | string[] | Hard blockers |
| taboos | string[] | Cultural and tone rules |
| distinctiveAssets | string[] | Configured creative memory |
| historicPermissions | string[] | Past credible territories |
| activeCampaigns | string[] | Portfolio conflict inputs |
| rulesetVersion | string | Configuration lineage |

### GateAssessment

| Field | Type | Notes |
|---|---|---|
| gate | enum | proof, permission, preparedness |
| score | integer 0-100 | Weighted component result |
| components | ComponentScore[] | Name, value, weight, evidence IDs |
| blockers | Blocker[] | Rule ID, severity, evidence, remediation |
| missingEvidence | string[] | What would resolve uncertainty |
| rulesetVersion | string | Exact scoring policy |

### BrandAssessment

| Field | Type | Notes |
|---|---|---|
| brandId | string | Candidate brand |
| proof | GateAssessment | Opportunity proof may share inputs but is versioned per comparison |
| permission | GateAssessment | Brand-specific |
| preparedness | GateAssessment | Brand-market-channel specific |
| readiness | integer 0-100 | Minimum of three gate scores |
| portfolioConflicts | PortfolioConflict[] | Cannibalization or ownership ambiguity |
| eligibleRoutes | Route[] | Before final selection |

### OpportunityContractVersion

| Field | Type | Notes |
|---|---|---|
| contractId | string | Stable across versions |
| version | integer | Monotonic |
| opportunityId | string | Parent opportunity |
| createdAt | datetime | Version timestamp |
| rulesetVersion | string | Scoring and route configuration |
| selectedBrandId | string or null | Human-confirmed owner |
| brandAssessments | BrandAssessment[] | At least three in prototype |
| recommendedRoute | enum | act_now, test, incubate, watch, ignore |
| actionMode | enum | growth_activation, defensive_response, bounded_test, capability_build, monitor, no_action |
| portfolioContext | enum | hul_current or kwil_ecosystem; prevents ownership inference from brand name |
| routeReasonCodes | string[] | Deterministic explanation |
| assumptions | Assumption[] | Label, value, source, owner |
| causalSprintId | string or null | Present for Test |
| humanDecisionIds | string[] | Append-only approvals/overrides |
| outcomeId | string or null | Present after simulation or live measurement |

### CausalSprint

| Field | Type | Notes |
|---|---|---|
| id | string | Stable test ID |
| hypothesis | string | Pre-registered statement |
| treatmentCells | Cell[] | Geographic, creator, or audience clusters |
| comparisonCells | Cell[] | Matched cells without the treatment |
| channel | enum | Prototype-supported channel |
| budgetCapInr | number | Hard cap |
| primaryMetric | string | One primary success metric |
| guardrailMetrics | string[] | Brand/sales/service safety |
| measurementWindow | object | Start and end fixed before approval |
| scaleThreshold | Rule | Pre-registered |
| killThreshold | Rule | Pre-registered |
| comparabilityScore | integer 0-100 | Deterministic |
| validationStatus | enum | draft, valid, blocked |

### ActivationPackage

| Field | Type | Notes |
|---|---|---|
| id | string | Stable ID |
| sprintId | string | Parent test |
| brief | object | Audience, insight, proposition, support, mandatory, exclusions |
| variants | ChannelVariant[] | At least two in prototype |
| policyChecks | PolicyCheck[] | Rule, status, evidence, remediation |
| status | enum | draft, changes_requested, approved, rejected |

Activation packages are stored as a bundle keyed by opportunity ID. Rexona and Surf therefore use
different claims, rights, disclosures, expiry dates, and blocked/corrected variants.

### MonitoredActivationPlan

| Field | Type | Notes |
|---|---|---|
| id | string | Stable activation-plan ID |
| activationWindow | object | Fixed start and end |
| selectedScope | enum | national or four_city |
| channel | string | Selected activation channel(s) |
| descriptiveSuccessMetric | string | Observation only; not an incrementality metric |
| inventoryServiceGuardrail | number 0-1 | Prepared service floor |
| backlashGuardrail | number 0-1 | Maximum negative-response rate |
| stopRule | string | Human-readable pause condition |
| approvalState | enum | pending, approved, changes_requested |

### HumanDecision

| Field | Type | Notes |
|---|---|---|
| id | string | Append-only ID |
| actor | object | Prototype role and display name; no auth claim |
| decision | enum | approve_test, approve_activation, request_changes, watch, reject, override |
| rationale | string | Required |
| decidedAt | datetime | UTC |
| contractVersion | integer | Exact reviewed version |

### CausalOutcome

| Field | Type | Notes |
|---|---|---|
| id | string | Stable ID |
| sprintId | string | Parent test |
| observedMetrics | object | Synthetic for prototype |
| incrementalEffect | number | Difference or modeled lift |
| confidenceInterval | object | Lower and upper when available |
| decision | enum | scale, iterate, kill, inconclusive |
| reasonCodes | string[] | Compared only with pre-registered rules |
| synthetic | boolean | Always true in first-round demo |

### MonitoredOutcome

| Field | Type | Notes |
|---|---|---|
| id | string | Stable synthetic result ID |
| activationPlanId | string | Parent monitored plan |
| observedAt | datetime | Observation timestamp |
| successMetric | string | Must match the plan's descriptive metric |
| observedValue | number | Descriptive observed value |
| inventoryService | number 0-1 | Guardrail observation |
| backlashRate | number 0-1 | Guardrail observation |
| decision | enum | continue, pause, complete |
| observationBasis | literal | descriptive_no_control |
| synthetic | true | Never represented as an HUL result |

Monitored outcomes deliberately have no treatment rate, comparison rate, incremental effect, or
confidence interval. This shape prevents causal language by construction.

### Journey persistence v2

The browser stores `{ storageVersion: "2.0.0", activeContractId, journeys }`, with `journeys` keyed
by contract ID. Each record is a `test` or `act` discriminated union. Loading a valid v1 Rexona
record migrates it once into the keyed map and removes the legacy key.

## Fixture contracts

| File | Minimum contents |
|---|---|
| `signals.json` | id, observedAt, sourceType, topic, geography, metrics, sourceUrl, evidenceType, synthetic |
| `consumer-connects.jsonl` | interview ID, date, cohort, verbatim, theme, consent scope, synthetic |
| `commerce-offtake.json` | date, cell, channel, SKU, units, search index, out-of-stock rate, basket attach, synthetic |
| `brand-memory.json` | positioning, claims, taboos, audience, assets, history, active campaigns, ruleset version |
| `inventory.json` | SKU, cell, days cover, service level, timestamp, synthetic |
| `influencers.json` | aggregate creator ID, audience, category, engagement, safety, geography, cost, synthetic |

## Validation invariants

1. A public evidence item has a source URL and capture date.
2. A synthetic record is displayed as synthetic in every view that uses it.
3. An Act Now recommendation requires a non-expired opportunity, all numeric thresholds, and no
   mandatory blocker; simulated activation additionally requires an approving HumanDecision for the
   current contract version.
4. A Test cannot be approved without valid treatment/comparison cells, budget cap, primary metric,
   measurement window, scale rule, and kill rule.
5. Outcome evaluation uses the thresholds stored on the approved sprint version.
6. The weakest of Proof, Permission, and Preparedness equals readiness.
7. A model-generated explanation cannot write gate scores, route, approval, or outcome decision.
8. Every identifier cited by a synthesis response must exist in the approved evidence set for that
   opportunity. An unknown identifier invalidates the whole response.
9. Live and fallback synthesis satisfy one schema, so decisions are identical in either mode.
10. `actionMode` explains operational intent but never writes or overrides the deterministic route.
11. A KWIL ecosystem contract is visibly disclosed and is never described as current HUL ownership.
12. An Act outcome is descriptive; only a locked Test route may produce causal evaluation fields.

## Live signal room and synthesis (additive, v1.1)

These entities were added for the live AI product demo. They do not alter any entity above.

### SyntheticSignalEvent

One event in the bundled Rexona replay. The replay is a fixed local sequence over checked-in
fixtures; it makes no network request and reads no live feed.

| Field | Type | Notes |
|---|---|---|
| id | string | Stable event ID |
| offsetMs | integer 0-5000 | Position in the fixed five-second window |
| sourceType | enum | sports_news, search, consumer_language, commerce, inventory, rights |
| label | string | Short headline |
| detail | string | One sentence of context |
| value | number or string | Displayed figure |
| delta | number or null | Movement, when meaningful |
| evidenceIds | string[] | Must all exist in the approved evidence set |
| evidenceType | enum | public or synthetic_internal only |
| synthetic | boolean | Must agree with evidenceType |

Invariants: offsets are strictly ascending and unique, all offsets fall inside the window, and the
replay is resettable to an empty board.

### SynthesisRequest

| Field | Type | Notes |
|---|---|---|
| opportunityId | string | Must be a bundled opportunity |
| evidenceVersion | string | Must match the server's approved evidence version |

No other field is accepted. There is no caller-authored prompt and no caller-supplied evidence: the
server loads approved public and synthetic-aggregate evidence itself.

### SynthesisResponse

| Field | Type | Notes |
|---|---|---|
| mode | enum | live or precomputed_fallback |
| model | string or null | Null for the checked-in fallback |
| promptVersion | string | Prompt lineage |
| generatedAt | datetime | ISO 8601 UTC |
| summary | string | At most 600 characters |
| themes | Theme[] | 1-4 groupings, each citing evidence IDs |
| counterHypothesis | object | Claim plus the evidence IDs that support the doubt |
| missingEvidence | string[] | Up to four gaps |
| fallbackReason | enum or absent | disabled, missing_key, timeout, quota, invalid_output |

The response carries no route, score, blocker, approval, threshold, or outcome field. Extra fields
are rejected rather than ignored, so a model cannot smuggle a decision through an unexpected key.

### Approved evidence registry

`getApprovedEvidence(opportunityId)` assembles the citable set from the bundled contracts plus the
operational inventory, channel, and rights records. Model-inference items are deliberately excluded:
prior inference is never recycled as grounding for new inference.
