# BRUNT CrewGuide AI

CrewGuide AI is a demo internal product guidance copilot for BRUNT store reps and corporate teams.

## Problem

A retail associate should not need to manually search the full catalog to answer a customer's product-fit question. Product discovery becomes harder as the catalog grows, especially when the customer describes their job, environment, budget, safety needs, and comfort preferences in natural language.

## Solution

CrewGuide turns a natural language customer need into grounded product recommendations. It retrieves matching products from a structured demo catalog, explains why each product fits, shows tradeoffs, asks clarifying questions when evidence is weak, and logs friction signals for corporate teams.

The seeded product names are based on public BRUNT catalog examples. Product attributes, descriptions, and evidence text are demo metadata and should be replaced with approved internal product data in production.

## Why this matters

This is not just search. It is an internal AI workflow that helps retail reps move faster, customers get better guidance, corporate teams identify catalog metadata gaps, merchandising teams see repeated customer needs, and AI governance start with a narrow, measurable use case.

## Architecture

The app has four simple layers:

1. Retrieval layer: extracts constraints from the rep's natural language question and scores catalog records.
2. Confidence layer: decides whether there is enough evidence to answer safely.
3. Synthesis layer: turns retrieved product evidence into rep-friendly guidance. The included mock provider works without secrets.
4. Feedback layer: logs low-confidence, missing-attribute, ambiguous, and no-match events automatically, plus rep-submitted "Missing product / Missing attribute / Needs clarification" feedback, for the corporate dashboard.

The UI mirrors this as a four-stage workflow strip (Understand -> Retrieve -> Recommend or clarify -> Log friction) so the lifecycle is visible while the demo runs, not just in the architecture diagram.

## Production mapping

In production, the seeded catalog would become:

- Shopify for product catalog and product metadata.
- NetSuite and Deposco for inventory, fulfillment, and availability.
- BigQuery for semantic business data and analytics.
- Vertex AI / Gemini or Claude Enterprise for model access.
- LangGraph for multi-step workflows if workflow complexity justifies it.
- Terraform-managed GCP sandbox and production environments.
- Evals, monitoring, audit logs, and human feedback loops.

## Access mode (UI demo)

The profile menu's Store / Business Ops switch is a UI-only demo control. It filters the nav and default view so one app can show both audiences - it is not real role-based access. Production would enforce this with identity, role claims, route guards, and API authorization.

## What I would build next at BRUNT

If this moved from demo to a real internal tool, in priority order:

1. **Real product feed ingestion** - sync the catalog from Shopify/PIM instead of seeded JSON, so attributes, pricing, and descriptions stay current.
2. **Inventory awareness** - pull NetSuite/Deposco availability so a recommendation reflects what is actually in stock at the rep's location.
3. **Role-based access** - put the rep view and corporate dashboard behind real auth, scoped by store and role.
4. **Eval set from real rep questions** - grow the eval suite from the 5 synthetic cases here into a set sourced from actual logged rep queries and friction events.
5. **AI Council / governed production path** - move from a GCP sandbox to a reviewed deployment with model/version tracking, audit logs, and monitoring.
6. **Read-only first, controlled actions later** - keep the assistant advisory only (no cart, inventory, or order writes) until evals and governance are in place, then expand scope deliberately.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Useful checks:

```bash
npm run check
npm run build
```

## How to demo this to Dylan

A tight 90-second walkthrough, if time is short:

