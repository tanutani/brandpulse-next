# Phase 0 Research: BrandPulse Causal Opportunity Router

## 1. Case-grounded decision

The case does not ask for a unified dashboard. It asks teams to reimagine the brand-management
lifecycle, show a coherent portfolio of AI products, prioritize one, and take that product through
journey, capabilities, agents, architecture, governance, cost, roadmap, and a functional prototype.
The most explicit process failure is the lag between disconnected social, consumer, commerce,
agency, and operational signals and an approved brand action.

The launch also states that HUL already has strong building blocks: roughly 2.2 million-outlet sales
visibility, millions of first-party consumer records, about 25,000 consumer connects and a queryable
repository, a large influencer roster, factory sensors, AI-assisted planning, and AI-generated
advertising. The solution therefore consumes those assets rather than proposing another consumer
chatbot, creator matcher, or asset generator.

## 2. Product alternatives and selection

Scores are 1 (weak) to 5 (strong). The weighted total uses the official case weights: Product
Thinking 25%, Ecosystem Thinking 20%, AI/Feasibility 20%, Prioritization 15%, Business Impact 15%,
Creativity/Prototype 5%.

| Product option | Product | Ecosystem | Feasibility | Priority | Impact | Prototype | Weighted / 5 | Decision |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Consumer research copilot | 3 | 3 | 5 | 2 | 3 | 4 | 3.30 | Existing HUL capability makes it weak as the core. |
| Creator and content autopilot | 3 | 3 | 4 | 2 | 3 | 5 | 3.15 | Crowded and overlaps HUL/partner capabilities. |
| Trend forecast dashboard | 4 | 3 | 4 | 4 | 4 | 4 | 3.80 | Valuable but already a mature software category. |
| **Causal Opportunity Router** | **5** | **5** | **4** | **5** | **5** | **4** | **4.75** | Selected. Closes the decision and learning loop. |
| Fully autonomous Brand OS | 3 | 5 | 1 | 2 | 5 | 1 | 3.05 | Too broad and risky for one builder in ten days. |

## 3. Why the first BrandPulse framing was rejected

A product that detects a cultural signal, validates it with synthetic consumers, generates
on-brand content, and sends it for approval is not sufficiently novel. Brand Reflex publicly
describes almost that exact six-stage reflex arc. Black Swan, Trendalytics, Spate, Tastewise,
Brandwatch, Sprinklr, and Quid cover signal detection or trend prediction. Adobe GenStudio and
CreativeX cover governed content creation and compliance. Swayable, LiftLab, and Incremental cover
causal or incrementality measurement.

The differentiation must be the joint decision that those categories leave between them:

1. Does independent evidence prove an opportunity rather than social noise?
2. Which portfolio brand has permission to own it without collision or cannibalization?
3. Can that brand actually execute now in the target market and channel?
4. What is the smallest pre-registered causal test that can resolve the uncertainty before the
   opportunity expires?
5. What did the organization learn, including when a human overrode the recommendation?

No publicly documented product was found that closes this exact loop using enterprise consumer,
portfolio, commerce, inventory, creator, and approval data in one governed Opportunity Contract.
This is a bounded public-market claim, not proof that no private internal implementation exists.

## 4. Build-or-buy decisions

### Next.js and Vercel

**Decision**: Use a single Next.js App Router application deployed to Vercel.

**Rationale**: It minimizes integration points, supports server-only model calls, and gives the solo
builder preview deployments and a public URL. Separating a frontend and API would add failure modes
without improving the judged story.

### XState

**Decision**: Use XState 5 for the governed workflow.

**Rationale**: The product has consequential transitions, recovery states, and human gates. A visible
state chart makes forbidden transitions testable and turns governance from slideware into product
behavior. Do not use experimental autonomous-agent extensions.

### Vercel AI SDK plus Gemini

**Decision**: Use the Vercel AI SDK with the current stable Google provider and
`gemini-3.6-flash`, selected through an environment variable and re-verified on build day.

**Rationale**: The SDK supports structured generation and provider substitution. Gemini provides
structured output and a free usage tier appropriate for public/synthetic prototype data. Model
names and package versions must be pinned on build day because these services change.

**Boundary**: An LLM is used for evidence synthesis, counter-hypotheses, explanations, and copy
drafts. Scoring, routing, blocks, causal thresholds, and approvals remain deterministic.

### File fixtures instead of a database

**Decision**: Use checked-in JSON/JSONL fixtures plus `localStorage` for the first-round prototype.

**Rationale**: The demo is read-heavy, has only a few scenarios, and must survive provider outages.
A hosted database adds authentication, schema, networking, and deployment risk. The production
architecture can use BigQuery/Cloud Storage and enterprise identity; a later pilot may add Supabase
or Cloud SQL for collaboration.

