---
title: Deploy
description: How this site builds and deploys to Vercel.
---

The site is an [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
project that builds to static files and deploys to Vercel.

## How it deploys

- **Production**: every push to `main` triggers a Vercel build and deploys to
  <https://bwai-share.vercel.app/>.
- **Previews**: every push to any other branch (and every PR) gets its own
  Vercel preview URL. Use this to review changes before they reach `main`.

Vercel auto-detects Astro and runs the build with **zero extra config**. The
settings are also pinned explicitly in `vercel.json`:

```json
{
  "framework": "astro",
  "buildCommand": "astro build",
  "outputDirectory": "dist"
}
```

## Local development

```bash
npm install        # once
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve the built dist/ locally
```

## What gets published

- Markdown/MDX under `src/content/docs/` → rendered doc pages.
- Everything under `public/` → copied to the site root verbatim (this is where
  the self-contained HTML artifacts live).

The build output (`dist/`) and Astro's cache (`.astro/`) are git-ignored —
never commit them.

## Vercel project facts

- **Org / repo**: `Brilliant-With-AI-Dev/bwai-share`
- **Vercel scope**: `alignmktgs-projects` · **Project**: `bwai-share`
- Link locally: `vercel link --project bwai-share --scope alignmktgs-projects`
- Manual prod deploy (rarely needed): `vercel deploy --prod`
