---
name: redteam
description: v1.0.0 · Red-team documents with up to 5 adversarial agents, auto-apply high-confidence fixes. Use for "bulletproof this", "find holes", "stress test", "tear apart". Pass --manual for the scored, user-reviewed workflow.
argument-hint: "[N -- default = 5] [--manual]"
disable-model-invocation: true
metadata:
  version: 1.0.0
---

# Adversarial Review

Red-team any document with semi-adversarial agents. Default mode auto-applies confident wins. `--manual` runs the prior scored + approval workflow.

## Modes

- **Default (no flag):** Spawn agents, gather adversarial perspectives, auto-apply changes the assistant is 100% confident will materially improve the artifact. Silently skip changes unlikely to matter. Ask the user only when (a) uncertain about impact, or (b) the call is subjective / dealer's choice.
- **`--manual`:** Run the full scored workflow (Phases 1–4 below), including the weighting gate and explicit user approval of every proposed change.

## Agent Count Selection

**If an argument N is provided, use exactly N agents (max 5).**

Otherwise, choose agent count based on document scope:

| Document                  | Agents | Rationale               |
| ------------------------- | ------ | ----------------------- |
| <2 pages, single focus    | 1–2    | Limited attack surface  |
| 2-10 pages, multi-concern | 3      | Good coverage           |
| >10 pages or cross-domain | 4-5    | Complex needs more POVs |

**Default when no argument and scope is ambiguous: 5.**

**Override heuristic:** If you can't identify N meaningfully distinct POVs, use fewer agents. Never pad with weak perspectives.

---

## Default Workflow (auto-apply)

### Step 1: Spawn Agents

Spawn up to 5 agents (per Agent Count Selection). Each MUST output this header first:

```
AGENT_HEADER:
- agent_id: A1 | A2 | A3 | A4 | A5
- pov_name: <3-6 words>
- pov_goal: <what this agent optimizes for>
- primary_attack_vector: <what it tries to break>
- non_overlap_note: <how it differs from others>
```

POVs must be derived from the document and meaningfully different. If two converge, adjust the weaker one.

### Step 2: Gather Recommendations

Each agent outputs concrete, atomic, located recommendations (no scoring required). One change per rec, with a doc reference.

### Step 3: Triage and Apply

The assistant triages every recommendation into exactly one bucket:

- **Apply now (silent):** 100% confident the change materially improves the artifact. Apply directly. No user prompt.
- **Skip (silent):** Change unlikely to matter, or net-negative. Drop it. No user prompt.
- **Ask:** Genuine uncertainty about impact, or subjective / taste / dealer's choice. Surface to user with the rec and a one-line tradeoff.

### Step 4: Report

After applying, report:

- What was applied (one line per change, with doc reference)
- What was skipped and why (≤3 words each, grouped)
- Open questions for the user (only the "Ask" bucket)

No scoring. No weighting gate. No blanket review step.

---

## `--manual` Workflow (scored + user-reviewed)

Use the four phases below when `--manual` is passed.

### Phase 1: Agent Setup

Spawn up to 5 agents (per Agent Count Selection). Each MUST output this header first:

```
AGENT_HEADER:
- agent_id: A1 | A2 | A3 | A4 | A5
- pov_name: <3-6 words>
- pov_goal: <what this agent optimizes for>
- primary_attack_vector: <what it tries to break>
- non_overlap_note: <how it differs from others>
```

**Rules:**

- Derive POVs from the document—don't use generic personas
- POVs must be meaningfully different (minimize overlap)
- If two converge, adjust the weaker one

### Phase 2: Agent Output

Each agent outputs max 12 recommendations, sorted by priority_score desc:

```
AGENT_OUTPUT:
- agent_id: A1 | A2 | ... | A5
- pov_name: <repeat>
- top_risks: [<max 5 bullets>]

RECOMMENDATIONS:
- rec_id: <A1-01, A1-02, ...>
  title: <max 8 words>
  category: Assumption | Scope | Metrics | UX | Tech | GTM | Legal/Policy | Ops | Execution | Other
  doc_reference: <section/heading + locator or quote ≤10 words>
  problem: <1-2 sentences>
  recommendation: <1-2 sentences, concrete action>
  rationale: <why it matters>
  scoring:
    value: 1-5          # business/user impact
    risk_reduction: 1-5 # de-risks core bet?
    time_criticality: 1-5 # cost of delay
    confidence: 1-5     # likelihood issue is real
    effort: 1-5         # effort to fix
    priority_score: <computed>
```

**Recommendation rules:**

- Atomic (one change, not a bundle)
- Actionable (clear edit/add/remove/decide/test)
- Located (cite specific section)
- No vague advice without concrete edit

**Scoring formula:**

```
priority_score = (value + risk_reduction + time_criticality) × confidence ÷ effort
```

**Tie-breaker:** Higher time_criticality → Higher risk_reduction → Lower effort

Agents MAY suggest weight adjustments:

```
WEIGHTING_SUGGESTIONS (optional):
- suggestion_id: A1-W1
  change: <e.g., "2× time_criticality">
  why: <1 sentence>
```

### Phase 3: Weighting Gate

After all agents complete, propose weight adjustments:

```
WEIGHTING_PROPOSAL:
- proposal: No change | <specific adjustments>
- reasoning: <max 6 bullets>
- request: "Approve? (Y/N) or edits"
```

**STOP and wait for user approval.**

### Phase 4: Final Synthesis (after approval only)

```
FINAL_SYNTHESIS:
- dedupe_rules: <how duplicates merged>
- conflicts_resolved: <which recs conflicted, resolution>
- final_plan:
  - implement_now: [rec_id + 1-line why]
  - implement_later: [rec_id + 1-line why]
  - ignore: [rec_id + 1-line why]
- change_list: <ordered edits/checks/tests>
- open_questions: <only those blocking implement_now>
```

**Deduping:** Merge same-problem recs into master rec, keep strongest reference/rationale, preserve dissent as note.

**Conflict resolution priority:** Time criticality → Risk reduction → Lower effort (when outcomes comparable).

## Scoring Reference (`--manual` only)

| Factor           | 1               | 3                           | 5                    |
| ---------------- | --------------- | --------------------------- | -------------------- |
| Value            | Negligible      | Meaningful but localized    | Material outcome     |
| Risk Reduction   | Minor edge case | Bounded risk                | De-risks core bet    |
| Time Criticality | Can wait        | Delay weakens learning      | Delay harms outcomes |
| Confidence       | Speculative     | Plausible, partial evidence | Strong evidence      |
| Effort           | Trivial         | Moderate                    | Significant          |

Default weights: All 1×. Adjust per context in Phase 3.
