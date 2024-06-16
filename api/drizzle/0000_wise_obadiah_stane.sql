CREATE TABLE IF NOT EXISTS "claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"requested_job_id" text,
	"proof_drop_id" integer,
	"user_id" integer,
	"token_id" text,
	"created_at" timestamp DEFAULT now(),
	"status" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proof_drops" (
	"proof_drop_id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"contract_address" text,
	"selector" text,
	"block_number" integer,
	"owner_id" integer,
	"slot" integer,
	"origin_chain_id" integer,
	"destination_chain_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "claims" ADD CONSTRAINT "claims_proof_drop_id_proof_drops_proof_drop_id_fk" FOREIGN KEY ("proof_drop_id") REFERENCES "public"."proof_drops"("proof_drop_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "proof_drops" ADD CONSTRAINT "proof_drops_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
