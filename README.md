# bwai-share

Shared artifacts and docs from Claude Code sessions, for review.

Live at **https://bwai-share.vercel.app/**

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build):
a static docs framework for the Markdown pages, with self-contained HTML
artifacts served verbatim alongside them.

> **Share / research surface, not production.** Anyone with the URL can read it.
> Do not paste secrets, customer data, or credentials. For team-only access, see
> [`reference/access-control`](https://bwai-share.vercel.app/reference/access-control/).

## Two kinds of content

| Type | Lives in | Example URL | Use for |
| --- | --- | --- | --- |
| **Markdown / MDX doc** | `src/content/docs/` | `/guides/deploying/` | Prose, guides, references, callouts, tabs |
| **Self-contained HTML artifact** | `public/<slug>/` | `/m2m-shapes/` | Bespoke interactive mockups, GUIs, tools |

Full instructions: [`guides/adding-content`](https://bwai-share.vercel.app/guides/adding-content/).

### Add a Markdown doc

1. Create `src/content/docs/<group>/<name>.md` with `title` + `description` frontmatter.
2. Add it to the `sidebar` in `astro.config.mjs`.
3. Commit and push → `/<group>/<name>/`.

### Add an HTML artifact

1. Create `public/<slug>/index.html` (plus any sibling assets).
2. Add a `<LinkCard>` to the **Artifacts** grid in `src/content/docs/index.mdx`.
3. Commit and push → `/<slug>/`.

Existing artifact URLs (`/m2m-shapes/`, `/repo-survey/`, …) are unchanged —
they're all under `public/`. Shared doc styles: `/assets/bwai-doc.css`.

## Local development

```bash
npm install        # once
npm run dev        # http://localhost:4321
npm run build      # static build into dist/
npm run preview    # serve the built site locally
```

## Deploy

- Push to `main` → Vercel builds and deploys to production.
- Push to any other branch / open a PR → Vercel preview URL.

Vercel auto-detects Astro; settings are also pinned in `vercel.json`. More:
[`guides/deploying`](https://bwai-share.vercel.app/guides/deploying/).

## Why this stack

See [`reference/framework-choice`](https://bwai-share.vercel.app/reference/framework-choice/)
for the ranked comparison (Starlight vs Nextra / Fumadocs / VitePress / Mintlify)
and the reasoning.
