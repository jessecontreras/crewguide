# BRUNT CrewGuide AI

CrewGuide AI is a demo internal workflow shell for BRUNT. It starts with one concrete workflow: helping store reps turn natural-language customer needs into grounded product recommendations. It also includes a Business Ops layer for reviewing AI use cases, mapping source systems, tracking friction, and showing how Claude Code prototypes could move into governed internal workflows.

## Problem

Store reps should not have to manually search the full catalog every time a customer describes a jobsite need, budget, safety requirement, or comfort preference. As the catalog grows, product-fit questions get harder to answer quickly and consistently.

At the same time, internal teams can now prototype AI tools quickly with Claude Code. That is useful, but without a shared review path those prototypes can become one-off workflows with unclear data access, no evals, no ownership, and no governance.

## Solution

CrewGuide turns a natural-language customer need into grounded product guidance. It extracts constraints, scores a curated public BRUNT catalog slice, explains why each product fits, shows tradeoffs, asks clarifying questions when evidence is weak, and logs friction signals for Business Ops.

The Store workflow helps the rep in the moment. The Business Ops workflow shows the operating layer around AI adoption: use case intake, source-system mapping, ownership, eval expectations, governance status, and production readiness.

The product names, links, and images are based on public BRUNT catalog examples. Product metadata, inventory signals, review themes, and operational signals are seeded for the demo and should be replaced with approved internal sources in production.

## Why this matters

This is not just catalog search. It is a narrow, measurable AI workflow with a production path.

The rep gets faster product guidance. Business Ops gets visibility into repeated customer needs, missing metadata, unanswered questions, and potential workflow opportunities. Engineering gets a safer pattern for AI development: ground the assistant in approved data, expose the reasoning, log friction, and expand scope only after evals and governance are in place.

## Core concept

The assistant is built around a simple principle:

> The catalog is the source of truth. The model should explain grounded evidence, not invent product guidance.

The recommendation flow is deterministic and testable. The system normalizes a rep's question, scores product records, decides whether the evidence is strong enough, and only then synthesizes a rep-friendly answer.

## Architecture

The app has four simple layers:

1. **Retrieval layer**: extracts constraints from the rep's natural-language question and scores product records.
2. **Confidence layer**: decides whether the evidence is strong enough to recommend or whether the assistant should clarify.
3. **Synthesis layer**: turns retrieved product evidence into rep-friendly guidance. The included mock provider is deterministic and works without secrets.
4. **Feedback layer**: logs low-confidence, missing-attribute, ambiguous, and no-match events, plus rep-submitted feedback, so Business Ops can see where the workflow breaks down.

The UI mirrors this as a four-stage strip:

```text
Understand -> Retrieve -> Recommend or clarify -> Log friction