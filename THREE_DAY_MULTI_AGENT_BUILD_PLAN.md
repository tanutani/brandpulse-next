# BrandPulse NEXT: exact three-day multi-agent build plan

**Sprint dates:** 15–17 August 2026  
**Submission deadline in the supplied rulebook:** 20 August 2026  
**Builder:** one primary builder, supported by two registered teammates, seniors, Codex, Claude Code, Cursor, and VS Code  
**Target:** a public, dependable Vercel prototype plus a three-slide first-round submission

---

## 1. The decision that makes three days possible

Do **not** try to complete the existing 73 tasks as 73 independent deliverables. Ship one memorable,
complete decision loop:

1. Three opportunity cards.
2. One full “extra-time sweat confidence” journey.
3. Proof, Permission, and Preparedness calculations.
4. Rexona–Dove–Axe portfolio comparison.
5. One user control that changes Preparedness and the route.
6. One pre-registered Causal Sprint.
7. One blocked rights/claim variant.
8. Maker-checker approval.
9. One synthetic outcome and Learning Ledger entry.
10. A public Vercel URL, static fallback, and one passing end-to-end golden path.

The judged product is the **deterministic decision loop**. Live generative AI, a database, and
multiple model providers are optional enhancements.

### The promise at the end of Day 3

A judge can open the public link and, in less than four minutes:

- see why a signal may be real or misleading;
- compare three HUL brands;
- watch a national route fail because of stock/rights readiness;
- narrow the scope to four in-stock cities and move to **Test**;
- lock the test metric and scale/kill rule before seeing a result;
- see an unlicensed asset blocked;
- approve a corrected asset through maker-checker;
- reveal a clearly synthetic result and retain it in the Learning Ledger;
- complete the same path if Gemini, OpenRouter, Supabase, or the networked AI layer is unavailable.

---

## 2. Scope freeze

### P0 — must exist for submission

- Next.js application under `prototype/`.
- Guided demo landing page and visible public/synthetic-data disclosure.
- Three Opportunity Cards: live moment, durable shift, single-source noise.
- Full path only for the live moment.
- Opportunity Contract with supporting and contradictory evidence.
- Deterministic Proof, Permission, Preparedness, blocker, and route rules.
- Rexona, Dove, and Axe comparison.
- National/four-city and rights-safe scope controls.
- Causal Sprint contract with locked primary metric, window, scale rule, kill rule, and guardrail.
- Blocked rights variant and corrected variant.
- Human maker-checker action and append-only decision history.
- Synthetic outcome and Learning Ledger.
- Checked-in static synthesis fallback.
- Vercel deployment, QR/deep link, backup screen recording.
- Unit tests for consequential rules and one Playwright golden path.

### P1 — add only after the static public path is green

- One optional Gemini structured-synthesis request.
- A second end-to-end guarded-failure test.
- Basic responsive and keyboard polish.
- Compact evidence chart or sparkline.
- Three to five proxy usability sessions.

### P2 — cut now

- Supabase, authentication, accounts, collaboration, uploads, or private datasets.
- Live scraping and live social/search/commerce APIs.
- OpenRouter runtime integration.
- Multiple LLM calls masquerading as five independent runtime agents.
- Full detail pages for the secondary scenarios.
- Real publishing, media buying, creator booking, or HUL connectors.
- Vector search/RAG.
- Complex experiment optimization.
- Mobile-perfect layouts, elaborate motion, or a dashboard full of charts.

### Never cut

- Visible provenance and synthetic labels.
- Counter-evidence.
- Non-compensating P³ gates.
- Cross-brand comparison.
- A user action that changes the route.
- A hard blocker.
- Pre-registration before results.
- Human approval.
- Static fallback.
- Public working URL.

---

## 3. Final three-day stack

| Layer | Choice | Why it survives a three-day build |
|---|---|---|
| Project location | `prototype/` inside this repository | Keeps the app separate from strategy/spec documents; set it as Vercel Root Directory. |
| Runtime | Node.js `24.x`, npm, committed `package-lock.json` | Matches the machine and Vercel’s current supported/default direction. |
| Framework | Current stable Next.js 16 App Router, React, strict TypeScript | One frontend/server repository and native Vercel deployment. |
| Styling | Tailwind plus a few copied shadcn-style components | Fast visual polish without building a design system. |
| Icons | `lucide-react` | Consistent icons with little setup. |
| Contracts | Zod + exported TypeScript types | One shared shape for fixtures, UI, persistence, and optional AI output. |
| Decision core | Pure TypeScript functions | LLMs cannot alter P³, routes, blockers, approvals, or test thresholds. |
| Workflow | XState 5, time-boxed to the first evening | Useful for governance and forbidden-state tests. Replace with a typed transition table/reducer if it blocks progress. |
| Charts | CSS score bars; at most one Recharts time series | Avoids charting and hydration rabbit holes. |
| Storage | Checked-in fixtures + versioned browser `localStorage` | No database, credentials, migrations, RLS, or network dependency. |
| Optional AI | Vercel AI SDK + `@ai-sdk/google` + `gemini-3.6-flash` | One small server-side structured synthesis; never on the critical path. |
| Tests | Vitest + Playwright | Unit-test consequential rules; automate one golden journey. |
| Hosting | Vercel | Fast previews and a public URL. |
| Database | None | Supabase adds failure modes without judged value. |

