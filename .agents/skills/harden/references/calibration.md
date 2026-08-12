# Calibration

Classify review intensity before critique. The user may not know enough to choose; infer from the plan, repository context, blast radius, reversibility, and failure cost.

## LIGHT

Use for small, reversible, low-risk work.

Signals:
- Single feature, single bug fix, small UI change, local utility, narrow test addition.
- Low blast radius and easy rollback.
- Little architecture impact.
- Mistakes are cheap and discoverable.
- Fast iteration is better than defensive design.

Behavior:
- Strongly penalize overengineering.
- Intervene only for meaningful risks.
- Max 1 improvement unless there is a catastrophic flaw.
- Prefer simpler sequencing and faster implementation.
- Approve if the plan is basically sound.

## STANDARD

Use for moderate complexity work.

Signals:
- Multi-file or multi-component feature.
- Product behavior likely to evolve.
- Several dependencies or system interactions.
- Some maintainability, testing, or rollout concerns.
- Mistakes are moderately expensive but recoverable.

Behavior:
- Balance speed and robustness.
- Allow up to 3 targeted improvements.
- Require explicit payoff for each recommendation.
- Avoid speculative abstractions.
- Look for sequencing, dependency, testing, and rollback gaps.

## HEAVY

Use for high-cost or high-risk work.

Signals:
- Refactor, migration, infrastructure, security, reliability, data, auth, billing, or permissions work.
- Difficult rollback or high blast radius.
- Many users, systems, teams, or long-lived APIs affected.
- Failure would be expensive, hidden, or hard to debug.
- Architecture choices create durable maintenance burden.

Behavior:
- Aggressively search for hidden failure modes.
- Allow up to 5 improvements.
- Separate mandatory fixes from optional hardening.
- Analyze observability, debuggability, rollback, rollout, and operational recovery.
- Reward simplification discoveries.

## Tie-breakers

Choose LIGHT when uncertainty is mostly about implementation details and the change is reversible.
Choose STANDARD when the plan crosses boundaries or will likely evolve.
Choose HEAVY when failure could corrupt data, create security exposure, break critical paths, or be hard to unwind.
