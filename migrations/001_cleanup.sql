-- Remove legacy user table after migration to new auth system
DROP TABLE "users";

-- Remove old session tracking
ALTER TABLE "sessions" DROP COLUMN "legacy_token";
ALTER TABLE "sessions" DROP COLUMN "deprecated_flags";