### Corrections to the ten-day technical plan

- Use Node `24.x` rather than the older Node 22 note after confirming the installed and Vercel
  environment.
- Keep the five conceptual AI roles in the product story, but implement at most **one** optional
  model request in the prototype.
- Give Gemini a narrow, flat synthesis schema; do not pass the full Opportunity Contract schema.
- Use one model attempt with a six-second total timeout, followed by immediate checked-in fallback.
- Default the public production URL to static mode. Live AI is a rehearsed enhancement, not a
  requirement.

### Optional AI contract

The endpoint accepts only a known fixture ID:

```text
POST /api/synthesize
{ "opportunityId": "hero" }
```

It returns only:

```text
{
  summary: string,
  supportingClaims: string[1..3],
  counterEvidence: string[1..3],
  missingEvidence: string[0..3],
  caveat: string
}
```

Do not accept arbitrary prompts, uploads, or user-provided confidential evidence. Model output never
sets scores, routes, blockers, approvals, experiment results, or thresholds.

---

## 4. What every existing document is for

Do not paste every long document into every agent. Each agent reads the constitution and only the
sections it needs.

| Document | Reader | Use |
|---|---|---|
| `.specify/memory/constitution.md` | Every coding/review agent | Non-negotiable safety, evidence, human-control, and reliability rules. |
| `specs/001-causal-opportunity-router/spec.md` | Core, UI, QA | User stories, acceptance criteria, edge cases, success criteria. |
| `specs/001-causal-opportunity-router/plan.md` | Core and integrator | Architecture, deterministic/probabilistic boundary, state model. |
| `specs/001-causal-opportunity-router/tasks.md` | Integrator and assigned owner | Existing task IDs and file paths; use it as traceability, not as a 73-item calendar. |
| `specs/001-causal-opportunity-router/data-model.md` | Core and fixture agent | Shared entities and relationships. |
| `specs/001-causal-opportunity-router/contracts/opportunity-contract.schema.json` | Contract owner, core, fixture agent | Authoritative Opportunity Contract shape. |
| `specs/001-causal-opportunity-router/contracts/api.openapi.yaml` | Optional AI owner | API boundary only. |
| `specs/001-causal-opportunity-router/research.md` | Claim reviewer and deck owner | Capability-gap and technical research. |
| `specs/001-causal-opportunity-router/quickstart.md` | Integrator and QA | Build sequence and demo-ready definition. |
| `BRANDPULSE_NEXT_BLUEPRINT.md` | Product, UI, deck, demo owner | Product thesis, P³ weights, scenarios, screens, business case, Q&A. |
| `LAUNCH_TRANSCRIPT_INSIGHTS.md` | Deck and claim owner | HUL language, existing capabilities, maker-checker/AI-assurance insights. |
| Supplied case and rulebook PDFs | Integrator and deck owner | Rubric, first-round deliverables, deadline, team eligibility. |
| `THREE_SLIDE_SUBMISSION_MASTER_CONTENT.md` | Slide owner and presenter | Exact slide copy, layouts, calculation data, notes, sources, and defenses. |

### Existing task IDs retained in the compressed MVP

Use these IDs in agent briefs and handoffs. Combine them into vertical slices; do not manage them as
73 separate conversations.

- **Foundation:** T001–T017.
- **Evidence route:** T018–T029.
- **Portfolio/readiness:** T030–T039.
- **Causal Sprint:** T040, T042–T047. Use preselected cells plus deterministic validation; T041’s
  advanced matching can be simplified.
- **Governed activation:** T048–T055.
- **Learning:** T056–T061.
- **Hardening:** T065–T073.
- **Optional live synthesis:** T062–T064 only after Day 2’s static public deployment passes.

---

## 5. Use each account for a different job

These interfaces are not extra unlimited accounts. Codex surfaces share the ChatGPT agentic
allowance; Claude chat and Claude Code share Claude Pro usage. Parallel work saves time but consumes
those pools faster.

