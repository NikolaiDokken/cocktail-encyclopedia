DROP TABLE IF EXISTS "customers" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "invoices" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "revenue" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_name_key";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_key1";--> statement-breakpoint
ALTER TABLE "drinks" ADD COLUMN "category" varchar(255);--> statement-breakpoint
ALTER TABLE "drinks" ADD COLUMN "garnish" text;--> statement-breakpoint
CREATE INDEX "drink_ingredient_drink_id_idx" ON "drink_ingredient" USING btree ("drink_id");--> statement-breakpoint
ALTER TABLE "drinks" ADD CONSTRAINT "drinks_name_key" UNIQUE("name");