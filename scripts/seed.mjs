// Loads scripts/data/drinks.json into the database. Run `pnpm db:migrate`
// first so the tables exist. Safe to run more than once: drinks that already
// exist are left untouched.
//
//   pnpm seed   (reads DATABASE_URL from .env.local)
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set. Run `vercel env pull .env.local` first.",
  );
  process.exit(1);
}
const sql = neon(url);

const drinks = JSON.parse(
  await readFile(new URL("./data/drinks.json", import.meta.url), "utf8"),
);

async function ingredientId(name) {
  await sql`
    INSERT INTO ingredients (name)
    SELECT ${name}
    WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE name = ${name});
  `;
  const [row] =
    await sql`SELECT id FROM ingredients WHERE name = ${name} LIMIT 1;`;
  return row.id;
}

async function seedDrinks() {
  let inserted = 0;

  for (const drink of drinks) {
    const rows = await sql`
      INSERT INTO drinks (name, instructions)
      SELECT ${drink.name}, ${drink.method}
      WHERE NOT EXISTS (SELECT 1 FROM drinks WHERE name = ${drink.name})
      RETURNING id;
    `;
    if (rows.length === 0) continue; // already seeded

    const drinkId = rows[0].id;
    for (const ingredient of drink.ingredients) {
      const id = await ingredientId(ingredient.ingredient);
      await sql`
        INSERT INTO drink_ingredient (drink_id, ingredient_id, amount, unit)
        VALUES (${drinkId}, ${id}, ${ingredient.quantity}, ${ingredient.unit});
      `;
    }
    inserted++;
  }

  return inserted;
}

const inserted = await seedDrinks();
console.log(`Seeded ${inserted} new drinks (${drinks.length} in data file).`);
