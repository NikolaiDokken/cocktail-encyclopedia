# Cocktail Encyclopedia

Search cocktails by name or ingredient, sign up, and save the drinks you like.

Built with Next.js (App Router), NextAuth (credentials login) and Neon Postgres, deployed on Vercel.

## Local development

Requires Node 20.9+ and pnpm.

```bash
pnpm install
vercel env pull .env.local   # DATABASE_URL from the Neon integration, AUTH_SECRET
pnpm seed                    # create tables and load app/lib/drink-data.json (idempotent)
pnpm dev
```

## Environment variables

| Name | Where it comes from |
| --- | --- |
| `DATABASE_URL` | Set automatically by the Neon integration on Vercel (`POSTGRES_URL` also works) |
| `AUTH_SECRET` | Generate with `npx auth secret` or `openssl rand -base64 32` and add it in the Vercel project settings |

The original Create React App version of this site is preserved under the `legacy-cra` tag.
