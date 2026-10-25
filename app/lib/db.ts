import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;

// The Neon integration on Vercel sets DATABASE_URL (and POSTGRES_URL for
// compatibility). The client is created lazily so `next build` works without
// a database connection string.
export async function sql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  if (!client) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set.");
    }
    client = neon(url);
  }
  return (await client(strings, ...values)) as T[];
}
