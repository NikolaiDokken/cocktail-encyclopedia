import { and, asc, count, eq, exists, ilike, or, sql } from "drizzle-orm";
import { db } from "@/app/lib/db";
import {
  drinkIngredient,
  drinks,
  ingredients,
  likes,
} from "@/app/lib/db/schema";
import type { Drink } from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 10;

// Drinks whose name or any ingredient contains the query. LIKE wildcards in
// the query are escaped so "%" and "_" match literally.
function matchesQuery(query: string) {
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  return or(
    ilike(drinks.name, pattern),
    exists(
      db
        .select({ one: sql`1` })
        .from(drinkIngredient)
        .innerJoin(
          ingredients,
          eq(drinkIngredient.ingredientId, ingredients.id),
        )
        .where(
          and(
            eq(drinkIngredient.drinkId, drinks.id),
            ilike(ingredients.name, pattern),
          ),
        ),
    ),
  );
}

// Always false for anonymous visitors.
function likedBy(userId: string | null) {
  if (!userId) {
    return sql<boolean>`false`;
  }
  return exists(
    db
      .select({ one: sql`1` })
      .from(likes)
      .where(and(eq(likes.drinkId, drinks.id), eq(likes.userId, userId))),
  ).mapWith(Boolean);
}

const drinkColumns = {
  id: drinks.id,
  name: drinks.name,
  category: drinks.category,
  instructions: drinks.instructions,
  garnish: drinks.garnish,
  imageUrl: drinks.imageUrl,
};

export async function fetchFilteredDrinks(
  query: string,
  currentPage: number,
  userId: string | null,
): Promise<Drink[]> {
  try {
    return await db
      .select({ ...drinkColumns, liked: likedBy(userId) })
      .from(drinks)
      .where(matchesQuery(query))
      .orderBy(asc(drinks.name))
      .limit(ITEMS_PER_PAGE)
      .offset((currentPage - 1) * ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch drinks.");
  }
}

export async function fetchDrinksPages(query: string) {
  try {
    const [{ total }] = await db
      .select({ total: count() })
      .from(drinks)
      .where(matchesQuery(query));

    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of drinks.");
  }
}

export async function fetchLikedDrinks(userId: string): Promise<Drink[]> {
  try {
    return await db
      .select({ ...drinkColumns, liked: sql<boolean>`true` })
      .from(drinks)
      .innerJoin(likes, eq(likes.drinkId, drinks.id))
      .where(eq(likes.userId, userId))
      .orderBy(asc(drinks.name));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch liked drinks.");
  }
}
