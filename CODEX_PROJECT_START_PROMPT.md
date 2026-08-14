# BrandPulse NEXT — Codex project-start prompt and document manifest

## How to use this

1. Open Codex Desktop.
2. Select the project folder:
   `C:\Users\Tanish Chaudhary\Documents\HULTechtonic`
3. Create a new task on the local/main workspace, not an isolated worktree for the first foundation
   pass.
4. Paste the complete prompt in Section 1.
5. Let the main Codex agent establish Git, scaffold the application, freeze shared contracts, and
   reach Day 1 Gate 1 before starting more editing agents.
6. Approve dependency installation/network access if Codex requests it and the command matches the
   documented stack.
7. Do not open Claude/Cursor on the same files until Codex reports the contract-freeze commit and
   file-ownership boundaries.

---

## 1. Master Codex start prompt — copy everything inside the block

```text
You are the principal engineer, product lead, and main-branch integrator for BrandPulse NEXT, a
TechTonic Season 8 case-competition prototype. Begin implementation now. This is a three-day sprint,
but this first task must complete only the controlled foundation and Day 1 Gate 1; do not attempt the
whole product in one uncontrolled change.

WORKSPACE
C:\Users\Tanish Chaudhary\Documents\HULTechtonic

CURRENT STATE
- Spec Kit is already initialized in .specify/ and .agents/skills. Do not reinitialize it.
- The repository contains strategy/specification documents but no application yet.
- Git may not yet be initialized; verify rather than assume.
- The application must be created under prototype/ so the research documents remain separate.
- The public judged path must work without any database or model API.

SKILLS AND WORKFLOW
1. Invoke $case-competition-consulting first so implementation stays tied to the case decision,
   official rubric, evidence discipline, and three-slide storyline.
2. Invoke $speckit-implement for implementation using the existing specification. Do not create a
   new feature or reinitialize Spec Kit.
3. Read the constitution completely before editing.
4. Maintain an explicit plan and concise progress updates.
5. Use bounded subagents only after shared contracts are frozen.

READ FIRST — IN THIS ORDER
1. .specify/memory/constitution.md
2. THREE_DAY_MULTI_AGENT_BUILD_PLAN.md
3. specs/001-causal-opportunity-router/spec.md
4. specs/001-causal-opportunity-router/plan.md
5. specs/001-causal-opportunity-router/data-model.md
6. specs/001-causal-opportunity-router/contracts/opportunity-contract.schema.json
7. specs/001-causal-opportunity-router/tasks.md
8. specs/001-causal-opportunity-router/quickstart.md

READ ONLY THE RELEVANT SECTIONS WHEN NEEDED
- BRANDPULSE_NEXT_BLUEPRINT.md: product thesis, P³, scenarios, agent boundaries, architecture, demo.
- THREE_SLIDE_SUBMISSION_MASTER_CONTENT.md: exact claims and prototype proof required by the slides.
- specs/001-causal-opportunity-router/research.md: capability-gap and technical evidence.
- LAUNCH_TRANSCRIPT_INSIGHTS.md: HUL-specific context and claims to avoid duplicating.

AUTHORISATION FOR THIS TASK
You may initialize local Git, create/edit files inside the workspace, install the documented npm
dependencies, run tests/builds, and create local commits. Do not create remote repositories, push,
deploy, publish, or expose credentials in this first task. Ask only if a required permission is
blocked. Preserve unrelated user work.

NON-NEGOTIABLE PRODUCT BOUNDARIES
- Static-first: bundled, visibly labeled public/synthetic fixtures plus versioned localStorage.
- No Supabase, authentication, uploads, live scraping, private data, or real HUL integration.
- No OpenRouter runtime integration.
- Gemini is optional and must not be implemented in this first foundation task.
- LLM output may summarize or challenge evidence later, but it never sets P³ scores, routes,
  blockers, approvals, experiment thresholds, or outcomes.
- Consequential logic must be pure TypeScript, typed, deterministic, and unit-tested.
- Every evidence item must be labeled Public Observation, Synthetic HUL-like Data, Model Inference,
  or Business Assumption.
- The exact hero journey is extra-time sweat confidence across Rexona, Dove, and Axe.
- Do not add speculative features outside the P0 scope.

PINNED THREE-DAY STACK
- prototype/ directory
- Current stable Next.js 16 App Router, React, strict TypeScript
- Node 24.x and npm with committed package-lock.json
- Tailwind; a few copied shadcn-style components only when useful
- Zod, XState 5, @xstate/react, lucide-react
- Vitest for domain rules and Playwright for the later golden path
- CSS score bars; do not install a chart library during this foundation task
- No database

POWERHELL NOTE
Use npm.cmd and npx.cmd if PowerShell blocks npm.ps1. Do not change the machine-wide execution
policy merely to run npm.

EXECUTION SEQUENCE

PHASE A — VERIFY AND BASELINE
1. Inspect the workspace and Git status without modifying files.
2. Confirm the required documents exist and report any true blocker.
3. If Git is absent, initialize it, rename the branch to main, and make a baseline commit containing
   the existing specification/research documents. Do not include secrets or files outside the
   workspace.
4. Record the baseline commit SHA.

PHASE B — SCAFFOLD ONLY
5. Scaffold a Next.js TypeScript/Tailwind/App Router application in prototype/.
6. Install only: zod, xstate, @xstate/react, lucide-react; install Vitest and Playwright as dev
   dependencies. Do not install Supabase, Recharts, OpenRouter, or model SDKs yet.
7. Add scripts for lint, typecheck, test, test:e2e, build, and start. Set Node engine to 24.x.
8. Add prototype/.env.example with DEMO_MODE=static and LIVE_AI_ENABLED=false. No real key.
9. Ensure .env.local, build artifacts, and secrets are ignored while public/data fixtures remain
   tracked.
10. Run lint, typecheck, and a production build. Fix the scaffold until green.
11. Commit as a focused scaffold commit.

PHASE C — FREEZE SHARED CONTRACTS ON MAIN
12. Port the existing Opportunity Contract JSON Schema into Zod and TypeScript under
    prototype/lib/contracts/ without weakening it.
13. Create shared enums for route, evidence type, blocker severity, freshness, provenance, and
    workflow events.
14. Create versioned P³ weight/threshold configuration and public function signatures, but do not
    implement all scoring yet.
15. Create the typed fixture-loader interface, persistence interface, and legal workflow-event
    interface.
16. Validate one minimal static Opportunity Contract object.
17. Unit-test schema parsing and forbidden/required fields.
18. Run lint, typecheck, tests, and build.
19. Commit as `chore: freeze prototype contracts` and record the SHA.

PHASE D — DELEGATE TWO INDEPENDENT SUBTASKS
Only after Phase C is green, spawn at most two subagents. They share this task’s allowance, so keep
them bounded and require concise handoffs.

SUBAGENT 1 — DETERMINISTIC EVIDENCE CORE
- Read the constitution, plan, data model, frozen contracts, and tasks T014–T023.
- Edit only prototype/lib/scoring/**, prototype/lib/routing/**, prototype/lib/state/**,
  prototype/lib/evidence/**, and prototype/tests/unit/**.
- Implement Proof, source concentration/manipulation penalties, non-compensating route selection,
  basic legal workflow transitions, and boundary tests.
- Do not edit contracts, fixtures, UI, package files, environment, or configuration.
- If a shared interface is missing, report it instead of changing it.
- Return changed files, tests and exact results, assumptions, limitations, and commit SHA.

SUBAGENT 2 — SYNTHETIC FIXTURE CORE
- Read the constitution, data model, frozen schema, Blueprint sections 8 and 11, and tasks T018,
  T019, T024, T030, and T031.
- Edit only prototype/public/data/**, prototype/lib/fixtures/**, and
  prototype/lib/agents/fallback.ts.
- Create internally consistent, visibly synthetic/public-labeled fixtures for the hero, durable
  shift, single-source noise, Rexona/Dove/Axe brand memory, inventory/service, rights, creators,
  precomputed evidence/skeptic output, and one later synthetic result.
- Do not edit formulas, routing, contracts, UI, package files, or environment.
- Validate applicable data against the frozen schema.
- Return changed files, tests and exact results, assumptions, limitations, and commit SHA.

PHASE E — INTEGRATE DAY 1 GATE 1
20. Review each subagent’s changed-file list against ownership before integration.
21. Integrate fixtures first, then deterministic core. Do not blindly merge conflicting changes.
22. On main, create only the minimum UI needed for Day 1 Gate 1:
    - common app shell and static-mode disclosure;
    - provenance badges;
    - Pulse Board with three opportunity cards;
    - hero Opportunity Contract page with hypothesis, support, contradiction, freshness, Proof
      explanation, weakest-link/route display, and one source-concentration assumption control;
    - useful missing/degraded state.
23. UI must import domain functions; never duplicate route/scoring logic in React.
24. Add a static integration test for fixture -> Proof -> route and persistence/refresh behavior.
25. Run lint, typecheck, all unit tests, and production build.
26. Manually verify that the app runs without any API key, opens the hero and noise cards, shows
    counter-evidence/provenance, recalculates the route, and survives refresh.
27. Commit the green Day 1 checkpoint.

DAY 1 GATE 1 — REQUIRED OUTPUT
- Git initialized and clean.
- prototype/ scaffolded and buildable.
- Contracts frozen and validated.
- Static fixtures validated.
- Deterministic Proof/route/state core tested.
- Pulse Board and Opportunity Contract work locally without an API key.
- No Supabase, Gemini, OpenRouter, secret, or remote deployment.
- Main branch passes lint, typecheck, tests, and build.

TIME-BOX/CUT RULE
If XState is not passing its legal-transition tests within 90 minutes of implementation, replace it
with a typed transition table/reducer and retain explicit forbidden-transition tests. Do not let a
library prevent the product behavior.

REQUIRED HANDOFF TO ME
1. Outcome summary.
2. Current plan with completed/pending items.
3. Git baseline, contract-freeze, and Day 1 commit SHAs.
4. Files created/changed grouped by scaffold, contracts, core, fixtures, UI, and tests.
5. Exact lint/typecheck/test/build results.
6. Manual Gate 1 evidence.
7. Remaining P0 risks and the smallest Day 2 assignments.
8. Any assumption that differs from the source documents.

Begin now. Lead with verification and implementation, not a long restatement of the brief.
```

