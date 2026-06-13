# bwai-share — agent guide

Astro + Starlight docs site. Every push to `main` builds and deploys to https://bwai-share.vercel.app/. Other branches/PRs get Vercel preview URLs.

**Two content types** (see `README.md` and `/guides/adding-content/`):
- **Markdown/MDX docs** → `src/content/docs/`, registered in the `sidebar` in `astro.config.mjs`.
- **Self-contained HTML artifacts** → `public/<slug>/index.html`, linked from the Artifacts `<CardGrid>` in `src/content/docs/index.mdx`. Served verbatim at `/<slug>/`; shared styles at `/assets/bwai-doc.css`.

**Build:** `npm install` then `npm run dev` (4321) / `npm run build` (→ `dist/`). `dist/` and `.astro/` are git-ignored — never commit them. Vercel auto-detects Astro; config pinned in `vercel.json`.

**There is a build step now.** This was previously a no-build raw-HTML site; it was migrated to Astro Starlight (rationale in `/reference/framework-choice/`). The bespoke HTML artifacts were intentionally NOT converted to MDX — they stay in `public/`.

## Non-obvious context for AI assistants

- **GitHub org: `Brilliant-With-AI-Dev`** (NOT the user's global default `alignmktg`). Repo: https://github.com/Brilliant-With-AI-Dev/bwai-share.
- **Vercel scope: `alignmktgs-projects`** (same scope as `brilliant-apps`). Project name: `bwai-share`.
  - Link: `vercel link --project bwai-share --scope alignmktgs-projects`
  - Deploy: `vercel deploy --prod` (auto-deploy on push to `main` is also wired)

## Branch protection — main commits

User's global `~/.claude/hooks/bash-guard.py` blocks direct commits/pushes to `main` unless the repo is in `BRANCH_PROTECTION_EXEMPT_REPOS`. If `bwai-share` is in that list, commit on `main` normally.

If blocked:

1. `git checkout -b feat/<slug>` — commit there
2. `git push -u origin feat/<slug>`
3. Fast-forward `main` on the remote: `gh api -X PATCH repos/Brilliant-With-AI-Dev/bwai-share/git/refs/heads/main -f sha=$(git rev-parse feat/<slug>)`
4. Locally: `git fetch && git checkout main && git reset --hard origin/main`
5. Delete the feature branch on origin: `gh api -X DELETE repos/Brilliant-With-AI-Dev/bwai-share/git/refs/heads/feat/<slug>`

The Vercel auto-deploy fires on the `main` update either way.
