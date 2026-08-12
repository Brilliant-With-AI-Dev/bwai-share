---
name: catch-me-up
description: Restore working context for a busy executive returning to a workstream by summarizing what led here, current state, material changes, implications, unresolved items, and the exact next action. Use when the user says "catch me up," asks for a re-entry summary or session recap, returns after a break, or invokes "catch me up fast" for a recommendation to continue, compact, switch, reset, or stop.
---

# Catch Me Up

Restore the user's working context and narrative in one fast read. Preserve the operational detail needed to resume accurately while minimizing hunting and performative framing.

## Route the mode

Read the text supplied with the invocation before writing:

- If it starts with `fast`, case-insensitively, use Decision mode. Treat anything after `fast` as extra scope or context.
- Otherwise use Default mode. Other text may scope the recap by topic, workstream, or time range.

Use the current conversation and available workspace state as evidence. Inspect referenced local state when needed to distinguish planned, built, committed, merged, deployed, and currently active work. Do not mutate state. If an external detail cannot be checked with the available tools, mark it unknown or last known rather than inventing it.

## Default mode

Write a re-entry summary for a busy executive returning after an extended break.

### Required output

Start with `### Re-entry summary`, followed by a plain one-line title naming the workstream and status.

Then write a short executive narrative in easy-to-read prose. Use succinct but complete bullets when they improve scanning. Answer these questions in order:

1. What led here? Reintroduce names, terms, issue numbers, and prior decisions gently enough to reconnect the narrative.
2. Where are we? State the workstream and its current status.
3. What changed? Include only material events since the last checkpoint.
4. Why does it matter? Explain the implication, decision pressure, or strategic meaning.
5. What is open? Name unresolved decisions, blockers, asynchronous work, pull requests, files, branches, owners, and dependencies that affect re-entry.
6. What happens next? Give the exact next action, its owner, and why it is the right move.

End with:

`**NEXT:**` one exact action the user should take, plus the minimum context needed to take it.

## Decision mode

The user has lost the thread and wants a call on what to do with the session itself.

Produce two parts:

1. **Re-entry summary** — compress the Default-mode narrative enough to reconnect the user without burying them in detail.
2. **Recommendation** — make one honest call from the options below. Do the analysis internally and show the conclusion, not the deliberation.

Choose:

- **Continue** when the current goal is still right, progress is real, and context is coherent enough to proceed.
- **Compact** when the goal is right and progress is real, but thread length and clutter are now the main problem.
- **Switch** when the work has drifted or stalled, or another task matters more. State what to preserve and where: the work's issue, a WIP branch, or a handoff note.
- **Reset** when the approach is wrong, tangled, or built on a bad premise, and rebuilding will cost less than continuing. State what learning or work to preserve first.
- **Stop** when the goal is complete, no worthwhile next action remains, or continuing would create work without value. State any final state that still needs recording.

Assess whether the original goal is still right, how much real unfinished progress exists versus churn, whether the context remains coherent, and whether unsaved state must be captured.

Lead the recommendation with the single option in plain language and one or two sentences explaining why. Name a close runner-up in one line only when useful. Never hand back a menu. Flag unsaved state prominently and say exactly how to preserve it before switching or resetting.

End with:

`**RECOMMENDATION:**` the one option, the reason in one sentence, and the exact next action to execute it.

## Rules for both modes

- Lead with the narrative spine, not a mechanical checklist.
- Preserve exact branch names, file paths, pull request numbers, tickets, owners, blockers, asynchronous runs, and timestamps when they affect the next move.
- Include an `as of` or `last verified` timestamp or checkpoint when available.
- Say `unknown` for unknown details. Do not infer completion from intent or stale context.
- Make any required decision obvious; do not bury it.
- Exclude the full backlog. Include only what affects immediate re-entry.
- Avoid gimmicky labels, emojis, motivational language, apologies, and break narration.
- Do not compress away state, ownership, or narrative clarity.
- Ensure the user can understand the story and next move without rereading the prior thread.