---

## 2. What to attach or make accessible to the Codex task

If Codex is opened on the workspace folder above, the first two groups are already accessible. The
source files in Downloads may need to be attached manually if the task cannot read them.

### Required operating documents

1. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\THREE_DAY_MULTI_AGENT_BUILD_PLAN.md`
2. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\THREE_SLIDE_SUBMISSION_MASTER_CONTENT.md`
3. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\BRANDPULSE_NEXT_BLUEPRINT.md`
4. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\LAUNCH_TRANSCRIPT_INSIGHTS.md`

### Required Spec Kit documents

5. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\.specify\memory\constitution.md`
6. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\spec.md`
7. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\plan.md`
8. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\tasks.md`
9. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\research.md`
10. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\data-model.md`
11. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\quickstart.md`
12. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\contracts\opportunity-contract.schema.json`
13. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\contracts\api.openapi.yaml`
14. `C:\Users\Tanish Chaudhary\Documents\HULTechtonic\specs\001-causal-opportunity-router\checklists\requirements.md`

### Official case/rulebook sources

15. `C:\Users\Tanish Chaudhary\Downloads\6a6ca46cedaff_TechTonic_Case_and_Rulebook\Techtonic Season 8 Case Study.pdf`
16. `C:\Users\Tanish Chaudhary\Downloads\6a6ca46cedaff_TechTonic_Case_and_Rulebook\Techtonic Rule Book Season 8.pdf`

### Launch transcript/video sources

17. `C:\Users\Tanish Chaudhary\Downloads\6a70474a27458 techtonic season 8 virtual launch.txt`
18. `C:\Users\Tanish Chaudhary\Downloads\6a70474a27458 techtonic season 8 virtual launch - Trim.txt`
19. `C:\Users\Tanish Chaudhary\Downloads\6a70474a27458 techtonic season 8 virtual launch.pdf`
20. `C:\Users\Tanish Chaudhary\Downloads\6a70474a27458 techtonic season 8 virtual launch - Trim.pdf`
21. `C:\Users\Tanish Chaudhary\Downloads\6a70474a27458_techtonic_season_8_virtual_launch.mp4`

The full video is not required for routine implementation. Use `LAUNCH_TRANSCRIPT_INSIGHTS.md` for
working context and return to the transcript/PDF/video only to verify an important quote or claim.

---

## 3. Day 2 continuation prompt

Paste this into the same main Codex task only after Day 1 Gate 1 is green:

```text
Continue BrandPulse NEXT from the verified green Day 1 checkpoint. Read the current Git status,
THREE_DAY_MULTI_AGENT_BUILD_PLAN.md Day 2, and the existing handoff. Do not redo completed work.

