// Loads scripts/data/drinks.json into the database. Run `pnpm db:migrate`
// first so the tables exist. Safe to run more than once.
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
  await sql`INSERT INTO ingredients (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING;`;
  const [row] = await sql`SELECT id FROM ingredients WHERE name = ${name};`;
  return row.id;
}

// Inserts new drinks with their ingredients. Drinks that already exist only
// get their category and garnish refreshed.
async function seedDrinks() {
  let inserted = 0;

  for (const drink of drinks) {
    const [row] = await sql`
      INSERT INTO drinks (name, category, instructions, garnish)
      VALUES (${drink.name}, ${drink.category}, ${drink.method}, ${drink.garnish ?? null})
      ON CONFLICT (name) DO UPDATE
        SET category = EXCLUDED.category, garnish = EXCLUDED.garnish
      RETURNING id, (xmax = 0) AS inserted;
    `;
    if (!row.inserted) continue;

    for (const ingredient of drink.ingredients) {
      const id = await ingredientId(ingredient.ingredient);
      await sql`
        INSERT INTO drink_ingredient (drink_id, ingredient_id, amount, unit)
        VALUES (${row.id}, ${id}, ${ingredient.quantity}, ${ingredient.unit});
      `;
    }
    inserted++;
  }

  return inserted;
}

const inserted = await seedDrinks();
console.log(`Seeded ${inserted} new drinks (${drinks.length} in data file).`);
