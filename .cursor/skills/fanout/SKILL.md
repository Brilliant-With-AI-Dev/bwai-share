---
name: fanout
description: >-
  v1.0.0 · Parallelize a task by fanning it out across multiple background agents
  that work simultaneously. Invoke as `/fanout <range>` where the range is the
  number of agents to use (e.g. `/fanout 3-5`, `/fanout 8`, `/fanout 4-10`). Use
  this skill whenever the user wants work done in parallel, split across agents,
  or faster through concurrency — phrases like "fan out", "in parallel", "split
  this across N agents", "spin up some workers", "divide and conquer", or when a
  task is obviously a large batch (many files, many items, many sources) that
  would be slow to do serially. Works for both partitioning one big workload into
  chunks AND splitting a task into distinct independent subtasks.
metadata:
  version: 1.0.0
  changelog:
    - "1.0.0 — initial: range-as-agent-budget, partition-a-batch + independent-subtasks patterns, sequential-trap guard with hybrid partial-fanout, enumerate-batch-first before slicing, overhead guard, gather-and-synthesize."
---

# Fanout

**Announce the version.** Make your FIRST line of output `▶ fanout v<version>`,
reading `<version>` from this file's `metadata.version` frontmatter — so Matt can
see which version actually ran the moment `/fanout` is triggered.

Fanout takes a task and runs it across several background agents at once instead
of doing it serially. The point is wall-clock speed and throughput: ten agents
each researching four companies finish roughly ten times faster than one agent
grinding through forty.

You are the **orchestrator**. You decompose the work, launch the agents, then
gather and finish. The agents do the heavy lifting in parallel; you own planning
and assembly.

## The argument is an agent budget

The skill is invoked as `/fanout <range>`. The argument tells you how many
background agents you may use:

- `/fanout 3-5` → use between 3 and 5 agents.
- `/fanout 8` → use up to 8 agents (treat a single number as the max, 1 as the min).
- `/fanout` with no argument → pick a sensible number yourself, defaulting to
  3-6 unless the workload clearly wants more or fewer.

**Size the fleet to the actual work, then cap at the max.** The range is a
ceiling, not a quota. If the user says `/fanout 2-10` but the task splits
cleanly into 3 natural pieces, use 3 — spinning up 10 agents for 3 units of work
just creates idle agents and assembly overhead. If the task has 40 units and the
max is 10, use 10 and give each agent 4 units. The guiding question is "how many
agents does this work genuinely benefit from?" bounded above by the max.

## What you're fanning out

The task to parallelize is whatever the user asked for alongside the command —
either spelled out in the same message ("/fanout 5 — summarize each of these 20
PDFs") or the task you've been discussing in the conversation. If it's at all
ambiguous what work they want fanned out, ask before launching agents; a
mistaken fan-out wastes a lot of motion.

## Step 1: Decide if the work is actually parallelizable

Fanout only helps when the pieces are **independent** — when agent A's work
doesn't depend on agent B's output. Two patterns qualify:

- **Partition a batch.** One uniform workload over many items: process 200
  files, research 40 companies, transcribe 30 recordings, check 50 URLs. Split
  the items into roughly equal, non-overlapping groups, one group per agent.
- **Independent subtasks.** A task that decomposes into distinct pieces: "audit
  the auth, billing, and notifications modules", "draft the intro, methods, and
  conclusion sections". Each agent owns one piece.

If the steps are inherently **sequential** (each needs the previous one's
result — e.g. "first scrape the data, then clean it, then model it"), fanout is
the wrong tool. Say so and offer to run it serially instead. Don't force a
dependency chain into parallel agents; you'll just get garbage from agents
guessing at inputs they don't have yet.

But look for a **parallelizable stage inside a mostly-sequential pipeline**
before giving up. Often only the chain _as a whole_ is sequential while one stage
is itself a batch. "Scrape these 10 sites, normalize the data, then build a
chart" is sequential end-to-end, yet the scrape is 10 independent fetches. The
right move is hybrid: fan out that one stage (one agent per site), then run the
dependent stages (normalize, chart) serially on the gathered results. Partition
the parallel part, don't parallelize the pipeline.

## Step 2: Plan the split

Before launching anything, write out a quick plan: how many agents, and exactly
which slice each one gets. Keep slices **non-overlapping** (so work isn't
duplicated) and **roughly balanced** (so no single agent becomes the long pole).
For batches, divide items as evenly as the count allows. State this plan briefly
to the user so they can see the shape before agents spin up — it's cheap
insurance against a bad partition.

If the batch is referred to indirectly — "the reviews in this folder", "all the
PDFs", a glob — **enumerate it first** so you're partitioning real items. List the
folder, expand the glob, get the actual count and names, then slice. You can't
hand an agent "your share" of a set you haven't listed; each agent prompt needs
the specific files or items it owns, and you can't name those until you've
counted them.

## Step 3: Launch the agents — all at once

Launch every agent in a **single message with multiple Agent tool calls** so
they run concurrently. Launching them one message at a time serializes the very
thing you're trying to parallelize.

Each agent runs in a **fresh context** and sees none of this conversation, so
every prompt must be fully self-contained. A good agent prompt includes:

- **The specific slice**, named explicitly. "Research these 4 companies: Acme,
  Globex, Initech, Umbrella" — not "research your share."
- **Enough context to do it standalone** — the goal, any constraints, formats,
  or domain details the agent needs. Don't assume shared knowledge.
- **The exact output you want back**, and where to put it. If agents write
  files, give each a **distinct path or filename** (e.g.
  `outputs/fanout/chunk-01.md`) so they don't clobber each other. If you want
  results returned in the response, say what structure to return them in.
- **A scope boundary** — tell the agent to do only its slice and not wander into
  the others'.

Consistency matters: give parallel agents the same output contract so the pieces
fit together when you reassemble them.

## Step 4: Gather and finish

As agents report back, collect their outputs. Then close the loop based on what
the user actually wants — this is a judgment call, not a fixed step:

- If they asked for **one deliverable** (a report, a merged dataset, a single
  answer), synthesize the pieces into a coherent whole. Smooth over seams,
  dedupe, resolve contradictions, and present it as one thing.
- If the pieces are **naturally separate** (per-file summaries, per-module
  findings), assemble them in a clear structure — grouped by chunk or subtask —
  with a short orienting summary on top.

If an agent fails or returns something unusable, you have the slice definition
from your plan, so you can relaunch just that slice or fold it into another
agent. Don't silently drop work — note any gaps in the final output.

## A note on overhead

Fanout has real fixed cost: planning the split, writing self-contained prompts,
and reassembling results. For small or quick tasks that one agent could finish in
a couple of steps, that overhead outweighs the parallelism — just do the task
directly. Fanout earns its keep when the work is genuinely big or naturally
splits into substantial independent pieces.
