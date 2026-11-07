CREATE TABLE "changelogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"improvements" jsonb DEFAULT '[]'::jsonb,
	"fixes" jsonb DEFAULT '[]'::jsonb,
	"patches" jsonb DEFAULT '[]'::jsonb,
	"is_featured" boolean DEFAULT false NOT NULL,
	"youtube_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"feedback_id" integer NOT NULL,
	"content" text NOT NULL,
	"name" text,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"category" text DEFAULT 'OTHER' NOT NULL,
	"name" text,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmaps" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"category" text NOT NULL,
	"date" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback_comments" ADD CONSTRAINT "feedback_comments_feedback_id_feedbacks_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedbacks"("id") ON DELETE cascade ON UPDATE no action;