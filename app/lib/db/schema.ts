import { sql } from "drizzle-orm";
import {
  date,
  foreignKey,
  integer,
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
  (table) => [
    unique("users_name_key").on(table.name),
    unique("users_email_key").on(table.email),
    unique("users_email_key1").on(table.email),
  ],
);

export const drinks = pgTable("drinks", {
  id: uuid()
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  instructions: text(),
  imageUrl: varchar("image_url", { length: 2083 }),
});

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

// Left over from the Next.js dashboard tutorial; unused by the app.
export const customers = pgTable("customers", {
  id: uuid()
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid()
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  customerId: uuid("customer_id").notNull(),
  amount: integer().notNull(),
  status: varchar({ length: 255 }).notNull(),
  date: date().notNull(),
});

export const revenue = pgTable(
  "revenue",
  {
    month: varchar({ length: 4 }).notNull(),
    revenue: integer().notNull(),
  },
  (table) => [unique("revenue_month_key").on(table.month)],
);
