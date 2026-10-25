import { and, asc, count, eq, exists, ilike, or, sql } from "drizzle-orm";
import { db } from "@/app/lib/db";
import {
  drinkIngredient,
  drinks,
  ingredientAliases,
  ingredients,
  likes,
} from "@/app/lib/db/schema";

const ITEMS_PER_PAGE = 10;

// Drinks whose name contains the query, or that use a matching ingredient.
// An ingredient matches by name, including its sub-types (searching "whiskey"
// finds Bourbon), or by alias. Aliases don't expand to sub-types, so the alias
// "Bourbon or Rye Whiskey" doesn't make "bourbon" match rye drinks. LIKE
// wildcards in the query are escaped so "%" and "_" match literally.
function matchesQuery(query: string) {
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  return or(
    ilike(drinks.name, pattern),
    sql`exists (
      with recursive matched (id) as (
        select id from ${ingredients} where name ilike ${pattern}
        union
        select child.id from ${ingredients} child
        join matched on child.parent_id = matched.id
      )
      select 1 from ${drinkIngredient} di
      where di.drink_id = ${drinks.id}
        and (
          di.ingredient_id in (select id from matched)
          or di.ingredient_id in (
            select ingredient_id from ${ingredientAliases}
            where alias ilike ${pattern}
          )
        )
    )`,
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
) {
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

export async function fetchLikedDrinks(userId: string) {
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

export type Drink = Awaited<ReturnType<typeof fetchFilteredDrinks>>[number];