| Tool | Role | Owns | Must not do |
|---|---|---|---|
| **Codex Desktop — current task** | Product lead and integrator | Scope, contracts, task briefs, diff review, merge order, tests, deployment, slide/prototype alignment | Large feature edits while coding agents own those paths |
| **Codex agent 1** | Deterministic-core engineer | P³, route rules, state, portfolio, sprint validation, policy, approval, learning, unit tests | UI, fixtures, package files, deployment |
| **Codex agent 2** | Spec guardian, then adversarial QA | Read-only architecture review; later integration/E2E tests and P0/P1 issue list | Broad rewrites or same-file edits during implementation |
| **Claude subagent: fixture-smith** | Synthetic data engineer | Signals, brand memory, inventory, rights, creators, precomputed synthesis, outcome | Formulas, route rules, React pages, dependencies |
| **Claude subagent: UI-builder** | Judge-facing interaction engineer | Guided screens and component wiring | Changing schemas or domain logic to make the UI easier |
| **Claude subagent: UI-critic** | Read-only product/UX reviewer | Comprehension, failure visibility, accessibility, demo length | General cleanup/refactor |
| **Cursor Pro** | Precision UI workshop | Small local edits, CSS, icons, diagnostics, autocomplete | Background/cloud agents or repository-wide rewrites |
| **VS Code** | Human control room | Git, terminals, tests, debugging, environment variables, final build | Blindly accepting overlapping AI edits |
| **Gemini API** | Optional runtime summarizer | Typed evidence summary and counter-hypothesis | Consequential decisions or critical demo dependency |
| **OpenRouter** | Emergency reserve | Only if a later model fallback is explicitly required and tested | Automatic second-provider runtime, coding workload, unbounded routing |
| **Senior engineer** | Two scheduled escalation/review slots | Architecture sanity, deployment blocker, hardest defect | Expanding the scope |

### Quota rules for the $20 plans

1. Run no more than **two Codex implementation agents** at once.
2. Run one Claude implementation subagent at a time; use a second Claude subagent mainly for
   read-only review. Anthropic says parallel instances consume the same plan allowance faster.
3. Keep Cursor in foreground editing/Tab/Auto mode. Decline on-demand or background-agent spending.
4. Reserve roughly one-third of Codex allowance and one Claude reset window for Day 3 debugging.
5. Use one complete prompt with file boundaries and acceptance tests, not twenty tiny follow-ups.
6. Start a fresh bounded task after a logical milestone rather than carrying every transcript and
   code log in one bloated context.
7. Use quota-reset periods for manual merging, testing, citations, usability checks, and rehearsal.
8. Never rotate identities or accounts to evade service limits.
9. ChatGPT Plus, Claude Pro, and Cursor Pro are development subscriptions; they do not fund public
   API runtime.
10. Keep the expected additional spend at **₹0**. If an emergency OpenRouter test is necessary, set
    a hard maximum of **$2** and preserve the rest of the $10 balance.

### Claude feature choice

Use Claude **subagents**, not experimental Agent Teams, for this sprint. Agent Teams use
significantly more tokens and do not automatically isolate teammates in worktrees. In Claude Code:

- `/agents` shows or creates project subagents;
- a prompt such as `Use the fixture-smith subagent in the foreground...` explicitly delegates;
- `claude agents` is a separate background-agent view;
- do not enable experimental Agent Teams for this three-day, quota-constrained build.

Before starting Claude Code, log in to the Pro account and ensure an `ANTHROPIC_API_KEY` is not set
in that terminal if the intention is to use the subscription rather than separately billed API
usage. Use `/usage`, `/clear`, and `/compact` deliberately.

---

## 6. Human control-room setup

### Before Hour 0: account and machine preflight

Complete this once; do not spend the first build wave repairing logins.

1. Open Codex Desktop and confirm it is signed into the ChatGPT Plus account. Open this repository as
   the project. Check the usage panel before each build wave.
2. In a VS Code terminal, run `claude --version`, start `claude`, and use `/login` if required. Confirm
   the Pro account is selected and check `/usage`.
3. In that terminal, inspect whether `ANTHROPIC_API_KEY` is set. If the intention is to use Claude
   Pro rather than separately billed API usage, remove it from that shell before launching Claude
   Code. Do not delete an intentional key from permanent machine configuration without checking why
   it exists.
4. Open Cursor, confirm Pro, enable Privacy Mode, and disable/decline on-demand/background-agent
   spending for this sprint.
5. Sign into GitHub and Vercel in the browser. Create a new private GitHub repository named
   `brandpulse-next` without a generated README, `.gitignore`, or license; the local repository will
   be pushed later.
6. Verify `git --version`, `node --version`, `npm.cmd --version`, and `claude --version` in the
   terminal. Resolve installation/login failures before concurrent work.
7. Create a separate Gemini API key for this prototype, restrict it to the Gemini API where the
   console supports that restriction, and store it only in a password manager/`prototype/.env.local`.
   Do not paste it into an agent prompt.
8. Schedule two senior-engineer slots now: one 30-minute review near the end of Day 2 and one
   30-minute escalation/architecture slot on Day 3.

### Use the three registered members without creating merge chaos

The rulebook requires a three-member team even if one person writes all prototype code.

| Person | Primary responsibility | Exact output |
|---|---|---|
| Primary builder | Product owner, main-branch integrator, deployment, final demo | Green public prototype and final acceptance checklist |
| Member 2 | FMCG/primary research and usability | 3–5 interviews/proxy sessions, anonymized findings, source/claim verification |
| Member 3 | Slide production and presentation QA | Three-slide working file/PDF, QR verification, narration timing, rulebook check |

