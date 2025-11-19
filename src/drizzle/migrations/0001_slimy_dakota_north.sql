ALTER TYPE "public"."user_role" ADD VALUE 'Dean_of_Science';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'Dean_of_Education';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'Dean_of_Business';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'Dean_of_Humanities_and_Developmental_Studies';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'Dean_of_TVET';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'Dean_of_Students';--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "school" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "created_by";