1. **Rep pain point (10s).** "You mentioned reps not wanting to dig through the whole catalog to match a customer to a product. This demo is built around that exact workflow." Point at the four-stage workflow strip at the top of the page: Understand -> Retrieve -> Recommend or clarify -> Log friction.
2. **Strong recommendation query (20s).** Use the "Electrician · 6\" comp toe" prompt chip. Show the workflow strip light up, then the result: a "Best match" badge, a match-percentage badge on every card, and the evidence panel.
3. **Fallback query (20s).** Use the "Pull-on budget · fallback demo" or "Heavy boot ask · fallback demo" chip (both flagged "fallback" in the UI). Point at the "This is intentional" message - the assistant asks a clarifying question instead of guessing because it does not have enough approved product evidence.
4. **Evidence panel (15s).** Hover the `?` next to the confidence score to show the tooltip explaining the 55/25/20 confidence blend, then point at the human-readable extracted needs and cited product records.
5. **Corporate dashboard (15s).** Switch to the Corporate tab. Show the "Business Signals" panel turning friction events into categories like "Repeated customer need," "Missing catalog metadata," "Training opportunity," and "Potential merchandising signal." Also point at the "Recent unanswered questions" list.
6. **Production mapping (10s).** Point at the "Production path" panel in the sidebar - this is the explicit bridge from this demo's seeded catalog and mock provider to Shopify/PIM, NetSuite/Deposco, BigQuery, GCP, and Vertex/Claude Enterprise.

## Demo script

### 30-second setup

In our last conversation, you mentioned a store rep not wanting to dig through the whole catalog to find the right product for a customer. I built a small demo around that exact workflow. It is not meant to pretend I have BRUNT's internal data. It uses seeded catalog data, but the architecture maps to Shopify, NetSuite, Deposco, BigQuery, and a governed AI app layer.

### Show the first query

Prompt:

```text
Customer is an electrician. Needs waterproof, comp toe, 6 inch, under $180. What should I show them?
```

Talk track:

The assistant extracts the constraints, retrieves matching products, and only writes the answer from product evidence. I also show the evidence panel because internal AI tools need to be inspectable. If the answer is wrong, the team needs to know whether retrieval failed, metadata was missing, or the model overreached.

### Show fallback

Prompt:

```text
Customer wants a 10 inch pull-on waterproof soft toe under $160.
```

Talk track:

Here the system should not hallucinate a product. If the catalog does not support that request, it asks a clarifying question and logs the gap.

### Show corporate dashboard

Talk track:

This is the part I think matters long-term. The rep gets help in the moment, but corporate gets a signal. If employees keep asking for attributes that are missing or inconsistent, that becomes a data-quality, training, merchandising, or product-content opportunity.

### Close

The point is not that this is the final product. The point is the operating pattern: start with one real workflow, ground it in approved data, make the answer inspectable, log friction, and only then expand the scope.

## Example prompts

- Customer is an electrician. Needs waterproof, comp toe, 6 inch, under $180. What should I show them?
- Someone works outdoors in mud and wants waterproof but does not need safety toe. What are good options?
- Compare Marin Waterproof Comp Toe and Marin 90 Degree Heel Waterproof Comp Toe for ladder work.
- Customer wants a 10 inch pull-on waterproof soft toe boot under $160.
- What product should I recommend for someone who wants a durable boot but complains about heavy footwear?

## Q&A packet

**Why this project?**

You gave an example of a store rep not wanting to search the whole catalog to find a product. I wanted to build something around that because it is concrete, useful, and close to the business. It also shows the larger AI pattern: start with a workflow that has friction, ground the assistant in approved data, make it inspectable, and create a feedback loop.

**Why not just use keyword search?**

Keyword search is useful, but customers do not always describe products the way catalogs are structured. A rep might hear "I work outdoors around mud and need something safe but not too heavy." That needs attribute extraction, product matching, tradeoffs, and sometimes a clarifying question. The goal is not to replace search. It is to turn customer language into structured product guidance.

**How does this map to BRUNT's actual systems?**

In the demo, I use a seeded catalog. In production, product data would likely come from Shopify, inventory and fulfillment context from NetSuite or Deposco, and analytical or semantic business data from BigQuery. The AI layer would sit on top of approved sources, with access controls, evaluation, monitoring, and a governed path from sandbox to production.

**How do you keep it from hallucinating?**

The model is not the source of truth. The catalog is. The system retrieves product evidence first, checks whether the match is strong enough, and only then lets the model synthesize the answer. If evidence is missing or weak, it asks a follow-up or says what it cannot determine.

**What would you measure?**

For the rep workflow, I would measure time to answer, recommendation acceptance, fallback rate, repeated low-confidence themes, and whether reps give positive or negative feedback on the answer. For the system, I would track retrieval quality, unsupported answer rate, latency, cost, and top missing metadata fields.
