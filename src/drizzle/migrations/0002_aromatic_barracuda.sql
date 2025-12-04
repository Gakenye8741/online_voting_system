ALTER TABLE "elections" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "elections" ADD COLUMN "updatedAt" timestamp DEFAULT now();