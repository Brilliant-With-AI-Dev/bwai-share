---
name: html-artifact
description: v1.1.0 · Generate a single-file self-contained HTML artifact for human reading and sharing — comparison grids, implementation plans, PR reviews, reports/explainers, custom editing interfaces, mockup galleries. Routes by audience: private/for-your-eyes-only → native Claude Code artifact (live claude.ai URL); shared/durable/stakeholder-facing → published to bwai-share (public URL). Use when the user asks for an "HTML artifact", "HTML doc", "HTML report", "side-by-side comparison", "implementation plan as HTML", "PR review as HTML", "mockup gallery", or when the output benefits from rich formatting (SVG diagrams, color-coded severity, interactivity, export buttons) more than Markdown can provide. Not for production web apps, multi-page sites, or anything that needs a build step.
metadata:
  version: 1.1.0
  changelog:
    - 1.1.0 (2026-07-06) — audience routing: native Claude Code artifact for private output, bwai-share for shared/durable. bwai-share is no longer the unconditional default.
    - 1.0.0 — single-file HTML, bwai-share publish as default.
---

# HTML Artifact

Generate one `.html` file optimized for reading and sharing. No build step, no external assets, no network at open time. The recipient opens it in a browser and immediately groks the content.

## When HTML beats Markdown

Pick HTML when ANY of these apply:

- Multiple options need side-by-side visual comparison.
- The output has data flow, rendered diffs, or color-coded severity.
- The reader benefits from interactivity (toggles, sliders, sortable lists, live preview).
- The reader is non-technical or unlikely to open a raw `.md` file.
- The output will be archived and reused as a reference across sessions.

If none apply, write Markdown instead.

## Route by audience (decide first)

Once HTML is the right medium, pick the destination by **who reads it** — this is the first decision, before archetype:

