---
name: context-interview
description: Elicit complete, decision-sufficient context through a structured interview before execution. Use when the user invokes context-interview, asks to be interviewed about a goal or decision, or wants requirements, priorities, constraints, and success criteria clarified without unsupported inference.
---

# Context Interview

Interview the user until the context for their topic is sufficient for reliable downstream execution. Persist the working inventory in a scratch file throughout the interview. Conduct the interview only; wait for explicit instruction before performing the resulting work.

## 1. Establish the topic

Use the topic supplied with the invocation, including relevant context already present in the conversation. If no topic is discernible, ask for the topic in one sentence, then stop until the user replies.

Treat an explicit positive whole-number question limit as `max_q`. If the supplied limit is not a positive base-10 integer, ask for a positive whole number and wait. Otherwise, ask as many questions as needed under the stopping rules below.

Completion criterion: the topic and any question limit are explicit.

## 2. Build and persist the Insight Inventory silently

Analyze the topic and existing context. Construct an internal schema containing every decision-relevant field in two tiers:

- **ESSENTIAL:** Missing information would require an unsupported conclusion.
- **SUPPLEMENTAL:** Information would improve quality or efficiency but is not required for correctness.

For every field, record:

- Canonical field name
- Type: enum, boolean, number, or text
- Why it matters, in one short phrase
- Acceptance condition: what counts as specified
- Status: Known, Unknown, or Conflicting

Prepopulate Known fields from context the user has already supplied. Never infer a required value.

Create one private Markdown scratch file immediately after constructing the inventory. Prefer the host's session scratch directory; otherwise use the operating system's temporary directory. Give the file a collision-resistant name beginning with `context-interview-` and retain its path for the full interview.

Record only structured interview state, not hidden reasoning:

- Topic, current phase, exact pending question when one exists, target field when applicable, creation and update timestamps, `q_count`, `max_q`, CCCSS, and band. Use `unbounded` when no question limit exists and `Not scored` before the first CCCSS computation.
- Separate ESSENTIAL and SUPPLEMENTAL tables with field name, type, why it matters, acceptance condition, status, and the confirmed value or concise conflict
- Any material unresolved gaps

Use the scratch file as the inventory's single source of truth. Before sending any transparency, interview, conclusion, or extension question, record the current phase and exact pending question; also record its target field and increment `q_count` when it is a numbered interview question. Apply owner-only permissions when the host supports them. Read the file back after every write and verify that both inventory tiers and all required metadata remain present. If creation or any later update fails, stop before asking another question and report the scratch-file failure.

Completion criterion: every decision-relevant field is represented and assigned a status in a successfully verified scratch file.

## 3. Offer transparency

Say exactly:

> I’ve analyzed the topic and currently available context to assess the most relevant context still needed (aka the Insight Inventory). Would you like to review the Insight Inventory before we begin the interview? (Y/N)

Wait for the answer. If yes, read the scratch file and summarize the inventory in succinct bullets without exposing hidden reasoning. Then, regardless of the answer, report the score and apply the stopping rules if the existing context already supports a CCCSS of at least 81%; otherwise, ask Q1 immediately. Keep the scratch file and its path internal unless the user asks for them.

## 4. Run the interview

Ask one question per message and wait for the answer. Number interview questions consecutively across turns:

`**Q1:** Text of the question`

For each question:

1. Read the current scratch file.
2. Select the highest-impact Unknown or Conflicting field, prioritizing ESSENTIAL fields.
3. Construct one atomic question about that variable using the lowest-cognitive-load format that can capture a valid answer.
4. Persist and verify the exact pending question, target field, phase, and incremented `q_count` as required above.
5. Ask the persisted question and wait for the answer.
6. Incorporate the answer, detect conflicts, and reassess sufficiency before asking anything else.

Do not ask for information already supplied. Treat broad, unstable, or internally inconsistent answers conservatively and use an atomic clarification question when needed.

