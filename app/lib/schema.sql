CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(255) NOT NULL CONSTRAINT "users_email_key" UNIQUE,
  "name" varchar(255),
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL,
  "type" varchar(50) DEFAULT 'next',
  "user_id" uuid,
  "chat_history" jsonb DEFAULT '[]',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" uuid,
  "name" varchar(255) NOT NULL,
  "path" varchar(500) NOT NULL,
  "content" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_files_path" ON "files" ("path");
CREATE INDEX IF NOT EXISTS "idx_files_project" ON "files" ("project_id");
CREATE INDEX IF NOT EXISTS "idx_projects_user" ON "projects" ("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "idx_files_project_path" ON "files" ("project_id", "path");

ALTER TABLE "files" DROP CONSTRAINT IF EXISTS "files_project_id_fkey";
ALTER TABLE "files" ADD CONSTRAINT "files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;

ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_user_id_fkey";
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