### Snapshot data instead of live scraping

**Decision**: Manually capture small, cited public snapshots and combine them with synthetic internal
fixtures.

**Rationale**: Live platform scraping is brittle, may violate terms, and creates privacy and demo
risk. Provenance and a capture date are more valuable to the prototype than live volume.

## 5. HUL data advantage

| Gate or task | Prototype representation | Envisioned HUL source |
|---|---|---|
| Signal velocity and persistence | Cited search/social/news snapshots | Existing social-listening and web-scraping platforms |
| Consumer language and need states | Synthetic interview snippets | 25,000-consumer-connect repository and first-party CRM |
| Behavioral progression | Synthetic search, basket, and off-take series | Chanakya, e-commerce/q-commerce, and 2.2m-outlet visibility |
| Brand permission | Versioned brand-memory configuration | Brand strategy, historic campaigns, claims, creative and research repositories |
| Operational preparedness | Synthetic SKU stock and service levels | Demand sensing, distributor/outlet, supply, and channel systems |
| Creator readiness | Synthetic aggregate creator profiles | HUL influencer roster and agency platforms |
| Activation and compliance | Precomputed briefs and policy rules | Sangam, WPP/agency systems, CreativeX, legal/claims workflow |
| Learning | Simulated incrementality result | Campaign, sales, media, and experimental measurement systems |

## 6. Production architecture decision

The prototype architecture should not masquerade as production. In HUL, connector events would
arrive through Pub/Sub/Dataflow into BigQuery and Cloud Storage. Vertex AI or Gemini Enterprise
agents would retrieve permitted evidence and generate structured synthesis. Cloud Run services
would calculate P3 gates and experiment contracts; Workflows/Eventarc would orchestrate events;
IAM, DLP, lineage, audit logging, and approval roles would enforce governance. Existing Chanakya,
Sangam, demand-sensing, influencer, WPP/agency, and CreativeX tools would be integrated rather than
replaced.

## 7. Evidence quality and manipulation controls

- Independence is based on source families, not raw post count.
- Duplicate posts, one-creator concentration, paid seeding, unexplained spikes, geographic mismatch,
  and stale data produce explicit penalties or a Watch state.
- Consumer verbatims support a hypothesis but do not estimate population prevalence.
- Search supports curiosity; commerce/off-take supports behavior; repeat or geographic diffusion
  supports durability. The product does not conflate them.
- Every recommendation shows the strongest counter-hypothesis and the evidence needed to falsify it.

## 8. Primary research required before submission

Interview five to eight brand, category, agency, e-commerce, social-listening, or insights
practitioners. Ask for one recent signal decision, systems touched, time lost, evidence needed,
approval blockers, readiness surprises, and how success was measured. Do not ask whether the idea is
good; replay a concrete case through the prototype and observe where the decision contract is
incomplete.

Back-test 15-20 public signals and label each live moment, emerging shift, durable trend, fad/noise,
or unresolved at two points in time. Measure route agreement, false Act recommendations, and which
evidence dimension changed the label. This is more differentiating than a large synthetic survey.

## 9. Authoritative and market sources

- HUL FY2024-25 consumer highlights: https://hul-performance-highlights.hul.co.in/performance-highlights-fy-2024-2025/consumers.html
- HUL Integrated Annual Report 2025-26: https://www.hul.co.in/files/annual-report-2025-26.pdf
- Google Cloud Unilever customer hub: https://cloud.google.com/customers/featured/unilever
- Google Cloud account of Unilever marketing optimization: https://cloud.google.com/blog/topics/customers/how-unilever-uses-google-cloud-to-optimize-marketing-campaigns/
- Brand Reflex: https://brandreflex.ai/
- Black Swan Trendscope: https://info.blackswan.com/landing-page
- Trendalytics: https://trendalytics.co/
- Spate: https://www.spate.nyc/features/accurate-trend-prediction
- Tastewise Trend Spotlight: https://tastewise.io/blog/how-tastewises-trend-spotlight-empowers-cpgs
- Adobe GenStudio brand compliance: https://business.adobe.com/products/genstudio/performance-marketing/brand-compliance.html
- CreativeX and Unilever: https://www.creativex.com/blog/unilever-turns-to-creativex-to-scale-creative-best-practices-across-the-globe
- Swayable: https://www.swayable.com/
- Vercel AI SDK agents: https://ai-sdk.dev/docs/agents
- Gemini structured output: https://ai.google.dev/gemini-api/docs/structured-output
- XState documentation: https://stately.ai/docs

All market sources establish publicly described capabilities only. Vendor accuracy and ROI claims
are not reused as expected BrandPulse performance.