### Question-format priority

Prefer formats in this order when they fit the field:

1. Binary choice or 2–3-option multiple choice
2. Likert scale, numeric scale, semantic differential, forced ranking, or constant-sum allocation for complex or high-stakes tradeoffs
3. Clarification probe
4. Open-ended narrative, creative brainstorming, situational judgment, or hypothetical
5. Explicit tradeoff analysis or case study when simpler formats cannot capture the needed context

For an open-ended question, include short prompts or examples that make it easier to answer.

For a closed-choice question:

- Make options explicit, mutually exclusive, and collectively exhaustive within the stated scope.
- Keep distinct states separate; never merge assumptions into an option.
- When objective best practice favors one or two choices, mark each favored choice `🌟 Option Title (RECO)` and state the criterion it optimizes. Treat the recommendation as advisory.
- Accept a free-form answer even when choices are offered. Preserve the user's meaning without reinterpretation.

## 5. Score sufficiency after every interview answer

Compute an internal numeric **Conservative Confident Context Sufficiency Score (CCCSS)** from the inventory. Judge whether the available context supports the objective without inference; do not use a linear field average or a fixed per-question increment.

Apply these bounds conservatively:

- **0–40%, low:** major gaps prevent a dependable interpretation of the objective.
- **41–80%, medium:** material gaps remain. If any ESSENTIAL field is Unknown or Conflicting, the score cannot exceed 80%.
- **81–90%, very high:** every ESSENTIAL field is Known and consistent; only minor gaps remain.
- **91–100%, extremely high:** context is execution-ready. A score above 95% requires every ESSENTIAL field to be Known, consistent, stable, and precise, with no remaining gap capable of materially changing execution.

Apply downward pressure for conflicts, unstable answers, over-broad selections, and missing ESSENTIAL fields. When uncertain, score lower. The band must match the numeric score.

After computing the score, write the revised inventory, answer-derived values, cleared pending question, current phase, `q_count`, CCCSS, band, and update timestamp to the scratch file. Read it back to verify the update before sending the next user-facing message. Never continue from interview state that exists only in conversational memory.

After each answer, report:

`My **Conservative Confident Context Sufficiency Score (CCCSS)** is **<N>%**, in the **<band>** range.`

Then apply the stopping rules before deciding whether to ask another interview question.

## 6. Apply stopping rules

Let `q_count` be the number of interview questions asked. The transparency question and stopping questions do not count.

### No user-supplied question limit

- If CCCSS is below 81%, ask the next interview question.
- If CCCSS is 81–95%, ask: “I think I have enough information now. Would you like to conclude the interview and continue to the next step? (Y/N)”
- If CCCSS is above 95%, conclude automatically.

If the user declines the proposal to conclude, continue with the highest-impact remaining gap. Reapply these rules after the next answer.

### User-supplied question limit

- While `q_count < max_q`, follow the same confidence rules above.
- At `q_count == max_q` with CCCSS of at least 81%, conclude.
- At `q_count == max_q` with CCCSS below 81%, calculate `N` as the number of remaining Unknown or Conflicting ESSENTIAL fields, with a minimum of 1, and ask the following with the calculated number substituted for `N`: “We're at the question limit. May I ask N additional questions to reach very high confidence? (Y/N)”
- If the user approves, increase `max_q` by `N` and continue. If the user declines, conclude and identify the ESSENTIAL gaps that prevent execution-ready confidence.

### Conclusion

When concluding:

- Stop asking interview questions.
- Mark the scratch file `Concluded`, add the final score and confirmed-context brief, and verify the write. Retain the file for the host's normal scratch cleanup.
- Provide a concise confirmed-context brief covering the objective, priorities, requirements, constraints, success criteria, and material decisions that apply.
- Identify unresolved gaps only when they could affect downstream work.
- Wait for explicit instruction before executing, planning, researching, or modifying anything based on the interview.
