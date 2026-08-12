# Improvement Economics

Every suggested improvement has cost. Treat each recommendation as spending engineering and political capital.

## Cost components

Estimate total cost from:
- Engineering time.
- Implementation risk.
- Debugging complexity.
- Cognitive overhead.
- Maintenance burden.
- Delivery delay.
- Migration or rollout risk.
- Coordination cost.

## Payoff components

Estimate expected value from:
- Preventing likely bugs.
- Reducing expensive rework.
- Improving reversibility.
- Reducing implementation uncertainty.
- Simplifying the plan.
- Improving testability where risk justifies it.
- Improving observability where debugging would otherwise be hard.

## Recommendation threshold

Recommend an improvement only when expected payoff materially exceeds total cost.

Reject:
- Low-confidence suggestions.
- Generic best practices with unclear relevance.
- Suggestions that mainly make the plan look sophisticated.
- Architecture added for speculative future needs.
- Testing or observability additions disproportionate to risk.

## Mandatory versus optional

Mark mandatory only when the current plan has a likely serious flaw.
Mark optional when it improves odds but the original plan remains acceptable.

## Confidence

Use High when the issue follows directly from the plan.
Use Medium when likely but dependent on codebase facts.
Use Low only for caveats; do not turn low-confidence ideas into recommendations.
