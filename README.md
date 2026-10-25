# Cocktail Encyclopedia

Search cocktails by name or ingredient, sign up, and save the drinks you like.

Built with Next.js (App Router), Better Auth (email and password) and Neon Postgres, deployed on Vercel.

The database is the only source of truth for drinks and ingredients; there
are no seed files.

## Local development

Requires Node 20.9+ and pnpm. Local development uses a Neon branch, an
instant copy of the production database including its data.

1. In the Neon console, create a branch (e.g. `dev`) from `main`.
2. Create `.env.local`:

   ```bash
   DATABASE_URL=...             # connection string of the dev branch
   AUTH_SECRET=...              # any random string, e.g. openssl rand -base64 32
   PRODUCTION_DATABASE_URL=...  # only needed for pnpm db:migrate:prod
   ```

3. Run:

   ```bash
   pnpm install
   pnpm db:migrate   # apply any migrations the branch doesn't have yet
   pnpm dev
   ```

To start over with fresh data, reset the branch from `main` in the Neon
console.

Avoid `vercel env pull .env.local`: it overwrites the file and points
`POSTGRES_URL` at production.

## Database changes

The schema lives in `app/lib/db/schema.ts`. After changing it:

```bash
pnpm db:generate       # writes a new SQL migration to drizzle/
pnpm db:migrate        # applies it to the dev branch (DATABASE_URL)
pnpm db:migrate:prod   # applies it to production (PRODUCTION_DATABASE_URL)
```

Data fixes that every database needs also go in a migration
(`pnpm drizzle-kit generate --custom`). Migrations don't run on deploy:
apply them to production before pushing code that depends on them, and keep
them compatible with the code that is live at that moment.

## Environment variables

| Name                      | Used by                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`            | The app and drizzle-kit. On Vercel the Neon integration provides `POSTGRES_URL`, which the app falls back to                       |
| `PRODUCTION_DATABASE_URL` | Local only: `pnpm db:migrate:prod`                                                                                                 |
| `AUTH_SECRET`             | Better Auth (`BETTER_AUTH_SECRET` also works). Generate with `openssl rand -base64 32`; on Vercel it's set in the project settings |

The original Create React App version of this site is preserved under the `legacy-cra` tag.
