-- Baseline: the schema as it existed before migrations were introduced.
-- Existing databases already have these tables, so this only creates them on
-- a fresh database (e.g. a new Neon branch created empty).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--> statement-breakpoint
DO $$
BEGIN
	IF to_regclass('public.drinks') IS NULL THEN
		CREATE TABLE "customers" (
			"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
			"name" varchar(255) NOT NULL,
			"email" varchar(255) NOT NULL,
			"image_url" varchar(255) NOT NULL
		);

		CREATE TABLE "invoices" (
			"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
			"customer_id" uuid NOT NULL,
			"amount" integer NOT NULL,
			"status" varchar(255) NOT NULL,
			"date" date NOT NULL
		);

		CREATE TABLE "revenue" (
			"month" varchar(4) NOT NULL,
			"revenue" integer NOT NULL,
			CONSTRAINT "revenue_month_key" UNIQUE("month")
		);

		CREATE TABLE "ingredients" (
			"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
			"name" varchar(255) NOT NULL,
			CONSTRAINT "ingredients_name_key" UNIQUE("name")
		);

		CREATE TABLE "users" (
			"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
			"name" varchar(255) NOT NULL,
			"email" text NOT NULL,
			"password" text NOT NULL,
			CONSTRAINT "users_name_key" UNIQUE("name"),
			CONSTRAINT "users_email_key" UNIQUE("email"),
			CONSTRAINT "users_email_key1" UNIQUE("email")
		);

		CREATE TABLE "drink_ingredient" (
			"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
			"drink_id" uuid NOT NULL,
			"ingredient_id" uuid NOT NULL,
			"amount" varchar(50) NOT NULL,
			"unit" varchar(50) NOT NULL
		);

		CREATE TABLE "drinks" (
			"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
			"name" varchar(255) NOT NULL,
			"instructions" text,
			"image_url" varchar(2083)
		);

		CREATE TABLE "likes" (
			"user_id" uuid NOT NULL,
			"drink_id" uuid NOT NULL,
			"liked_at" timestamp DEFAULT now(),
			CONSTRAINT "likes_pkey" PRIMARY KEY("user_id","drink_id")
		);

		ALTER TABLE "drink_ingredient" ADD CONSTRAINT "drink_ingredient_drink_id_fkey" FOREIGN KEY ("drink_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;
		ALTER TABLE "drink_ingredient" ADD CONSTRAINT "drink_ingredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
		ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
		ALTER TABLE "likes" ADD CONSTRAINT "likes_drink_id_fkey" FOREIGN KEY ("drink_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