If the other registered members cannot contribute, the builder still needs their correct registration
details and must personally complete those non-code outputs. If three eligible members are not
registered, treat that as an immediate submission blocker rather than a Day 3 discovery.

### Window layout

Keep these visible:

1. **Codex Desktop:** orchestration, contracts, review, integration decisions.
2. **VS Code main workspace:** `main`, Git status, tests, local server, final truth.
3. **Claude Code terminal:** one isolated worktree at a time.
4. **Cursor:** UI worktree or a single assigned file; close it when an agent owns that file.
5. **Browser:** local app, Vercel preview, and deployment logs.

Do not open the same worktree in two autonomous coding tools. Do not let VS Code and Cursor autosave
the same file while an agent is editing it.

### Agent board

Maintain one table in a note or issue:

| Task | Owner | Branch | Owned paths | Status | Commit | Test result | Blocker |
|---|---|---|---|---|---|---|---|

Allowed statuses: `queued`, `active`, `review`, `merged`, `cut`.

### Definition of a complete agent handoff

```text
HANDOFF

Agent:
Tool:
Branch/worktree:
Base commit:
Assigned task IDs:
Files changed:
Behavior implemented:
Tests run and exact result:
Manual checks:
Assumptions made:
Known limitations:
Out-of-scope change needed:
Commit SHA:
Recommended integration order:
```

No clean commit, changed-file list, and test result means the task is not ready to integrate.

---

## 7. Git and worktree setup — exact sequence

There is no Git repository or application yet. Do not start concurrent coding before the baseline
and contracts are committed.

### 7.1 Initialize the repository

In a VS Code PowerShell terminal:

```powershell
Set-Location "C:\Users\Tanish Chaudhary\Documents\HULTechtonic"
git init
git branch -M main
git add .
git commit -m "docs: baseline BrandPulse specifications"
```

If Git asks for identity, configure your real name/email for this repository; do not invent one.

### 7.2 Scaffold the app safely inside `prototype/`

PowerShell on this machine may block `npm.ps1`, so use `npm.cmd` and `npx.cmd` or a Command Prompt
terminal.

```powershell
Set-Location "C:\Users\Tanish Chaudhary\Documents\HULTechtonic"
npx.cmd create-next-app@latest prototype --ts --tailwind --eslint --app --use-npm --yes
Set-Location prototype
npm.cmd install zod ai @ai-sdk/google xstate @xstate/react lucide-react
npm.cmd install -D vitest @playwright/test
npx.cmd playwright install chromium
```

Add these scripts/configuration through the main integrator:

```json
{
  "engines": { "node": "24.x" },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "build": "next build",
    "start": "next start"
  }
}
```

Create this checked-in example only; keep actual secrets in `.env.local`:

```text
# prototype/.env.example
DEMO_MODE=static
LIVE_AI_ENABLED=false
GOOGLE_GENERATIVE_AI_API_KEY=
BRANDPULSE_MODEL=gemini-3.6-flash
```

Rules:

- `.env.local` is ignored by Git.
- Never prefix an API key with `NEXT_PUBLIC_`.
- Do not add `OPENROUTER_API_KEY` unless that provider is genuinely implemented and tested later.
- Use only public/synthetic evidence with Gemini free tier.
- Rotate or revoke the presentation key after judging.

Run the blank gate:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

Commit:

```powershell
Set-Location "C:\Users\Tanish Chaudhary\Documents\HULTechtonic"
git add prototype
git commit -m "chore: scaffold pinned BrandPulse prototype"
```

### 7.3 Freeze shared contracts before parallel work

The main Codex integrator owns:

- `prototype/lib/contracts/**`;
- shared enums;
- P³ configuration signatures;
- the fixture interface;
- route function signatures;
- workflow events;
- provenance labels;
- `package.json`, lockfile, environment example, global CSS, and root layout.

Port the existing JSON Schema into Zod/TypeScript, build one validating static object, and commit:

```powershell
git add prototype
git commit -m "chore: freeze prototype contracts"
git rev-parse HEAD
```

Record that commit SHA. It is the base for every coding agent.

### 7.4 Create isolated worktrees

From the main repository:

```powershell
git worktree add ..\HULTechtonic-wt-core -b agent/core
git worktree add ..\HULTechtonic-wt-data -b agent/data
git worktree add ..\HULTechtonic-wt-ui -b agent/ui
```

Use Codex Desktop’s built-in worktree mode for Codex tasks when convenient; use the manual worktrees
above for Claude/Cursor. Never let two autonomous agents share a worktree.

### Permanent file ownership

| Branch | Exclusive paths |
|---|---|
| `agent/core` | `prototype/lib/scoring/**`, `routing/**`, `state/**`, `portfolio/**`, `experiment/**`, `policies/**`, `governance/**`, `learning/**`, `tests/unit/**` |
| `agent/data` | `prototype/public/data/**`, `prototype/lib/fixtures/**`, `prototype/lib/agents/fallback.ts` |
| `agent/ui` | `prototype/app/**` except `app/api/**`, and `prototype/components/**` |
| later `agent/qa` | `prototype/tests/integration/**`, `prototype/tests/e2e/**`, `prototype/docs/DEMO_QA.md` |
| `main` | Contracts, dependency/config files, environment, global styles, optional API, deployment, merges |

