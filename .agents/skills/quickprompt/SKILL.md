---
name: quickprompt
description: Rewrite rough intent or a draft instruction into one precise, self-contained prompt for a coding assistant without executing the task, with an optional --ask flow for a configurable number of sequential clarification questions (default 3). Use when the user says "quickprompt," asks to tighten or upgrade a prompt, wants a copy-paste-ready agent prompt, or needs a lightweight alternative to exhaustive prompt design.
---

# Quickprompt

Produce one upgraded coding-assistant prompt from the user's rough intent or draft. The deliverable is the prompt, never the work described by it.

## Runtime model selection

Apply these rules before rewriting the prompt, using the host's normal model controls:

- On ChatGPT or Codex, run this skill with 5.6 Terra, Medium Reasoning, and Standard Speed.
- On Claude or Claude Code, run this skill with the highest-versioned generally available Sonnet model offered by that host. Exclude explicitly labeled 1M-context variants. When versions match, choose the latest revision.
- Model selection changes only the runtime used to perform the rewrite. It does not change the procedure, authorize tool use, or add model details to the output.

## Procedure

1. Identify the draft from the user's request or the text supplied with the invocation. Parse the optional clarification flag as follows, then remove the flag and any consumed numeric value from the draft:
   - `--ask` or `--ask=true`: enable the clarification flow with the default of 3 questions.
   - `--ask N` or `--ask=N`: enable the clarification flow with exactly `N` questions, where `N` is a positive base-10 integer.
   - An omitted flag or `--ask=false`: disable the clarification flow.
   - If an explicit value supplied with `--ask=` or as a numeric token after `--ask` is not a positive integer, reply with one sentence asking for a positive whole-number question count, then stop.
2. If no draft exists, reply with one sentence asking for the draft prompt or intent, then stop. Do not begin the clarification flow until a draft exists.
3. Work only from the draft and, when the clarification flow is enabled, the user's answers. Do not call tools, inspect files, execute commands, or research the task.
4. When the clarification flow is enabled, ask exactly `N` questions before writing the upgraded prompt, using `N = 3` when no numerical value was supplied:
   - Ask one question per message and wait for the user's answer before asking the next.
   - Use the draft and prior answers to ask about the highest-impact unresolved requirement, expectation, scope boundary, constraint, or success criterion. Do not ask for information the user already supplied.
   - Format every question exactly as shown, replacing `1` with the current question number and `N` with the total question count:

     **Q1 of N:** Text of the question?

     - **A.** Text of option A 🥇
     - **B.** Text of option B

   - Present exactly two concrete, mutually exclusive options. Do not add an “Other” option, preamble, explanation, or additional question.
   - Append `🥇` to the objectively best-practice or clearly recommended option when one exists. Otherwise, omit it. Never mark both options.
   - Accept either option or a free-form answer, and incorporate the substance of the answer into the final prompt.
   - Do not produce the upgraded prompt until the user has answered all `N` questions.
5. Choose the smallest prompt shape that fully specifies the work, incorporating the clarification answers when collected.
6. Return only the upgraded prompt as Markdown inside one fenced code block whose opening fence is ```` ```markdown ````.

## Scale the prompt

- For a trivial, clear request, write one to three tight sentences. Do not add headings.
- For a bounded task, use only the sections that change execution:
  - Implementation: `Objective`, `Context`, `Scope`, `Done when`, `Verify`, and `Constraints`.
  - Research, diagnosis, review, or planning: `Objective`, `Context`, `Scope`, `Evidence`, `Deliverable`, and `Constraints`.
- For a long-running, cross-system, materially ambiguous, or risky task, add phase outcomes, action and approval boundaries, stopping conditions, and the expected completion report when they materially improve execution.

Select the shape using task type, material uncertainty, risk or irreversibility, and the number of dependent stages. Prefer the lighter shape when either would work; length alone does not justify more structure.

## Make it executable

- State the desired end state unambiguously.
- Preserve exact targets the user supplied.
- Surface implicit requirements that are necessary for correctness.
- Describe the destination and decision criteria. Prescribe a sequence only when its order or checkpoints are necessary for correctness.
- For implementation, define testable completion and proportionate validation.
- For research, diagnosis, and review, define the evidence standard, source constraints when relevant, and the required form of the conclusion.
- Set in-scope and out-of-scope boundaries when drift is plausible.
- Add safety or approval gates only when the task itself warrants them.
- Never invent file paths, symbols, APIs, facts, or requirements. Preserve uncertain references as written or describe them generically.
- Resolve safe ambiguity with the most reasonable explicit `Context` assumption. If different interpretations would materially change the outcome, scope, or authorization, instruct the executing assistant to ask the smallest blocking question before acting.
- Do not repeat ambient assistant configuration, standing style rules, or generic safety boilerplate.
- Add a role, examples, XML structure, or model-specific guidance only when it materially changes behavior.
- Keep the prompt vendor-neutral unless the user names a particular assistant or the task depends on assistant-specific behavior.

## Output contract

When a draft exists and any enabled clarification flow is complete, output only the upgraded prompt as Markdown, wrapped in one fenced code block whose opening fence is ```` ```markdown ````. Include no preamble, explanation, tier label, model-selection details, or sign-off outside the block. The one-sentence requests for missing input or an invalid question count in Procedure steps 1–2 and the `N` single-question messages required by Procedure step 4 are the only exceptions. Do not execute any part of the resulting prompt.
