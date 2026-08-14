<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Added principles: Evidence Before Eloquence; Deterministic Gates Around Probabilistic AI;
  Demo Reliability and Graceful Degradation; Synthetic Data Transparency and Privacy;
  Solo-Build Scope Discipline
- Added sections: Prototype Constraints; Development and Demo Quality Gates
- Removed sections: none (template placeholders replaced)
- Follow-up TODOs: none
-->
# BrandPulse NEXT Constitution

## Core Principles

### I. Evidence Before Eloquence
Every Act, Test, Watch, Incubate, or Ignore recommendation MUST expose the supporting
evidence, counter-evidence, data freshness, provenance, and uncertainty. The product MUST
distinguish observed public facts, synthetic HUL-like data, model inference, and business
assumptions. A fluent model explanation is never evidence by itself. This is necessary because
the case explicitly rewards product thinking, technical feasibility, and business impact rather
than generic generative-AI output.

### II. Deterministic Gates Around Probabilistic AI
Language models MAY extract, classify, summarize, and draft, but MUST NOT autonomously publish
brand content or override the Proof, Permission, Preparedness, legal, inventory, or human-approval
gates. Decision thresholds, allowed state transitions, and escalation rules MUST be deterministic,
typed, and testable. Human maker-checker approval MUST remain visible for consequential brand
actions, reflecting the launch guidance on reliability and AI assurance.

### III. Demo Reliability and Graceful Degradation
The submitted demonstration MUST complete its primary journey from a bundled data snapshot even
when a live API, model provider, or database is unavailable. Model calls MUST have timeouts,
schema validation, a retry limit, and a precomputed fallback result. The public Vercel deployment
MUST have a rehearsed local fallback and MUST never expose an unfinished or empty screen during
the judged flow. Reliability is a product feature, not an implementation afterthought.

### IV. Synthetic Data Transparency and Privacy
All HUL-like consumer-connect, commerce, outlet, inventory, influencer, and campaign-performance
records used in the prototype MUST be synthetic and visibly labeled as such. Public data MUST
retain source links and collection dates. The prototype MUST use aggregated cohorts or geographic
cells rather than real person-level targeting. No private HUL data, credentials, or personal data
may be stored in the repository, browser bundle, logs, or model prompts.

### V. Solo-Build Scope Discipline
The ten-day prototype MUST optimize for one complete, memorable vertical slice rather than broad
feature coverage. Each dependency, screen, agent, and data source MUST directly support the judged
story. Open-ended multi-agent autonomy, fragile live scraping, custom model training, and features
that cannot be demonstrated are prohibited unless they replace a riskier component. The production
vision may be expansive; the submitted prototype MUST remain buildable and testable by one primary
engineer.

## Prototype Constraints

- The first-round deliverable is a three-slide synopsis plus a publicly accessible functional
  prototype; submissions without a prototype are ineligible.
- The prototype targets Vercel deployment and MUST use a stable web stack with pinned dependency
  versions and typed data contracts.
- Public and synthetic data MUST be sufficient to demonstrate the HUL production vision.
- Production architecture MUST be shown separately from the competition prototype architecture.
- The selected vertical MUST connect to a coherent product portfolio across the end-to-end brand
  lifecycle, matching the case's vertical and horizontal evaluation criteria.
- The system MUST demonstrate at least one successful recommendation and one guarded rejection or
  escalation.

## Development and Demo Quality Gates

Before a feature is considered demo-ready, it MUST satisfy all of the following:

1. The primary brand-manager journey completes from signal to approved experiment contract.
2. Every score can be traced to displayed input fields and a documented formula or model output.
3. A model or network failure produces a useful fallback state within the judged flow.
4. The UI visibly separates fact, synthetic evidence, inference, and assumption.
5. Human approval and audit history are shown before any simulated activation.
6. At least one automated test covers each deterministic decision gate and the end-to-end demo
   scenario is rehearsed on the deployed URL.
7. Slide claims, prototype behavior, cost estimates, and roadmap scope remain mutually consistent.

## Governance

This constitution governs all BrandPulse NEXT specifications, plans, tasks, code, tests, and demo
artifacts. Amendments require a documented rationale and an explicit semantic version change.
MAJOR changes remove or redefine a core principle; MINOR changes add a principle or materially
expand a quality gate; PATCH changes clarify wording without changing obligations. Every planning
and completion review MUST verify constitution compliance. Any exception MUST be documented in the
implementation plan with its risk, mitigation, and removal date.

**Version**: 1.0.0 | **Ratified**: 2026-08-06 | **Last Amended**: 2026-08-06