Implement the competition-complete vertical slice in this order:
1. Permission and Preparedness with Rexona/Dove/Axe portfolio resolution.
2. National/four-city and unlicensed/rights-safe controls that genuinely recalculate the route.
3. Pre-registered Causal Sprint with required fields and immutable metric/window/scale/kill rules.
4. Deterministic rights/claims policies, blocked variant, corrected variant, maker-checker approval,
   current-version checks, synthetic result, and Learning Ledger.
5. Static Vercel-ready journey with no API/database dependency.

Use at most two bounded subagents and maintain exclusive path ownership. Integrate fixtures -> core
-> UI. Run lint, typecheck, unit/integration tests, and build after every integration. Add no Gemini,
Supabase, OpenRouter, live scraping, authentication, or new scope. End only when the full local
judged path works without a key and return exact tests, commit SHAs, remaining P0/P1 issues, and the
deployment-ready checklist.
```

---

## 4. Day 3 release prompt

```text
Continue from the green competition-complete Day 2 checkpoint. This is release day. Freeze features
and fix only P0/P1 reliability or comprehension issues.

Priorities:
1. One Playwright golden path through Learning Ledger and one guarded failure if time permits.
2. No-key, malformed-model, refresh, direct-link, private-window, second-network, blocked-action,
   and API-key-leak checks.
