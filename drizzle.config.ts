import { defineConfig } from "drizzle-kit";

// Local commands read the connection string from .env.local (`vercel env pull`).
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: (process.env.DATABASE_URL ?? process.env.POSTGRES_URL)!,
  },
});