- **Private / for-your-eyes-only** (a plan for Matt to review, a session dashboard, a PR walkthrough for himself, options to compare) → **native Claude Code artifact.** Use the `Artifact` tool: it publishes a live page to a private claude.ai URL that updates in place as the session continues, versioned, with no repo commit. This is the default when Matt is the only intended reader. If the `Artifact` tool is unavailable (plan/auth/provider gate — Claude writes a local file and says it can't publish), fall back to **Local-only** below and tell Matt the native path was unavailable.
- **Shared / durable / stakeholder-facing** (anything Matt will send to a client, teammate, or his phone; anything meant to outlive the session in a repo he owns) → **bwai-share** (public Vercel URL, no login, git-archived). Follow ## Publish. Also use bwai-share when Matt explicitly asks for a shareable/public link, or when native artifacts are unavailable and the content must be shareable.

When unsure, ask which audience — it's one of the few questions allowed before generation. Don't default to bwai-share just because it's more automated; a public URL for a private plan is the wrong call.

## The six archetypes

Pick one before writing. See [REFERENCE.md](REFERENCE.md) for the base template, palette, and per-archetype scaffolds.

1. **Comparison grid** — N variants side by side, labeled tradeoffs.
2. **Implementation plan** — Mockups + data flow + annotated code snippets.
3. **Code review** — Rendered diff with inline margin annotations, severity-coded.
4. **Report / explainer** — Synthesized findings with SVG diagrams.
5. **Custom editor** — Editable inputs with live preview and an export button.
6. **Mockup gallery** — Design variants with interactive parameter knobs.

## Hard rules

- **Single file.** All CSS inline in `<style>`. All JS inline in `<script>`. All images inline as data URIs or SVG.
- **No external dependencies.** No CDN, no fonts, no analytics, no Tailwind/Bootstrap/React. Nothing that hits the network at open time.
- **Export buttons.** Any artifact with structured data (decisions, annotations, reorderings) ships with a "Copy as JSON" or "Copy as Markdown" button so the data flows back to Claude. For long-form reports, a full markdown round-trip is non-trivial — emit a TL;DR or section-by-section summary and say so in the button label.
- **Color-coded severity.** Three tiers: info (slate), warn (amber), critical (red). See REFERENCE.md.
- **Light theme, editorial base.** Pure white surfaces, near-black ink (~`#0e1116`), hairline borders (`#d8dce1`). **Serif h1/h2** (system stack — `Iowan Old Style`/Georgia) over a sans body. Vivid Bold accents for emphasis and state — blue (`#0b5fff`), gold (`#e0a400`), success green (`#0a7d33`), warn amber (`#a65a00`), danger red (`#c91f1f`). **Table headers are a dark `--ink` band**; **badges are squared** (5px), not pills. High contrast. Flat surfaces only — no gradients on backgrounds. Subtle hairline shadows OK; no glossy or heavy drop shadows. Prefer vivid colored _left borders_ over tinted full backgrounds for callouts, lanes, and reccos — keeps the page white and the accents punchy. (For a flat/technical artifact you can revert to plain GitHub-light per REFERENCE.md → Palette.) See REFERENCE.md → Palette.
- **Print-friendly.** Include `@media print` rules so the artifact prints cleanly.
- **Mobile-responsive by default.** Every artifact must render and stay fully usable at a 375px viewport (iOS Safari included): no horizontal page scroll, no clipped content, no focus-zoom. The base template guards this (`overflow-x:hidden` + `min-width:0` on grid children). **Data tables collapse to compact cards below 720px** (headline + tight `label | value` grid + id accent line) — never a tiny sideways-scrolling grid; a 2–3 column table may stay scrolling. Long tables go in collapsible sections (`<details>`, closed on phones) with a count in the summary. Tap targets ≥ 40px. See REFERENCE.md → Mobile responsiveness (required) → Responsive data tables.
- **System fonts only.** No webfonts, no Google Fonts, no network. Use the `--serif` (`"Iowan Old Style", Georgia, …`), `--sans` (`-apple-system, …`), and monospace (`"SF Mono", Menlo, …`) system stacks from the base template.
- **No emojis** unless the user requested them.
- **Interactivity earns its place.** If the artifact has more than one audience, scenario, or configuration, build it in — persona toggles, filter chips, decision-tree reveals, diff-from-default modes. Static walls of text are a Markdown job. See REFERENCE.md → Interactive scenario exploration.
- **Diagrams: ASCII first, SVG second.** Reach for an ASCII tree or flow in a `<pre>` block before an SVG. SVG only when you need color, parallel branches, more than ~15 nodes, or curved connectors. See REFERENCE.md → Diagrams.
- **Plain English opening for mixed-audience reports.** If the artifact will be read by anyone non-technical (executives, clients, your own future self while context-switching), open the Report archetype with (a) a "Plain English overview" card answering _what is this / who is it for / what you get_, then (b) a "Today vs After vs Why it matters" state-delta block, **before** the TL;DR. The TL;DR is for technical readers; the opening is for everyone else. See REFERENCE.md → Plain English opening.
- **Embed source markdown via base64, not `<script type="text/markdown">`.** PostToolUse formatter hooks reformat raw markdown in script tags, breaking byte-exact round-trip. Base64-encode the source and decode at click time. See REFERENCE.md → Markdown export limitation.
- **Brownfield by default for setup, migration, and config guides.** Assume the reader already has _some_ non-zero starting state and provide a way for them to mark what they already have. Three required affordances: (a) an **audit checklist** at the top that lets the reader self-assess against the recommendations; (b) **section-level "already have this" indicators** that dim or check off when the corresponding audit item is ticked; (c) a **green-machine / brownfield mode toggle** that, in brownfield mode, hides bootstrap steps the reader has ticked as done. Reserve pure greenfield language for true day-zero scenarios. The state-delta block's "Today" lane must reflect the _range_ of starting states the reader might be in, not a worst-case strawman. See REFERENCE.md → Brownfield treatment.

## Workflow

1. Confirm the archetype if ambiguous. Don't guess between "plan" and "report".
2. **Pick the slug; check for collision (pre-generation).** Derive a kebab-case `<slug>` from the topic. Check `~/code/bwai-share/<slug>/` does not already exist (`ls -d ~/code/bwai-share/<slug>/ 2>/dev/null`). If it does, ask the user — suffix (`<slug>-2`) or replace — **before** generating. A slug collision is one of the few questions allowed.
3. Sketch the structure in 2-3 lines before generating: header, sections, export.
4. Write the file.
5. Verify at a 375px width (browser resize or mentally): no horizontal page overflow, data tables collapse to compact cards (narrow tables scroll inside their container), long sections collapsible, every control reachable.
6. If the artifact carries structured data, confirm the export format matches downstream use.
7. **Deliver by the audience route you picked** (see ## Route by audience): native Claude Code artifact for private, ## Publish (bwai-share) for shared, ## Local-only for an explicit local file.

Clarifying questions are allowed **only before the artifact is generated** (audience route, archetype, slug collision, scope). Once generation begins, run straight through to the live URL — no approval asks, no manual-push handoffs.

## Publish (shared route)

For **shared / durable / stakeholder-facing** artifacts (see ## Route by audience), publish to **bwai-share** (`https://bwai-share.vercel.app/<slug>/`) autonomously. bwai-share is a single-branch static-HTML site: each artifact is a `<slug>/index.html` directory at the repo root, and every fast-forward of `main` auto-deploys via Vercel. Run this sequence end-to-end with **no pause, no approval ask, and no local-only detour** between "generate" and "live URL":

1. **Sync the publish base.** `git -C ~/code/bwai-share fetch origin`. You branch from `origin/main`, never from whatever is currently checked out — the sanctioned ref-update only succeeds as a clean fast-forward.
2. **Place the artifact.** Write the self-contained file to `~/code/bwai-share/<slug>/index.html` (slug-cased dir at the repo root — the existing convention; it then serves at `https://bwai-share.vercel.app/<slug>/`).
3. **Link it from the index (same commit).** Add a new `<li>` to the **top** of the `<ul class="artifacts">` list in `~/code/bwai-share/index.html`, matching the existing card markup:
   ```html
   <li>
     <a href="<slug>/">
       <p class="title">Human-readable title</p>
       <p class="meta">YYYY-MM-DD — one-line description of what this is.</p>
     </a>
   </li>
   ```
   The index link is part of bwai-share's convention — commit it together with the artifact.
4. **Branch off `origin/main`, commit, push** (recoverable, pre-authorized git — not guard-sensitive):
   ```bash
   git -C ~/code/bwai-share checkout -B feat/<slug> origin/main
   git -C ~/code/bwai-share add <slug>/ index.html
   git -C ~/code/bwai-share commit -m "feat(<slug>): publish artifact"
   git -C ~/code/bwai-share push -u origin feat/<slug>
   ```
5. **Publish — the one sanctioned command.** Fast-forward `main` on the remote with exactly this command, verbatim. It is the repo's documented publish recipe and the only guard-allowlisted publish action:
   ```bash
   gh api -X PATCH repos/Brilliant-With-AI-Dev/bwai-share/git/refs/heads/main -f sha=$(git -C ~/code/bwai-share rev-parse feat/<slug>)
   ```
   `-f sha=` does **not** force; it only succeeds when `feat/<slug>` is a clean fast-forward of `main` (which is why step 4 branched off `origin/main`). If it is **rejected as non-fast-forward** (someone published between your fetch and now), re-run from step 1: re-fetch, re-create the branch on the new `origin/main`, re-push, re-PATCH. Publish one artifact at a time.
6. **Confirm the deploy — bounded, never an open wait.** Poll the live URL until it returns 200, capped at ~90s:
   ```bash
   for i in $(seq 1 18); do curl -so /dev/null -w '%{http_code}' https://bwai-share.vercel.app/<slug>/ | grep -q 200 && break; sleep 5; done
   ```
   On timeout, do not stall — return the URL with a "deploy still propagating, give it a minute" note.
7. **Return the live URL** with its trailing slash: `https://bwai-share.vercel.app/<slug>/`. The deterministic path ends here. Cleanup (deleting the `feat/<slug>` branch) is optional and must never gate the URL or prompt the user — since you branched off `origin/main`, local `main` was never touched and the leftover branch is harmless.

## Autonomy contract (no human-in-the-loop)

- **This contract governs the bwai-share (shared) route.** Once the audience route is bwai-share, the sequence below runs autonomously — the native-artifact and local-only routes have their own, simpler paths.
- **The only permitted interruption is a clarifying question asked _before_ the artifact is generated** (audience route, archetype, slug collision, scope). Once generation begins, run straight through to the live URL without stopping for approval.
- **Never hand the user a manual `git push`, `! …`, or "paste this" command, and never ask them to publish.** The skill publishes itself.
- **Never bypass, probe for, or route around the push-to-`main` guard.** Step 5 is the single guard-sensitive command. If it is **denied because it is not yet allowlisted**, STOP and tell the user plainly:

  > The artifact is committed and pushed to `feat/<slug>`, but the bwai-share publish command isn't allowlisted in the guard yet. Apply the guard rule for that one `gh api … refs/heads/main` ref-update, then re-run — the work is saved, nothing is lost.

  Do not search for the guard, do not try an alternate transport (no direct `git push origin main`, no `vercel deploy`, no web UI), do not improvise a workaround. The safe halt is the intended behavior, not a failure to fix.

## Local-only (opt-out)

Only when the user **explicitly** asks for a local file (no publish): write the artifact to `./artifacts/<kebab-slug>.html` (or the user's path), verify at 375px, and return an absolute `file://` URL for cmd-click preview. Skip the entire Publish sequence.

## Anti-patterns

- Don't pull in Tailwind, Bootstrap, React, or any framework via CDN.
- Don't generate a multi-page site or any artifact that requires a server.
- Don't write JavaScript that fetches external resources at runtime.
- Don't decorate with stock images — SVG only.
- Don't optimize for production polish. Optimize for "I can read this and act on it".
- Don't measure size by line count — formatters will lie to you. Measure by content density: if you're nesting cards more than 3 deep, repeating the same archetype across many sections, or scrolling past 3 screens of the same visual pattern, split.

See [REFERENCE.md](REFERENCE.md) for the base HTML template, color palette, severity badges, export-button snippet, and per-archetype scaffolds.

---

**Maintainer note (not runtime).** This skill ships inside the `lh` plugin, served from a versioned cache. Edits to this file are inert until you run `claude plugin update lh@looped-dotfiles` and restart Claude Code — a version bump alone does not refresh the cache.