3. Accessible focus order, labels, contrast, visible provenance, and clear guided-demo progress.
4. Deploy a static release candidate to Vercel only after local gates pass and after requesting any
   required external-account approval.
5. Add optional Gemini synthesis only if the static public path is already green; use one narrow
   structured call, a six-second timeout, no retry, and immediate checked-in fallback. It may not
   change consequential decisions. Keep production static if hybrid mode is not clearly safer and
   better.
6. Produce the final direct hero URL, QR target, 90-second backup-demo checklist, and claim-to-
   prototype audit for THREE_SLIDE_SUBMISSION_MASTER_CONTENT.md.

Run lint, typecheck, tests, build, and Playwright. Return the release URL, exact results, manual
checks, changed files/commits, known limitations, and final submission checklist. Do not introduce
new features or broad refactors.
```

---

## 5. Separate Claude Code prompt after Codex freezes contracts

Use this only in the isolated UI worktree documented in `THREE_DAY_MULTI_AGENT_BUILD_PLAN.md`:

```text
You are the judge-facing UI implementer for BrandPulse NEXT. The main Codex agent has frozen shared
contracts. First verify the base commit and read .specify/memory/constitution.md,
THREE_DAY_MULTI_AGENT_BUILD_PLAN.md, the relevant spec user stories, exported TypeScript contracts,
and BRANDPULSE_NEXT_BLUEPRINT.md sections 6–8 and 15.

Edit only the explicitly assigned prototype/app/** routes and prototype/components/**. Do not edit
package files, contracts, fixtures, scoring, routes, policies, state, environment, or deployment.

Build the guided journey against frozen types:
Pulse Board -> Opportunity Contract -> Portfolio Resolver -> Causal Sprint -> Review/Learning.

The UI must show provenance/synthetic disclosure, support and contradiction, weakest P³ gate,
Rexona/Dove/Axe comparison, a route-changing scope control, locked test rules, blocked/corrected
asset states, maker-checker history, Learning Ledger, and a useful degraded state. Import domain
functions; never duplicate business logic in React.

Keep the diff focused, run the relevant checks, commit, and return the standard HANDOFF from the
three-day plan. If a shared interface is missing, report it rather than changing it.
```
