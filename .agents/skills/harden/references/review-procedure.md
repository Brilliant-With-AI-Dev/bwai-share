# Review Procedure — PLAN lens

This is the lens for an implementation **plan**. For a PRD/ADR/spec/design/README, use `doc-review.md` instead.

Review the plan in this order.

## 1. Understand intended outcome

Identify:

- User-visible goal.
- Non-goals implied by the plan.
- Required behavior versus optional embellishment.
- Existing system constraints mentioned or omitted.

Do not penalize omissions irrelevant to the requested scope.

## 2. Check proportionality

Ask:

- Is the plan simpler than the problem allows?
- Is it more complex than the problem needs?
- Does it introduce durable abstractions for temporary uncertainty?
- Could the same result be achieved with fewer moving parts?

Unnecessary complexity counts as a planning flaw.

## 3. Inspect assumptions

Look for assumptions about:

- APIs, schemas, existing code behavior, user flows, permissions, data shape, deployment model, test environment, or third-party behavior.
- Whether discovery/research is needed before coding.
- Whether the plan verifies assumptions early enough.

Prefer suggestions that move uncertainty earlier.

## 4. Inspect sequencing

Good plans de-risk early. Check whether the plan:

- Reads relevant code before editing.
- Finds existing conventions before adding new ones.
- Creates narrow validation loops.
- Implements in reversible slices.
- Tests the riskiest assumption before broad changes.

## 5. Verify against the codebase (HEAVY only, and only for delete/rename claims)

Run this step **only** when both hold: the profile is HEAVY, and the plan actually deletes or renames something. Skip it entirely for LIGHT and STANDARD, and for any plan with no deletes or renames. A plan review is not a code audit — do not grep every identifier the plan touches.

When it applies, pick the **3 riskiest delete/rename claims** (the ones whose breakage would be worst: shared modules, exported symbols, widely-imported files) and check only those:

1. Grep the repo for references to that identifier. Command: `grep -r "IDENTIFIER" . --include="*.ts" --include="*.js" --include="*.py" -l` (adjust extensions to the project).
2. Confirm every referrer is covered by a delete-step or edit-step of the plan. Any unaccounted referrer is a dangling reference finding.
3. For delete-steps: confirm the file/symbol is not imported or called outside the delete-step chain.
4. For rename-steps: confirm every call-site is in the plan.
5. Check ordering: if step N deletes file A and step M (M > N) edits a file that imports A, flag it as a build-break ordering bug.

Report any finding as a normal fix in the output's severity groups (output-format.md), with the `file:line` in a sub-bullet. Severity: Critical (build breaks, data loss), High (runtime failure), Medium (silent misbehavior, test failure), Low (style, observability).

## 6. Inspect failure modes

Consider only plausible risks grounded in the plan:

- Hidden coupling.
- Edge cases likely for the domain.
- State, concurrency, caching, auth, permissions, data migration, or compatibility problems.
- Missing tests for high-risk behavior.
- Poor rollback or recovery path.
- Missing observability for hard-to-debug changes.

## 7. Decide intervention level

Do not propose improvements automatically. First decide whether the plan is:

- Good enough to approve.
- Good but worth hardening.
- Flawed enough to require rework.

Then propose only the smallest set of changes that materially improves execution odds.
