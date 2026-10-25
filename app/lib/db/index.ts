import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | undefined;

function connect(): Database {
  // The Neon integration on Vercel sets DATABASE_URL (and POSTGRES_URL for
  // compatibility).
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  return drizzle({ client: neon(url), schema });
}

// Connects on first use so `next build` works without a connection string.
export const db = new Proxy({} as Database, {
  get(_, property) {
    instance ??= connect();
    return Reflect.get(instance, property, instance);
  },
});