If an agent needs an out-of-scope change, it reports the exact desired interface in the handoff. It
does not “helpfully” change the shared file.

---

## 8. Exact 72-hour schedule

### Day 1 — foundation and first coherent route

**Exit condition:** no-key static app opens the hero opportunity, shows evidence/counter-evidence,
calculates Proof, and survives refresh.

| Time | Human/integrator | Codex | Claude | Cursor/VS Code | Exit evidence |
|---|---|---|---|---|---|
| 08:00–09:00 | Freeze P0/P1/P2, hero scenario, three headlines, owner board | Read-only constitution/spec audit | None | Create checklist | No unresolved scope choice |
| 09:00–11:00 | Initialize Git and supervise scaffold | Main task implements T001–T007 only | None | Run blank gates | Green production build |
| 11:00–12:00 | Freeze contracts, enums, P³ config, events, labels | Review schema consistency | None | Commit and record SHA | Valid static contract |
| 12:00–12:30 | Create worktrees; paste bounded prompts | Core agent begins | Fixture-smith begins | Cursor opens UI worktree | No path overlap |
| 12:30–17:00 | Keep agent board; answer only blockers | Proof/routing/state/tests | All fixtures and precomputed outputs | Shell, badges, cards, evidence layout | Atomic commits + handoffs |
| 17:00–18:30 | Stop agents; inspect paths; integrate data → core → UI | Fix only reported core defects | Stop | Run gates after every cherry-pick | Green main |
| 18:30–21:30 | Wire gaps and deploy skeletal preview | Review static evidence path | UI-builder wires Pulse Board/Contract | Local visual fixes under 100 lines | Public preview opens |
| 21:30–23:00 | Gate 1 manual test and commit | Read-only acceptance audit | UI-critic checks comprehension | Refresh/no-key/direct-link checks | Day 1 green checkpoint |

**Day 1 cut trigger:** if XState is not passing by 20:00, replace it with a typed transition table or
`useReducer`; retain explicit legal/illegal transition tests.

### Day 2 — competition-complete vertical slice

**Exit condition:** the entire judged journey works from the public URL with live AI disabled.

| Time | Human/integrator | Codex | Claude | Cursor/VS Code | Exit evidence |
|---|---|---|---|---|---|
| 06:30–08:00 | Repair Gate 1 only | Bounded diagnosis | None | Tests/build | Main green before features |
| 08:00–13:00 | Coordinate interfaces | Permission, Preparedness, owner resolver, sprint validation/tests | UI-builder builds Resolver/Sprint; fixture-smith adds inventory/rights/cells/outcome | No overlapping edits | Route changes on scope |
| 13:00–14:30 | Integrate data → core → UI | Review diffs | Stop | Unit/type/build + manual path | Green merged slice |
| 14:30–18:30 | Freeze activation contract | Policy blockers, approval, outcome/ledger | Review/Learning UI and blocked/corrected packages | Small visual repairs | Blocker cannot be bypassed |
| 18:30–20:00 | Integrate and run whole path | Fix only failed gates | Stop | Build and manual demo | Full local journey |
| 20:00–21:30 | Deploy static alpha to Vercel | Deployment smoke reviewer | None | Incognito + phone hotspot | Public path works |
| 21:30–23:00 | Freeze features | QA agent reports P0/P1/P2 | UI-critic reports P0/P1/P2 | Log issues; no broad fix | Prioritized Day 3 list |

At 23:00 on Day 2, functional scope is frozen. Anything not required for the four-minute journey is
cut.

### Day 3 — reliability, polish, slides, and handoff

**Exit condition:** release URL, three-slide PDF, QR, backup recording, rulebook/team checks, and a
rehearsed four-minute path.

| Time | Work | Gate |
|---|---|---|
| 06:30–10:00 | Fix P0/P1 issues only; create one Playwright golden path and core rule tests | Lint, typecheck, unit, build green |
| 10:00–12:00 | Add optional Gemini endpoint only if static alpha is fully green; otherwise continue QA | Six-second failure returns checked-in output |
| 12:00–14:00 | Cursor polish: hierarchy, provenance, focus states, score readability, guided progress | No domain/interface changes |
| 14:00–15:00 | Senior engineering review of hardest remaining architecture/deployment defect | Written smallest safe correction |
| 15:00–16:30 | Three to five proxy-user runs | User explains why route is Test unaided |
| 16:30–18:00 | Fix only comprehension/reliability defects | No new features |
| 18:00–19:00 | Deploy release candidate | Incognito, second network, no key, refresh, blocker, deep link pass |
| 19:00–21:00 | Put final URL/QR and actual screenshot into the three slides; run claim/source audit | Slide statements match product/source |
| 21:00–22:00 | Rehearse four-minute walkthrough three times | Remove clicks rather than speak faster |
| 22:00–23:00 | Record 90-second backup, export PDF, verify three-member registration and upload rules, freeze | Final artifacts backed up |

