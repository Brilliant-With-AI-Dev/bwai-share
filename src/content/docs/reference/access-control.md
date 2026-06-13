---
title: Access control
description: Locking the site down to team-only with Vercel — options, caveats, and how.
---

:::note[Current status: gated]
This site is **not public**. **Vercel Authentication** is turned on, so you must
be signed in to a Vercel account with access to the Brilliant-With-AI team to
view any page — both the Starlight docs and the static HTML artifacts.
:::

Vercel offers two ways to gate the site, both applied at the edge, so they work
identically for the Starlight pages and the static HTML artifacts (no code
changes needed). BWAI is on the **Vercel Pro** plan; here's what that means in
practice.

## The two options

| Method | What viewers do | Plan / cost | Best for |
| --- | --- | --- | --- |
| **Vercel Authentication** (Standard Protection) | Log in with a **Vercel account** that has access to the `alignmktgs-projects` team | **Included on Pro** (free, all plans) | A team that already has Vercel accounts |
| **Password Protection** | Enter **one shared password** | **Add-on** — *Advanced Deployment Protection*, **~$150/mo** on Pro (included on Enterprise) | Sharing with people who don't have Vercel accounts |

Both can protect **Preview and Production** deployments.

## What's in use

**Vercel Authentication is enabled** — the free option on Pro. Viewers sign in
with a Vercel account on the team; no add-on, no shared secret to manage. This
is the right default while everyone who needs access has (or can be invited to)
the team.

If you later need to share with people **outside** the team (reviewers,
contractors) without giving them team access, switch on **Password Protection**
— a single shared password — which requires the paid Advanced Deployment
Protection add-on.

:::caution[The shared-password caveat]
A shared password is **not** part of base Pro. Budget for the **Advanced
Deployment Protection add-on (~$150/mo, as of mid-2026 — confirm current
pricing)**. Vercel Authentication has no such cost.
:::

## How to enable

**Toggle protection — Dashboard:** Vercel → project `bwai-share` → **Settings →
Deployment Protection** → choose *Vercel Authentication* or *Password
Protection* and pick which deployments it applies to (Production, Preview, or
both).

**Grant someone access (with Vercel Authentication on):** invite them to the
Vercel team — Vercel → **Team Settings → Members → Invite**. Once they accept
and sign in, they can view the site. Removing them from the team revokes it.

**Password Protection via API** (only after the add-on is active):

```json
{
  "passwordProtection": {
    "deploymentType": "prod_deployment_urls_and_all_previews",
    "password": "your_password_here"
  }
}
```

## Caveats to remember

- **It's all-or-nothing per deployment.** You can't protect one artifact and
  leave another public — protection covers the whole deployment. Keep genuinely
  public things on a separate project if needed.
- **Automation/bots** that need to reach the site require a *Protection Bypass
  for Automation* secret.
- This is **deployment-level** gating, not per-user permissions. Treat it as a
  lightweight gate, not real authn/z. Still: never publish secrets or customer
  data here regardless.

Sources: [Vercel — Password Protection](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/password-protection),
[Vercel — Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication),
[Vercel — Deployment Protection on all plans](https://vercel.com/blog/protecting-deployments).
