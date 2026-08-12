---
name: capture-idea
version: 1.1.0
description: "v1.1.0 · Capture a distinct new idea as a linked follow-up without silently expanding the work already underway. Use when Matt or an agent says 'Capture this,' 'Save this idea,' 'Create a follow-up,' 'Don't lose this,' 'Capture this, but don't change the current scope,' or when a clearly separate idea emerges during active work and can be recorded without interrupting progress. Check for duplicates, create and link a Linear issue or synchronized GitHub fallback, state the end-user impact gates, confirm briefly, and return to the original task."
---

# Capture Idea

Capture the idea as tracking work only. Treat invocation as authorization to create the issue and the minimum relations or comments needed to link it. Do not implement the idea, modify product code, merge a pull request, or add it to active scope.

## 1. Preserve the current task

Record the current task, issue, pull request, repository, project, and initiative from available context. State internally that its scope remains unchanged. Perform the capture at a natural break, then resume the original work.

If the idea is required for the current work to be safe or correct, capture it as a blocker. Do not silently add it to scope and do not declare the current work complete or safe to release until the blocker is resolved. Continue only with work that remains safe.

## 2. Define the idea and user impact

Write a short, outcome-focused title and summarize:

- what should change;
- why it matters;
- whether it could affect end users: `Yes`, `No`, or `Maybe`;
- the concrete conditions that must be met before users can be affected;
- one to three acceptance checks.

Use plain language. Do not turn a small follow-up into a speculative project.

## 3. Resolve routing and check duplicates

Read available conversation context and the current repository's `docs/agents/issue-tracker.md` when it exists. Resolve exact tracker, team, project, initiative, and current-work identifiers before writing. Inherit the current project and initiative when the idea belongs to the same outcome. Never invent identifiers.

Ask Matt one focused question only when the project or initiative cannot be inferred safely, or when capture itself requires a genuine product decision. Do not ask about routine issue fields that can be inferred.

Search Linear before creating anything. Search the relevant team and project using the idea's distinctive terms, synonyms, and intended outcome; inspect strong matches, including recently closed issues when useful. Compare purpose and acceptance outcome, not title alone.

- If an issue already covers the same outcome, do not create another. Link the current work to it and add only genuinely missing context.
- If no issue covers the outcome, create a new one.
- If Linear is unavailable, perform the same duplicate check in the synchronized GitHub repository before using the fallback in section 5.

## 4. Create and link the Linear issue

Use the available Linear issue tools and read-before-write workflow. Create the issue in the resolved team and inherit the current project or initiative when appropriate. Use this lean body:

```markdown
## Idea

<What should change>

## Why

<Why it matters>

## User impact

- Could affect end users: <Yes | No | Maybe>
- Conditions before impact: <specific gates such as implementation, review, testing, flag enablement, deployment, migration, or adoption>

## Relationship

- Captured from: <current Linear issue, GitHub pull request, GitHub issue, task, or concise work description>
- Current scope: Unchanged

## Acceptance

- <one to three observable checks>
```

Link both directions when the systems support it:

- current Linear issue: create a related or blocking relation as appropriate;
- GitHub issue or pull request: include its full URL in the Linear issue and add the Linear link back to the existing thread when permitted;
- task without a durable URL: name the task in `Captured from`, then return the new issue link in the current conversation.

Use `blocks` rather than `related` when the idea is necessary for current safety or correctness.

## 5. Fall back to synchronized GitHub

Treat Linear as unavailable when its tools are absent, authentication fails, or the write still fails after one safe retry. Follow the repository's issue-tracker instructions and create the issue in the synchronized GitHub repository. When the current repository declares no tracker mapping, default the fallback to `alignmktg/myos`. Preserve the same body, duplicate handling, relationship, and project routing; use the declared `proj:*` label when that is how the sync maps projects.

Reference the current issue or pull request in the new issue, and add a reciprocal reference when permitted. Follow ambient disclosure rules for agent-authored public messages. Say explicitly: `Linear project/initiative mapping still needs confirmation.`

If neither Linear nor a synchronized GitHub tracker is available, do not claim success. Return an issue-ready title and body, label it `Capture pending`, explain the tracker failure in one sentence, and leave the current task's scope unchanged.

## 6. Confirm and resume

Use one of these formats, then return immediately to the original work:

`Captured: <ID and linked title> · <new | existing duplicate> · users: <Yes | No | Maybe>, after <conditions> · current scope unchanged. Returning to <original task>.`

`Captured blocker: <ID and linked title> · current scope unchanged, but completion/release waits for <condition>. Returning to safe work on <original task>.`

For the fallback, begin with `Captured in GitHub:` and include `Linear mapping needs confirmation.` Keep the confirmation to two short sentences at most.