Use 18–20 August only as a submission/mentor-feedback buffer, not as permission to reopen scope.

---

## 9. Ready-to-paste agent prompts

### 9.1 Codex main/orchestrator prompt

```text
You are the BrandPulse NEXT product lead and integration owner for a three-day case prototype.

Read .specify/memory/constitution.md completely, then THREE_DAY_MULTI_AGENT_BUILD_PLAN.md and only
the relevant existing specs. Maintain P0 scope, the agent board, file ownership, and main-branch
quality. Delegate only bounded independent tasks. Never let two agents edit the same path.

Own: contracts, package/lock files, environment, global layout/styles, app/api, integration,
deployment, and acceptance evidence. Do not implement feature code while another agent owns it.

After each agent handoff:
1. verify changed files against ownership;
2. inspect consequential logic;
3. integrate fixtures, then core, then UI, then QA tests;
4. run lint, typecheck, unit tests, and build;
5. stop new work if main is red.

The public judged path must work in static mode. Live Gemini is optional. Supabase and OpenRouter are
out of scope. Return decisions, blockers, exact tests, and the next bounded assignment.
```

### 9.2 Codex deterministic-core agent

```text
You are the deterministic-core engineer for BrandPulse NEXT.

Read completely:
1. .specify/memory/constitution.md
2. specs/001-causal-opportunity-router/plan.md
3. specs/001-causal-opportunity-router/data-model.md
4. specs/001-causal-opportunity-router/contracts/opportunity-contract.schema.json
5. the assigned sections of tasks.md

Assigned task IDs: [INSERT].
Allowed paths: [INSERT OWNED PATHS].

Implement pure, typed, deterministic functions and unit tests. An LLM must never determine P³
scores, route, policy outcome, approval, or experiment threshold. Preserve shared contracts. Do not
add dependencies or edit UI, fixtures, package files, environment, or documentation.

Before finishing:
- run the relevant unit tests;
- run typecheck;
- inspect the changed-file list for ownership violations;
- commit with a focused message;
- return the standard HANDOFF block.

If a contract is insufficient, stop and report the exact missing type/signature. Do not silently
change it.
```

### 9.3 Claude fixture-smith subagent

```text
Use a bounded fixture-smith subagent in the foreground.

Read the constitution, data-model.md, JSON schema, BRANDPULSE_NEXT_BLUEPRINT.md sections 8 and 11,
and assigned task IDs. Edit only prototype/public/data/**, prototype/lib/fixtures/**, and
prototype/lib/agents/fallback.ts.

Create internally consistent, visibly synthetic fixtures for:
- hero opportunity;
- durable scalp shift;
- single-source noise;
- Rexona, Dove, and Axe brand memory;
- inventory, service, channels, creators, and rights;
- treatment/comparison cells and a synthetic result;
- Evidence Analyst, Skeptic, Experiment Architect, and activation-package fallback outputs.

Every applicable record must label public observation, synthetic HUL-like data, model inference, or
business assumption. Never present invented values as HUL facts. Validate fixtures against frozen
contracts. Do not change formulas, routes, contracts, dependencies, or UI.

Run validation/tests, commit, and return the standard HANDOFF.
```

### 9.4 Claude UI-builder subagent

```text
Use a bounded UI-builder subagent. Work only in the assigned UI worktree.

Read the constitution, relevant spec user stories, BRANDPULSE_NEXT_BLUEPRINT.md sections 6–8 and 15,
and exported TypeScript interfaces. Edit only assigned prototype/app/** routes and
prototype/components/**.

Build a guided desktop journey:
Pulse Board -> Opportunity Contract -> Portfolio Resolver -> Causal Sprint -> Review/Learning.

Requirements:
- visible provenance and synthetic disclosure;
- supporting and contradictory evidence;
- P³ component explanation and weakest-link emphasis;
- Rexona/Dove/Axe comparison;
- scope control that changes Preparedness and route;
- locked causal test;
- blocked and corrected activation variants;
- maker-checker action and learning timeline;
- useful empty/degraded state.

Import domain functions; never duplicate business logic inside React. Do not edit package files,
contracts, fixtures, or domain logic. Keep motion restrained. Run relevant checks, commit, and return
the standard HANDOFF.
```

### 9.5 Codex/Claude adversarial reviewer

```text
Act as a hostile competition judge and reliability engineer. Begin read-only.

Read the constitution, success criteria in spec.md, quickstart demo-ready definition, and current
deployment instructions. Test:
1. no API key;
2. timed-out or malformed AI response;
3. refresh midway;
4. source concentration/manipulation change;
5. national to four-city scope change;
6. activation without approval;
7. unlicensed content;
8. result revealed and attempted rule change;
9. deployed URL in a private window;
10. entire path in under four minutes.

Return only:
[P0/P1/P2] title
Reproduction
Expected
Actual
Likely files
Smallest safe correction

Do not perform general refactoring. Write integration/E2E tests only if explicitly assigned.
```

