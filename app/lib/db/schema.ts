import { sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Source of truth for the database schema. After changing it, run
// `pnpm db:generate` to create a migration and `pnpm db:migrate` to apply it.

export const users = pgTable(
  "users",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: text().notNull(),
    password: text().notNull(),
  },
  (table) => [unique("users_email_key").on(table.email)],
);

export const drinks = pgTable(
  "drinks",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    category: varchar({ length: 255 }),
    instructions: text(),
    garnish: text(),
    imageUrl: varchar("image_url", { length: 2083 }),
  },
  (table) => [unique("drinks_name_key").on(table.name)],
);

export const ingredients = pgTable(
  "ingredients",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [unique("ingredients_name_key").on(table.name)],
);

export const drinkIngredient = pgTable(
  "drink_ingredient",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    drinkId: uuid("drink_id").notNull(),
    ingredientId: uuid("ingredient_id").notNull(),
    amount: varchar({ length: 50 }).notNull(),
    unit: varchar({ length: 50 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.drinkId],
      foreignColumns: [drinks.id],
      name: "drink_ingredient_drink_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.ingredientId],
      foreignColumns: [ingredients.id],
      name: "drink_ingredient_ingredient_id_fkey",
    }).onDelete("cascade"),
    index("drink_ingredient_drink_id_idx").on(table.drinkId),
  ],
);

export const likes = pgTable(
  "likes",
  {
    userId: uuid("user_id").notNull(),
    drinkId: uuid("drink_id").notNull(),
    likedAt: timestamp("liked_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "likes_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.drinkId],
      foreignColumns: [drinks.id],
      name: "likes_drink_id_fkey",
    }).onDelete("cascade"),
    primaryKey({ columns: [table.userId, table.drinkId], name: "likes_pkey" }),
  ],
);
