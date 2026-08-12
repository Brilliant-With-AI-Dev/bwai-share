# Anti-Patterns

## Bad critique patterns

Avoid:
- Long checklists detached from the plan.
- Generic advice like add tests, add logging, document it, consider edge cases, unless made specific and justified.
- Recommending architecture because the plan feels too simple.
- Future-proofing for hypothetical scale.
- Asking for broad rewrites without identifying the actual failure mode.
- Turning every uncertainty into a blocker.
- Penalizing plans for not solving problems outside scope.

## Plan smells

Watch for:
- Starts coding before inspecting relevant existing code.
- Adds new framework/library without clear need.
- Creates abstraction before second concrete use case.
- Broad refactor bundled with feature delivery.
- No validation loop until the end.
- Assumes data shape or API behavior without checking.
- No rollback path for risky migration.
- Complex state changes without tests around invariants.
- Hidden permissions/auth/security implications.
- Missing observability for asynchronous or distributed behavior.

## Good hardening moves

Prefer:
- Move discovery earlier.
- Shrink first implementation slice.
- Add targeted test for the riskiest invariant.
- Replace abstraction with local implementation until duplication appears.
- Add rollback/feature flag only when blast radius justifies it.
- Add instrumentation only where failures would be opaque.
- Split risky migration from behavior change.
