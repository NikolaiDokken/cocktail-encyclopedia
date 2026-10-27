import { and, asc, count, eq, exists, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
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
// wildcards in the query are escaped so "%" and "_" match literally, and
// accents are ignored on both sides ("creme" finds Crème de Cassis).
function matchesQuery(query: string) {
  const escaped = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  const pattern = sql`unaccent(${escaped})`;
  return or(
    sql`unaccent(${drinks.name}) ilike ${pattern}`,
    sql`exists (
      with recursive matched (id) as (
        select id from ${ingredients} where unaccent(name) ilike ${pattern}
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
            where unaccent(alias) ilike ${pattern}
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

export type RecipeLine = {
  name: string;
  amount: string;
  unit: string;
  optional: boolean;
};

// The drink's ingredients in recipe order, fetched in the same query.
// "drinks"."id" is written out because Drizzle leaves columns in a
// single-table select unqualified, which would be ambiguous here.
const recipe = sql<RecipeLine[]>`(
  select coalesce(
    json_agg(
      json_build_object(
        'name', i.name, 'amount', di.amount, 'unit', di.unit, 'optional', di.optional
      ) order by di.position
    ),
    '[]'::json
  )
  from ${drinkIngredient} di
  join ${ingredients} i on i.id = di.ingredient_id
  where di.drink_id = "drinks"."id"
)`;

const drinkColumns = {
  id: drinks.id,
  name: drinks.name,
  category: drinks.category,
  instructions: drinks.instructions,
  garnish: drinks.garnish,
  imageUrl: drinks.imageUrl,
  imageSourceUrl: drinks.imageSourceUrl,
  recipe,
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

// Everyone has water, so it never counts as missing and isn't offered in the
// bar.
const ALWAYS_IN_BAR = "Water";

export type BarIngredient = {
  id: string;
  name: string;
  parentId: string | null;
  // False for groups that only exist to hold sub-types (Whiskey, Bitters):
  // no recipe calls for them, so having one would make nothing possible.
  selectable: boolean;
};

// Every ingredient that can go in a bar, for picking what you have.
export async function fetchBarIngredients(): Promise<BarIngredient[]> {
  try {
    return await db
      .select({
        id: ingredients.id,
        name: ingredients.name,
        parentId: ingredients.parentId,
        // Written out because a bare "id" would mean drink_ingredient.id.
        selectable: sql<boolean>`exists (
          select 1 from ${drinkIngredient} di
          where di.ingredient_id = "ingredients"."id"
        )`,
      })
      .from(ingredients)
      .where(sql`${ingredients.name} <> ${ALWAYS_IN_BAR}`)
      .orderBy(asc(ingredients.name));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch ingredients.");
  }
}

// Ids of every ingredient a bar can stand in for: what's in it, everything
// those are a kind of (London Dry Gin covers recipes that ask for Gin, but not
// the other way round), and water. Uncorrelated, so Postgres runs it once.
// Never contains null, so it's safe with `not in`.
function coveredBy(bar: string[]) {
  return sql`(
    with recursive covered (id) as (
      select id from ${ingredients}
      where ${inArray(ingredients.id, bar)} or name = ${ALWAYS_IN_BAR}
      union
      select i.parent_id from ${ingredients} i
      join covered on covered.id = i.id
      where i.parent_id is not null
    )
    select id from covered
  )`;
}

// Drinks the bar can make, and drinks it's one ingredient short of. Optional
// lines don't count. `missing` names the required ingredients not covered.
export async function fetchBarDrinks(bar: string[], userId: string | null) {
  if (bar.length === 0) {
    return { canMake: [], oneAway: [] };
  }
  const missing = sql<string[]>`(
    select coalesce(json_agg(i.name order by di.position), '[]'::json)
    from ${drinkIngredient} di
    join ${ingredients} i on i.id = di.ingredient_id
    where di.drink_id = "drinks"."id"
      and not di.optional
      and di.ingredient_id not in ${coveredBy(bar)}
  )`;
  try {
    const rows = await db
      .select({ ...drinkColumns, liked: likedBy(userId), missing })
      .from(drinks)
      .where(sql`json_array_length(${missing}) <= 1`)
      .orderBy(asc(drinks.name));
    return {
      canMake: rows.filter((drink) => drink.missing.length === 0),
      oneAway: rows.filter((drink) => drink.missing.length === 1),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch drinks for your bar.");
  }
}

// One drink with its recipe, or null if the id doesn't exist.
export async function fetchDrink(id: string, userId: string | null) {
  if (!z.string().uuid().safeParse(id).success) {
    return null;
  }
  try {
    const [drink] = await db
      .select({ ...drinkColumns, liked: likedBy(userId) })
      .from(drinks)
      .where(eq(drinks.id, id));
    return drink ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch drink.");
  }
}

export type Drink = Awaited<ReturnType<typeof fetchFilteredDrinks>>[number];