### 9.6 Cursor micro-edit prompt

```text
Modify only [FILE/COMPONENT]. Improve [specific hierarchy/readability/responsive issue].
Do not change props, exported types, route decisions, numerical values, or domain logic.
Keep the diff under approximately 100 lines. Show the diff before applying.
```

### 9.7 Cross-review assignments

- Claude reviews Codex’s consequential core behavior against the spec but does not rewrite it.
- Codex reviews Claude’s UI for business-logic duplication, missing failure states, and claim drift.
- Cursor makes only human-selected micro-edits after those reviews.
- The human integrator makes every merge and deployment decision.

---

## 10. Merge protocol

For each agent commit:

1. Confirm `main` is green.
2. Read the handoff.
3. Compare the changed-file list with ownership.
4. Reject unrelated formatting, dependency, schema, or config changes.
5. Inspect consequential logic and test assertions.
6. Integrate in this order: contracts → fixtures → deterministic core → UI → QA tests.
7. Cherry-pick one coherent commit at a time.
8. Run gates after every cherry-pick.

Example:

```powershell
Set-Location "C:\Users\Tanish Chaudhary\Documents\HULTechtonic"
git status --short
git cherry-pick <COMMIT_SHA>
Set-Location prototype
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Before a release candidate:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Keep worktrees until after submission; they are useful recovery points. Agents never merge, deploy,
delete branches, reset Git, or change Git configuration.

---

## 11. Minimum test matrix

### Vitest

- Proof boundaries and source-concentration penalty.
- `min(Proof, Permission, Preparedness)` weakest-link behavior.
- Permission/Preparedness thresholds.
- Hard rights/claims blockers overriding scores.
- National-to-four-city inventory scope changing Preparedness and route.
- Required Causal Sprint fields.
- Metric/window/scale/kill rule immutability after pre-registration/result reveal.
- Activation blocked without current-version maker-checker approval.
- Expired opportunity behavior.
- Invalid model output selecting the checked-in fallback.
- Outcome evaluator applying Scale/Iterate/Kill to the locked rule.

### Playwright

1. **Golden path:** opportunity → three-brand comparison → geography/rights-safe change → Test →
   Sprint → blocked asset → corrected asset → approval → result → Learning Ledger.
2. **Guarded path if time permits:** single-source spike or unlicensed asset → Watch/Ignore/Blocked.

### Manual deployment checks

- No Gemini key.
- Wrong Gemini key.
- `localStorage` cleared.
- Refresh midway.
- Direct link to the hero journey.
- Private/incognito window.
- Phone width.
- Second network or phone hotspot.
- Browser/client bundle and repository contain no API key.
- QR lands on the guided hero, not a generic homepage.

---

## 12. Vercel deployment procedure

1. Push a green commit containing `prototype/package-lock.json` to the empty private GitHub
   repository created during preflight:

```powershell
Set-Location "C:\Users\Tanish Chaudhary\Documents\HULTechtonic"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/brandpulse-next.git
git push -u origin main
```

   Replace the placeholder with the real repository URL. If `origin` already exists, inspect it with
   `git remote -v`; do not add a second origin.
2. Import that GitHub repository into Vercel.
3. Set **Root Directory** to `prototype`.
4. Confirm Node.js `24.x`.
5. Deploy first with:

```text
DEMO_MODE=static
LIVE_AI_ENABLED=false
BRANDPULSE_MODEL=gemini-3.6-flash
```

6. Complete the entire path in a private window.
7. Test on another network.
8. Only then add `GOOGLE_GENERATIVE_AI_API_KEY` to a preview environment. This is the default
   variable read by `@ai-sdk/google`.
9. Force a missing/bad key and verify the fallback.
10. Promote hybrid mode only if it is materially better and equally reliable. Otherwise keep
    production static.
11. Keep a local build and 90-second recording.

Vercel Hobby is technically sufficient for expected demo traffic, but it is intended for
personal/non-commercial use and subject to fair-use rules. Because this is a competition, verify
that the intended use fits those terms; otherwise choose an appropriate hosting plan or permitted
alternative. Do not wait until the final hour to discover an account/terms issue.

---

## 13. Gemini, OpenRouter, and Supabase decisions

### Gemini

- Direct Gemini is the only optional runtime provider.
- Use `gemini-3.6-flash` after rechecking the model name/pricing on implementation day.
- Use server-side structured output, one call per known opportunity, low temperature, small output
  ceiling, six-second total timeout, and immediate fallback.
- The public production URL should default to static mode so strangers cannot consume the free
  quota.
- Free-tier content may be used to improve Google products; send only public/synthetic material.

### OpenRouter

- Preserve the $10 balance as an emergency reserve.
- Do not build an automatic second-provider path.
- If later required, use the same `SynthesisProvider` interface, one allowlisted inexpensive model,
  a spending cap, provider data controls, and Zero Data Retention where available.
- Do not expose a public unmetered endpoint.

### Supabase

Do not use it in Stage 1. The prototype needs no shared accounts, cross-device collaboration, live
uploads, private data, or server-side audit persistence. Free projects can also pause after
inactivity. Add Supabase later only if a mentor explicitly requires multi-user persistence, with
row-level security and a security review.

---

## 14. Stop rules and escalation

### If behind after Day 1

Cut in this order:

1. Live Gemini.
2. Recharts; use CSS/static SVG.
3. Detailed secondary scenario pages; keep cards.
4. XState if it is the blocker; use a tested typed transition table.
5. Separate Sprint and Review pages; combine them.
6. Second Playwright journey.

### If a blocker lasts 45 minutes

1. Stop changing files.
2. Save expected behavior, actual behavior, failing command, relevant files, and last green commit.
3. Ask one coding agent for a bounded diagnosis.
4. If unresolved after 30 more minutes, use the senior-engineer review slot.
5. If the blocker is optional AI, Supabase, animation, charting, or a secondary scenario, cut it.

### Anti-chaos rules

1. One human integrator; agents never merge.
2. One owner per path per wave.
3. No package/schema changes after freeze without integrator approval.
4. No two agents repair the same defect.
5. No unrelated cleanup.
6. No secrets in prompts, Git, screenshots, or browser code.
7. Commit every coherent increment.
8. Stop feature work when `main` is red.
9. Static mode is the product; live AI is an enhancement.
10. Precomputed/synthetic output is labeled honestly.
11. No autonomous deployment or publication.
12. No consequential decision based only on LLM prose.
13. Freeze features at the end of Day 2.
14. After release candidate, fix only P0/P1 defects.
15. Every slide claim is product behavior, sourced fact, or clearly labeled assumption.

---

## 15. Submission and presentation checklist

### Prototype

- [ ] Static path completes without any API key.
- [ ] Opportunity Contract exposes support, contradiction, freshness, and provenance.
- [ ] Three brands are compared.
- [ ] Geography/rights action changes Preparedness and route.
- [ ] Sprint metric/window/scale/kill rules are locked before the result.
- [ ] Rights/claim failure is visibly blocked.
- [ ] Maker-checker is required.
- [ ] Learning Ledger retains hypothesis, decision, override, and outcome.
- [ ] Synthetic/public/assumption/model-inference labels are consistent.
- [ ] Public URL and direct hero link work in incognito and on a second network.
- [ ] Backup recording exists locally and in a second safe location.

### Slides

- [ ] Exactly three first-round slides; no separate cover.
- [ ] Headlines alone tell the full argument.
- [ ] Slide 2 uses a real final prototype screenshot.
- [ ] QR and short URL open the guided hero.
- [ ] All synthetic scores, results, targets, costs, and value are labeled.
- [ ] Influencer-count discrepancy is omitted.
- [ ] No claim of real HUL integration.
- [ ] No “first in the world” or unsupported “real-time” claim.
- [ ] Sources are legible and exact.

### Rules/team

- [ ] Three-member registration requirement is satisfied even though one person builds.
- [ ] Names/institute/team identifier are correct.
- [ ] File format, naming, upload location, and deadline are rechecked against the supplied rulebook.
- [ ] Final PDF opens on a second device.

---

## 16. Source notes for this operating plan

### Current tool/subscription sources

- [OpenAI: Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/)
- [OpenAI: Codex app and built-in worktrees](https://openai.com/index/introducing-the-codex-app/)
- [OpenAI: ChatGPT Plus does not include API usage](https://help.openai.com/en/articles/6950777-what)
- [Claude Code: run agents in parallel](https://code.claude.com/docs/en/agents)
- [Claude Code: custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code with Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
- [Claude Code usage and limits](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)
- [Cursor pricing](https://cursor.com/pricing)
- [Cursor model-usage documentation](https://docs.cursor.com/account/pricing)

### Runtime/deployment sources

- [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [Vercel fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Gemini 3.6 Flash model](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash)
- [Gemini pricing and data-use distinction](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API-key security](https://ai.google.dev/gemini-api/docs/api-key)
- [AI SDK structured output](https://ai-sdk.dev/docs/reference/ai-sdk-core/output)
- [AI SDK Google provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
- [OpenRouter FAQ and billing](https://openrouter.ai/docs/faq)
- [OpenRouter guardrails](https://openrouter.ai/docs/guides/features/guardrails/overview)
- [OpenRouter Zero Data Retention](https://openrouter.ai/docs/guides/features/zdr)
- [Supabase pricing](https://supabase.com/pricing)
- [Supabase billing/free-project behavior](https://supabase.com/docs/guides/platform/billing-on-supabase)

---

## 17. First action when the build begins

Start at Section 7. Do not open three coding agents first. Establish the green baseline, freeze the
contracts, record the commit SHA, and only then dispatch the core, data, and UI worktrees.

**Final operating principle:** parallelize independent modules and reviews; serialize contracts,
merges, consequential decisions, and deployments.
