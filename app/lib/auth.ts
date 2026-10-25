import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/app/lib/db";
import {
  accounts,
  rateLimits,
  sessions,
  users,
  verifications,
} from "@/app/lib/db/schema";

// Hosts this app is served from. Vercel exposes the production domain and the
// current deployment's URLs; anything else is rejected.
const allowedHosts = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  "localhost:*",
].filter((host): host is string => Boolean(host));

function assertValidName(name: unknown) {
  if (name === undefined) return;
  if (typeof name !== "string" || !name.trim() || name.length > 255) {
    throw new APIError("BAD_REQUEST", {
      message: "Name must be between 1 and 255 characters.",
    });
  }
}

export const auth = betterAuth({
  appName: "Cocktail Encyclopedia",
  // The secret is read from BETTER_AUTH_SECRET or AUTH_SECRET.
  baseURL: { allowedHosts },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
      rateLimit: rateLimits,
    },
  }),
  advanced: {
    database: { generateId: "uuid" },
  },
  emailAndPassword: { enabled: true },
  databaseHooks: {
    user: {
      create: { before: async (user) => assertValidName(user.name) },
      update: { before: async (user) => assertValidName(user.name) },
    },
  },
  session: {
    // Avoids a database lookup on every request; sessions are re-checked
    // against the database every 5 minutes.
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: {
    // Enabled in production only (the default). Stored in the database
    // because serverless instances do not share memory.
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 5 * 60, max: 10 },
      "/sign-up/email": { window: 60 * 60, max: 5 },
    },
  },
  // Must be the last plugin: lets server actions set auth cookies.
  plugins: [nextCookies()],
});

// Deduplicated per request, so the layout and page can both call it.
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
