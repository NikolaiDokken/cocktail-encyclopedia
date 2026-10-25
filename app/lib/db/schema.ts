import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  foreignKey,
  index,
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

// users, sessions, accounts, verifications and rateLimits are managed by
// Better Auth (app/lib/auth.ts). Property names must match its field names.
export const users = pgTable(
  "users",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("users_email_key").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text().notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: uuid().defaultRandom().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const rateLimits = pgTable("rate_limits", {
  id: uuid().defaultRandom().primaryKey(),
  key: text().notNull().unique(),
  count: integer().notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

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
