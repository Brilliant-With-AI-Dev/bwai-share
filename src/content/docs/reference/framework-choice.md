---
title: Why this framework
description: The research and ranked reasoning behind choosing Astro Starlight.
---

This site runs on **Astro Starlight**. Here's the reasoning, so a future
maintainer (human or LLM) knows why — and when to revisit it.

## Requirements it had to meet

- Free and open-source
- Modern, attractive output with minimal custom CSS
- Bulletproof mobile responsiveness out of the box
- Purpose-built for interactive docs (code blocks, callouts, tabs, search…)
- Lightweight interactive components — **not** a full SPA framework
- Easy for LLMs to build and maintain: simple, predictable file structure;
  Markdown/MDX content; minimal magic
- Deploys to Vercel with zero / near-zero config
- Works with Vercel access control for team-only viewing
- Clean default light theme (dark mode a bonus)

## The shortlist

| Rank | Framework | Notes |
| --- | --- | --- |
| **1** | **Astro Starlight** | MIT, free. Static-first (matches this repo's no-build ethos), ships the **least JavaScript**, best out-of-box mobile + clean light/dark theme, built-in Pagefind search, MDX with callouts/tabs/cards/steps. Astro "islands" give lightweight interactivity **without** a SPA runtime. Markdown-in-folders is trivial for an LLM to extend. Zero-config static deploy on Vercel. **Best overall fit.** |
| 2 | Nextra v4 | Free, OSS, Vercel-native, battle-tested theme, MDX. But it's **Next.js — a React app runtime**, which the "not a full SPA framework" requirement disfavors. Versioning is weaker than Docusaurus. |
| 3 | Fumadocs | Free, OSS, gorgeous and the most flexible. Also Next.js; more moving parts (`fumadocs-core` / `-ui` / `-mdx`) means more abstraction for an LLM to track. Great if docs lived **inside** a Next.js product — they don't here. |
| 4 | VitePress | Free, OSS, very fast, clean defaults. But custom interactivity means **writing Vue**, and this isn't a Vue shop. |
| — | Docusaurus | Mature, best-in-class versioning, big plugin ecosystem — but heavier and more config/"magic" than needed here. |
| ✗ | Mintlify | **Cut.** Not fully open-source (hosted SaaS; self-hosting is Enterprise-only) and not designed to deploy as your own site on Vercel. Fails "free & open-source" + "deploy to Vercel." |

## Why Starlight won

- **Matches the repo's DNA.** This was a deliberately no-build static site.
  Starlight is static-first and ships almost no JS, so the spirit is intact
  while gaining search, theming, and structure.
- **LLM-friendly.** Content is just Markdown/MDX files in `src/content/docs/`.
  Adding a page is "create a file, add one sidebar line." Almost no hidden
  state.
- **Interactivity without a SPA.** Astro islands hydrate single components on an
  otherwise static page — exactly the "lightweight components, not a full SPA"
  brief.
- **Mobile + visuals for free.** The default theme is responsive, accessible,
  and clean in light mode (with a dark toggle as a bonus) — minimal custom CSS.
- **Zero-config Vercel.** Vercel auto-detects Astro and builds to static output.

## Tradeoffs we accepted

- It introduces a **build step** to a previously build-free repo. Worth it for
  search + structure; the cost is one `npm install` and a Vercel build.
- The **bespoke HTML artifacts were not converted to MDX** — that would be
  lossy for interactive mockups. They live in `public/` and are served
  verbatim. See [Add content](/guides/adding-content/).

## When to revisit

If this repo ever becomes mostly bespoke interactive HTML again (and the docs
layer goes unused), a plain static host with no build would be simpler. If it
grows into versioned product documentation, re-evaluate Docusaurus for its
versioning.
