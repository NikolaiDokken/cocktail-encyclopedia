import { sql } from "@vercel/postgres";
import { DrinksTableType } from "../definitions";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredDrinks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const drinks = await sql<DrinksTableType>`
      SELECT DISTINCT
        drinks.id,
        drinks.name,
        drinks.instructions,
        drinks.image_url
      FROM drinks
      JOIN drink_ingredient ON drinks.id = drink_ingredient.drink_id
      JOIN ingredients ON drink_ingredient.ingredient_id = ingredients.id
      WHERE
        drinks.name ILIKE ${`%${query}%`} OR
        ingredients.name ILIKE ${`%${query}%`}
      ORDER BY drinks.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return drinks.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch drinks.");
  }
}

export async function fetchDrinksPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(DISTINCT drinks.id) as count
    FROM drinks
    JOIN drink_ingredient ON drinks.id = drink_ingredient.drink_id
    JOIN ingredients ON drink_ingredient.ingredient_id = ingredients.id
    WHERE
      drinks.name ILIKE ${`%${query}%`} OR
      ingredients.name ILIKE ${`%${query}%`};
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}
