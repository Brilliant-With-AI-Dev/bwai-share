# bwai-share — repository policy

`bwai-share` is a shared, public, production repository. Its static site is
published at https://bwai-share.vercel.app/.

## Identity and account routing

- Use an identified bot account for agent-authored commits, pull requests,
  reviews, comments, and other public repository activity. Never impersonate a
  human author. Any agent-authored message not posted by an obviously identified
  bot must disclose that it is agent-authored and unreviewed.
- Use configured administrator credentials only for repository settings the bot
  cannot manage. Do not use them for authored commits or public messages.
- GitHub organization: `Brilliant-With-AI-Dev`. Repository:
  https://github.com/Brilliant-With-AI-Dev/bwai-share.
- Vercel scope: `alignmktgs-projects`. Project: `bwai-share`.
  Link with `vercel link --project bwai-share --scope alignmktgs-projects`.

## Change workflow

- Never commit or push directly to `main`.
- Create a focused branch and open a pull request for every change.
- Require passing CI and required reviews/checks before merge.
- Keep `main` protected with server-side branch protection. Do not bypass,
  weaken, or work around protection rules.
- Do not merge a pull request without explicit authorization when the acting
  agent is responsible for the merge.

## Production deployments

Updates to `main` may automatically deploy the public production site. Treat a
merge to `main`, `vercel deploy --prod`, and any other production promotion as a
production deployment. Obtain explicit user approval immediately before causing
one. Preview deployments are allowed when they do not affect production.

### Sharing deployment-dependent URLs in chat

**Portable rule — apply in every repo and project, not just this one.**

If a link only works after a deploy (Vercel `*.vercel.app`, preview URLs, etc.),
**do not paste the URL in chat until deploy is confirmed** for the commit that
contains the change. Adrian opens links immediately; an early URL shows the
**old** experience.

**Before deploy is confirmed:**

- Say what changed, commit SHA, and that Vercel on `main` must reach **Ready**
  (dashboard or `vercel ls --prod`). There is no GitHub Actions deploy workflow.
- Do **not** include clickable deployment URLs, “live:” links, or paste blocks
  meant for Slack with URLs — even with “after deploy” disclaimers unless Ready
  already succeeded.

**After deploy is confirmed** (Vercel **Ready** for the pushed commit):

- Share the URL once, with commit SHA or “deploy succeeded on `main`”.
- Still say plainly if only Vercel status was checked (no browser verify).

**If push failed, is pending, or you only committed locally:** no deployment URLs.

**If Adrian asks for the link before deploy finishes:** wait for confirmation, or
give repo path / route name only — not the public URL.

## Artifacts

See `README.md` for the artifact structure. Adding an artifact normally means
adding a directory containing `index.html` and linking it from the root
`index.html`; use the branch-and-PR workflow above.

## Copy work routing

Auto-run `copy-deliverable` for copy/HTML work. Repo plug-in: `copy-deliverable.repo.yaml`.
Silent quality loop by default; paste eval prompt for explicit Improvements + A/B.

Skill: `.agents/skills/copy-deliverable/SKILL.md` (run `bootstrapskills` to mirror from
`~/.claude/skills/`).
