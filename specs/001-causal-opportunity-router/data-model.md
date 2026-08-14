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
OpportunityContractVersion 0 --- * HumanDecision
CausalSprint 0 --- 1 Outcome
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

### HumanDecision

| Field | Type | Notes |
|---|---|---|
| id | string | Append-only ID |
| actor | object | Prototype role and display name; no auth claim |
| decision | enum | approve_test, request_changes, watch, reject, override |
| rationale | string | Required |
| decidedAt | datetime | UTC |
| contractVersion | integer | Exact reviewed version |

### Outcome

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
