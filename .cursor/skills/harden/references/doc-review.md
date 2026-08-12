# Review Procedure — DOC lens

This is the lens for a **doc**: a PRD, ADR, spec, design note, or README — anything that states a problem, a decision, or requirements rather than an ordered build sequence. For an implementation plan, use `review-procedure.md` instead.

A doc is not code, so the plan-only checks **do not apply**: skip the codebase delete/rename audit, build-ordering, and slice sequencing. Judge the doc on whether it is complete, clear, internally consistent, and (for decision docs) soundly reasoned.

Review in this order.

## 1. Name the doc type and its job

Identify which it is and what that type owes the reader:

- **PRD** — problem, target users, success metrics, scope, non-goals, key requirements.
- **ADR** — context/forces, the decision, alternatives considered, consequences (good and bad), reversibility.
- **Spec / API doc** — inputs, outputs, states, error cases, contracts, edge behavior.
- **Design note** — the approach, the tradeoffs, what it explicitly rejects.
- **README** — what it is, how to run it, the minimal path to value.

Review the doc against the job of its type, not a generic checklist.

## 2. Completeness

Which sections the type needs are present and substantive (not placeholder):

- PRD: is success measurable? are non-goals stated? are users concrete?
- ADR: are real alternatives considered, or is the "decision" unopposed? are negative consequences admitted?
- Spec: are error/edge cases and contracts covered, not just the happy path?

Flag a missing load-bearing section as High; a thin-but-present one as Medium.

## 3. Clarity

- Vague or untestable requirements ("fast", "intuitive", "scalable") with no threshold.
- Undefined terms, or one term used two ways.
- Ambiguity a reader could implement two incompatible ways — the most expensive doc defect; flag High.

## 4. Consistency

- Goals vs non-goals: does the doc later require something it called out of scope?
- Internal contradictions between sections.
- Claims that contradict known system constraints or other cited docs.

## 5. Decision soundness (ADR / design docs)

- Are the alternatives real, or strawmen that make the chosen path look inevitable?
- Are consequences honest — does it admit what gets worse?
- Is the decision reversible, and does the doc say so? Irreversible decisions deserve more scrutiny and a stated exit.
- Is the reasoning grounded, or asserted?

## 6. Decide intervention level

Do not propose changes automatically. Decide whether the doc is:

- Sound enough to act on (GO).
- Sound in spine but needs the flagged fixes first (MODIFY).
- Flawed deep enough — wrong decision, missing core section, fundamental ambiguity — that it needs re-drafting (RE-PLAN).

Then surface only the smallest set of fixes that materially improves the doc. Respect the calibration cap.
