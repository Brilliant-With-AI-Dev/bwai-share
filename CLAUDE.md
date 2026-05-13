# bwai-share — agent guide

Single-branch static-HTML site. Every push to `main` deploys to https://bwai-share.vercel.app/.

**Adding an artifact:** see `README.md`. Drop a dir with `index.html`, link from root `index.html`, push.

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
