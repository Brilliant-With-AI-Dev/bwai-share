---
name: pr-triage
description: v1.0.0 · Triage and resolve a repo's entire open-PR backlog end to end — classify every open PR (ready to merge / needs touch-ups / trumped / scrap-and-rewrite) with fanned-out reviewer subagents, close the dead ones, write reviewed implementation plans for the rewrites, capture everything as a committed TODO.md, then (on approval or `auto`) execute to completion with a hard reviewer-approval gate before any merge. Use when the user says /pr-triage, "triage the open PRs", "review the PR backlog", "clean up our PRs", "which PRs should we merge or close", or wants an old pile of PRs dispositioned and driven to done. NOT for reviewing a single PR (use /review or /code-review) and not for repos with no PR workflow.
user-invocable: true
metadata:
  version: 1.0.0
  changelog:
    - 1.0.0 (2026-07-06) — initial version, from Matt's four-prompt PR-backlog workflow.
---

# pr-triage

First line of output: `▶ pr-triage v1.0.0`.

Run a repo's open-PR backlog through five phases: **triage → prune & plan → summarize → TODO.md → execute**. Repo-generic: operate on the repo you're invoked in (confirm it has a remote with open PRs via `gh pr list`; if there are none, say so and stop).

## Modes

- **Default (checkpointed):** stop for Matt exactly twice — after Phase 1 (before closing anything) and after Phase 2 (before executing anything). Each checkpoint ends with one **A/B** decision per the standing contract.
- **`auto`:** `/pr-triage auto` runs all five phases straight through. Passing `auto` IS Matt's authorization for the PR closes and merges this run performs — do not re-ask. Everything else (reviewer gates, worktree isolation) still applies.

## Phase 1 — Triage

1. `gh pr list --state open --json number,title,headRefName,updatedAt,author,mergeable` plus recent main history, to see what's already landed.
2. Fan out reviewer subagents (parallel, read-only) so each PR gets a real review: does it still apply cleanly, is the code sound, has main since absorbed or obsoleted it, does another open PR do the same job better? For borderline or conflicting calls, run a second independent reviewer and reconcile.
3. Produce the classification list, one line of plain-language rationale each:
   - ✅ **Ready to merge** — sound, current, no conflicts.
   - 🔧 **Good but needs touch-ups** — rebase, small fixes, then merge.
   - 🪦 **Trumped** — superseded by a better PR or by code already merged.
   - 💡 **Scrap & rewrite** — good idea, wrong implementation; worth a fresh plan.
4. **Checkpoint** (skip in `auto`): present the list, then A/B — proceed as classified vs. adjust.

## Phase 2 — Prune & plan

1. Close every 🪦 PR with a courteous comment stating why (what superseded it, with links) and thanking the author. Agent-authored comments on shared repos carry the standing agent sign-off.
2. For each 💡 feature, spawn a planner subagent to write an implementation plan; spawn a separate reviewer subagent to critique it; revise until clean. Every plan MUST:
   - link **every** PR that inspired it (all of them, if several attempted the same feature);
   - describe where the existing implementation lives and how the redo should differ;
   - honor the repo's simplicity bar — laziest thing that works, name what you're deliberately not building.
3. **Plan artifacts — route by audience.** Plans are for Matt's review, so default to **native Claude Code artifacts** (Artifact tool → live private claude.ai URL, updates in place as plans revise). If the Artifact tool is unavailable in the session, fall back to committed HTML/markdown files under `plans/` in the repo and hand back file paths; use bwai-share only if Matt asks for a link he can send to someone else.
4. **Checkpoint** (skip in `auto`): hand over the plan links, then A/B — execute vs. revise plans.

## Phase 3 — Summarize

Plain-language streams of work: what merges as-is, what rebases then merges, what was closed and why, what gets reimplemented per which plan — and the recommended execution shape (sequential vs. parallel worktrees) with a one-line reason.

## Phase 4 — TODO.md

Write the full program as a checklist in `TODO.md` at the repo root — one box per merge, rebase, and reimplementation, each linking its PR/plan. Commit it (repo's own branch conventions; a `chore/pr-triage` branch + PR if the repo requires PRs, direct if not).

## Phase 5 — Execute

Work TODO.md top to bottom, checking off and committing as you go:

- Each work item runs in its **own worktree + branch** — never the main checkout.
- Rebases and reimplementations follow the plans; reimplementations open fresh PRs that link back to the plan and the PRs they replace.
- **Hard merge gate: nothing merges until reviewer subagents have approved that exact diff.** A failed review loops back to fix, never to override. Record approval (reviewer + verdict) in the PR thread before merging.
- Parallelize independent items (worktree-isolated agents); keep dependent chains sequential.
- Finish with a report: merged / closed / reimplemented / anything stuck, verified vs. assumed clearly separated.

## Anti-patterns

- Don't rubber-stamp: a PR nobody reviewed is 🔧 at best, never ✅.
- Don't merge on your own judgment alone — the reviewer gate is the point.
- Don't force-push over contributors' branches; rebase onto a new branch if in doubt.
- Don't let plan scope creep past what the original PRs attempted.
