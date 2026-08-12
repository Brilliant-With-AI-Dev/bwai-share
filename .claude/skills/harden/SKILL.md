---
name: harden
description: "v0.4.0 · review and harden an ai coding artifact before you commit to it — an implementation plan, or a doc (prd, adr, spec, design note, readme). checks for hidden flaws, overengineering, sequencing risk, missing operational concerns, weak assumptions, and poor cost-benefit tradeoffs. use after writing a plan in plan mode, or point it at any plan/doc file."
effort: high
user-invocable: true
disable-model-invocation: false
allowed-tools: Read Grep Glob Bash Agent WebFetch WebSearch
argument-hint: "[path/to/plan-or-doc.md] (optional — defaults to this session's current plan)"
args: "[path] — optional absolute path to a plan or doc file. Omit it and the skill hardens the current plan from this session (the plan you just wrote in plan mode). Pass a path to harden a different plan, or any doc (PRD/ADR/spec/design/README)."
metadata:
  version: 0.4.0
  changelog:
    - "0.4.0: Renamed plan-hardening-review → harden. Output rebuilt: one-line header (COMPLEXITY + RECO: GO / MODIFY / RE-PLAN, replacing the confusing 'approve with hardening'), one Why: line, fixes grouped by severity (Critical/High/Medium/Low) with LOE + CONF, empty groups omitted, clean artifact prints 'No fixes. GO.'. Caveman-terse throughout. New generic DOC lens (references/doc-review.md) for PRDs/ADRs/specs/design notes/READMEs — completeness, clarity, consistency, decision soundness; drops the codebase audit and slice-sequencing checks that only apply to plans. Orchestrator now classifies PLAN vs DOC and dispatches the matching lens."
    - "0.3.0: Inline orchestrator + clean review subagent. The skill runs inline (so it already knows this session's plan path) and hands that path to a fresh general-purpose Agent that performs the review — unbiased by the planning conversation, heavy work kept off the main thread — then relays the verdict. Codebase verification downgraded to HEAVY-only, capped at the 3 riskiest delete/rename claims."
    - "0.2.0: Run inline instead of context:fork — the review executes in the agent that wrote the plan, so it already knows the current plan file. Fixed the blank-fork failure where a bare invocation spawned an empty agent that could not find the plan. Version banner added."
    - "0.1.0: Initial — forked-agent review; plan resolved by explicit path or most-recently-modified auto-detect."
---

# Harden

**You are an orchestrator, running inline, and you already know this session's plan file. Do NOT review the artifact yourself.** Your job: figure out what you're hardening, hand it to a clean review subagent with the right lens, and relay the verdict. A fresh agent reviews without the authoring conversation's bias and keeps the heavy work out of this thread.

## The whole skill — resolve, classify, banner, dispatch, relay

1. **Resolve the artifact path.**
   - If `$ARGUMENTS` is a file path (starts with `/` or `~`), use it.
   - Otherwise use this session's current plan — the plan file written in plan mode, whose path you already know.
   - If there is genuinely no plan and no path, print one line — `Nothing to harden in this session. Point me at one: /harden <path>` — and stop.

2. **Classify PLAN vs DOC.** Read the head of the file (first ~40 lines) — this is the only reading you do.
   - **PLAN** — an implementation plan: numbered steps, "## Changes", file edits, sequencing, a plan-mode plan under `~/.claude/plans/`. This is the default when ambiguous.
   - **DOC** — a PRD, ADR, spec, design note, or README: states a problem/decision/requirements, not an ordered build sequence.

3. **Print the banner.** Your FIRST line of output, before dispatch:
   `▶ harden · <TYPE> · <basename> · v<version>`
   where `<TYPE>` is `PLAN` or `DOC`, `<basename>` is the file name, `<version>` is this file's `metadata.version`. Example: `▶ harden · PLAN · logical-dragonfly.md · v0.4.0`.

4. **Dispatch one clean reviewer.** Call the Agent tool, `subagent_type: general-purpose`, with the prompt below. Substitute `<PLAN_PATH>`, `<REPO_DIR>` (the repo the artifact targets — default to the current working directory), and `<TYPE>`. Do not review it yourself. The review is read-only, so no worktree isolation.

5. **Relay.** Print the subagent's response verbatim, directly under your banner. Do not re-rank, soften, or second-guess it. If the subagent fails to return, say so and review inline as a fallback.

### Reviewer prompt

> You are an independent hardening reviewer with no prior context; this prompt is self-sufficient. Output is caveman-terse: fragments, arrows, no filler, no preamble.
>
> **Artifact to harden:** `<PLAN_PATH>` (type: `<TYPE>`) — read it in full.
> **Repository for any codebase checks:** `<REPO_DIR>`.
>
> **Load the methodology.** Run:
> `REF=$(ls -d ~/.claude/plugins/cache/*/lh/*/skills/harden/references 2>/dev/null | sort -V | tail -1); [ -z "$REF" ] && REF=~/dotfiles/ai/claude/plugins/lh/skills/harden/references; echo "$REF"`
> Then read, in order: `$REF/calibration.md`, then **the lens for your type** — `$REF/review-procedure.md` if `<TYPE>` is PLAN, or `$REF/doc-review.md` if `<TYPE>` is DOC — then `$REF/improvement-economics.md`, `$REF/anti-patterns.md`, `$REF/output-format.md`. Consult `$REF/../examples/*.md` only if calibration or output style is unclear.
>
> **Your stance.** You own the P&L: artifact quality first, downstream velocity second. Maximize useful intervention, not critique volume. Recommend GO confidently on strong artifacts. Price every fix (LOE, disruption, payoff) and reject low-ROI, generic, speculative, or fashionable ones. Treat unnecessary complexity as a real flaw; prefer simplification and reversible decisions; never invent risks the artifact does not ground.
>
> **Do.** (1) Classify LIGHT / STANDARD / HEAVY per calibration.md. (2) Review per your lens (review-procedure.md for PLAN, doc-review.md for DOC). (3) Respond in the EXACT structure of output-format.md — do not reprint the `▶` banner (the orchestrator already printed it); start at the `COMPLEXITY` line.

## Reference modules (the subagent reads these)

- `references/calibration.md` — LIGHT/STANDARD/HEAVY selection and review intensity (shared).
- `references/review-procedure.md` — the **PLAN** lens: inspection sequence, sequencing de-risk, codebase delete/rename audit.
- `references/doc-review.md` — the **DOC** lens: completeness, clarity, consistency, decision soundness.
- `references/improvement-economics.md` — cost/benefit model for suggested changes (shared).
- `references/anti-patterns.md` — common bad suggestions and artifact smells (shared).
- `references/output-format.md` — mandatory response structure (shared).
- `examples/{light,standard,heavy}.md` — calibration/output reference.
