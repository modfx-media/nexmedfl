import { sql } from '@payloadcms/db-vercel-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-vercel-postgres'

// Neon's HTTP driver rejects multiple statements in one query.
async function executeStatements(
  db: MigrateUpArgs["db"],
  statements: readonly string[],
): Promise<void> {
  for (const statement of statements) {
    await db.execute(sql.raw(statement) as never)
  }
}

const upStatements = [
  "ALTER TABLE \"posts\" ADD COLUMN \"search_title\" varchar",
  "ALTER TABLE \"_posts_v\" ADD COLUMN \"version_search_title\" varchar",
] as const;

const downStatements = [
  "ALTER TABLE \"posts\" DROP COLUMN IF EXISTS \"search_title\"",
  "ALTER TABLE \"_posts_v\" DROP COLUMN IF EXISTS \"version_search_title\"",
] as const;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await executeStatements(db, upStatements)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await executeStatements(db, downStatements)
}
