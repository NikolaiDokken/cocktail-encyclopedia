# Cocktail Encyclopedia

Search cocktails by name or ingredient, sign up, and save the drinks you like.

Built with Next.js (App Router), Better Auth (email and password) and Neon Postgres, deployed on Vercel.

## Local development

Requires Node 20.9+ and pnpm.

```bash
pnpm install
vercel env pull .env.local   # DATABASE_URL from the Neon integration, AUTH_SECRET
pnpm db:migrate              # create/update tables (drizzle/ migrations)
pnpm seed                    # load scripts/data/drinks.json (idempotent)
pnpm dev
```

## Database changes

The schema lives in `app/lib/db/schema.ts`. After changing it:

```bash
pnpm db:generate   # writes a new SQL migration to drizzle/
pnpm db:migrate    # applies pending migrations to the database in .env.local
```

Migrations are not run automatically on deploy: apply them to production
before merging code that depends on them.

## Environment variables

| Name           | Where it comes from                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Set automatically by the Neon integration on Vercel (`POSTGRES_URL` also works)                                                  |
| `AUTH_SECRET`  | Generate with `openssl rand -base64 32` and add it in the Vercel project settings. Better Auth also accepts `BETTER_AUTH_SECRET` |

The original Create React App version of this site is preserved under the `legacy-cra` tag.
