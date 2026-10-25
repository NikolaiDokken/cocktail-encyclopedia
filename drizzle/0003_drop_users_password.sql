-- Copy any password set by the old NextAuth code after 0002 ran, then drop
-- the legacy column. Apply only after the code without users.password is live.
INSERT INTO "accounts" ("user_id", "account_id", "provider_id", "password")
SELECT "id", "id"::text, 'credential', "password" FROM "users"
WHERE "password" IS NOT NULL
	AND NOT EXISTS (
		SELECT 1 FROM "accounts"
		WHERE "accounts"."user_id" = "users"."id" AND "accounts"."provider_id" = 'credential'
	);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";
