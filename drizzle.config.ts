import { defineConfig } from "drizzle-kit";

// Local commands read connection strings from .env.local.
try {
  process.loadEnvFile(".env.local");
} catch {}

// DATABASE_URL is the Neon dev branch. Production is only targeted on
// purpose, through `pnpm db:migrate:prod`.
const url =
  process.env.DRIZZLE_TARGET === "production"
    ? process.env.PRODUCTION_DATABASE_URL
    : process.env.DATABASE_URL;

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: url! },
});
