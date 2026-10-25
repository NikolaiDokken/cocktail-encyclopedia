import { sql } from "@/app/lib/db";
import type { Drink } from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 10;

// Matches drinks by name or by any of their ingredients. `liked` is relative
// to `userId` and is always false for anonymous visitors.
export async function fetchFilteredDrinks(
  query: string,
  currentPage: number,
  userId: string | null,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const pattern = `%${query}%`;

  try {
    return await sql<Drink>`
      SELECT
        drinks.id,
        drinks.name,
        drinks.instructions,
        drinks.image_url,
        EXISTS (
          SELECT 1 FROM likes
          WHERE likes.drink_id = drinks.id AND likes.user_id = ${userId}
        ) AS liked
      FROM drinks
      WHERE
        drinks.name ILIKE ${pattern} OR
        EXISTS (
          SELECT 1 FROM drink_ingredient
          JOIN ingredients ON drink_ingredient.ingredient_id = ingredients.id
          WHERE drink_ingredient.drink_id = drinks.id
            AND ingredients.name ILIKE ${pattern}
        )
      ORDER BY drinks.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch drinks.");
  }
}

export async function fetchDrinksPages(query: string) {
  const pattern = `%${query}%`;

  try {
    const [{ count }] = await sql<{ count: string }>`
      SELECT COUNT(*) AS count
      FROM drinks
      WHERE
        drinks.name ILIKE ${pattern} OR
        EXISTS (
          SELECT 1 FROM drink_ingredient
          JOIN ingredients ON drink_ingredient.ingredient_id = ingredients.id
          WHERE drink_ingredient.drink_id = drinks.id
            AND ingredients.name ILIKE ${pattern}
        );
    `;

    return Math.ceil(Number(count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of drinks.");
  }
}

export async function fetchLikedDrinks(userId: string) {
  try {
    return await sql<Drink>`
      SELECT
        drinks.id,
        drinks.name,
        drinks.instructions,
        drinks.image_url,
        TRUE AS liked
      FROM drinks
      JOIN likes ON likes.drink_id = drinks.id
      WHERE likes.user_id = ${userId}
      ORDER BY drinks.name ASC;
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch liked drinks.");
  }
}
