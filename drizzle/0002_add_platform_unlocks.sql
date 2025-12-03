CREATE TABLE "platform_unlocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"server_id" text NOT NULL,
	"ipv4_asn" text,
	"ipv4_location" text,
	"platforms" text NOT NULL,
	"raw_content" text,
	"test_time" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "platform_unlocks_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE no action ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX "idx_platform_unlocks_server_id" ON "platform_unlocks" ("server_id");
--> statement-breakpoint
CREATE INDEX "idx_platform_unlocks_created_at" ON "platform_unlocks" ("created_at");
