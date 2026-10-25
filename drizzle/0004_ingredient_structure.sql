CREATE TABLE "ingredient_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"alias" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_name_key";--> statement-breakpoint
ALTER TABLE "drink_ingredient" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "drink_ingredient" ADD COLUMN "optional" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredients" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "ingredient_aliases" ADD CONSTRAINT "ingredient_aliases_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ingredient_aliases_alias_lower_key" ON "ingredient_aliases" USING btree (lower("alias"));--> statement-breakpoint
CREATE INDEX "ingredient_aliases_ingredient_id_idx" ON "ingredient_aliases" USING btree ("ingredient_id");--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_parent_id_ingredients_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "drink_ingredient_ingredient_id_idx" ON "drink_ingredient" USING btree ("ingredient_id");--> statement-breakpoint
CREATE INDEX "ingredients_parent_id_idx" ON "ingredients" USING btree ("parent_id");