import { sql } from "@payloadcms/db-vercel-postgres";
import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-vercel-postgres";

// Neon's HTTP driver rejects multiple statements in one query.
async function executeStatements(
  db: MigrateUpArgs["db"],
  statements: readonly string[],
): Promise<void> {
  for (const statement of statements) {
    await db.execute(sql.raw(statement) as never);
  }
}

const upStatements = [
  `ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT ''`,
  `ALTER TABLE "media" ADD COLUMN "_objectkey" varchar`,
] as const;

const downStatements = [
  `ALTER TABLE "media" DROP COLUMN "prefix"`,
  `ALTER TABLE "media" DROP COLUMN "_objectkey"`,
] as const;

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await executeStatements(db, upStatements);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await executeStatements(db, downStatements);
}
