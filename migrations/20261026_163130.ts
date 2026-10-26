import { sql } from '@payloadcms/db-vercel-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "search_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_search_title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "search_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_search_title";`)
}
