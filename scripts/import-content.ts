import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { config as loadEnv } from "dotenv";
import { getPayload, type Payload } from "payload";

import config from "@payload-config";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

type ImportRecord = {
  collection: "categories" | "pages" | "posts";
  legacyId?: string | null;
  sourceUrl?: string | null;
  categorySlug?: string | null;
  [key: string]: unknown;
};

type ImportFile = {
  version: number;
  records: ImportRecord[];
  globals: { slug: "header" | "footer" | "site-settings"; data: Record<string, unknown> }[];
};

type ReportRow = {
  collection: string;
  legacyId?: string | null;
  sourceUrl?: string | null;
  action: "created" | "updated" | "failed";
  id?: number | string;
  error?: string;
};

const ORDER = ["categories", "pages", "posts"] as const;

function errorText(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
    const cause = "cause" in error ? errorText((error as { cause?: unknown }).cause) : "";
    return `${code} ${error.message} ${cause}`.trim();
  }
  return String(error);
}

function isTransient(error: unknown): boolean {
  return /ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|57P01|53300|08006|08001|08003|40001|40P01|connection terminated|server closed the connection|too many clients|timeout expired/i.test(
    errorText(error),
  );
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      last = error;
      if (!isTransient(error) || attempt === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 400 * 2 ** attempt));
    }
  }
  throw last;
}

function payloadData(record: ImportRecord, categoryId?: number | string) {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === "collection" || key === "categorySlug") continue;
    if (value === undefined) continue;
    data[key] = value;
  }
  if (categoryId != null) data.category = categoryId;
  return data;
}

function supportsDrafts(collection: ImportRecord["collection"]): boolean {
  return collection === "pages" || collection === "posts";
}

async function findExisting(payload: Payload, record: ImportRecord) {
  const draft = supportsDrafts(record.collection);
  if (record.legacyId) {
    const byLegacy = await payload.find({
      collection: record.collection,
      depth: 0,
      draft,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { legacyId: { equals: record.legacyId } },
    });
    if (byLegacy.docs[0]) return byLegacy.docs[0];
  }

  if (record.sourceUrl && supportsDrafts(record.collection)) {
    const byUrl = await payload.find({
      collection: record.collection,
      depth: 0,
      draft: true,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { sourceUrl: { equals: record.sourceUrl } },
    });
    if (byUrl.docs[0]) return byUrl.docs[0];
  }

  return null;
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  if (args.length > 0) {
    console.error(`Unexpected args: ${args.join(" ")}`);
    process.exit(1);
  }

  const input = JSON.parse(readFileSync("data/content-export.json", "utf8")) as ImportFile;
  if (input.version !== 1) {
    throw new Error(`Unsupported export version ${input.version}`);
  }

  const payload = await withRetry(() => getPayload({ config }));
  const writer = payload as unknown as {
    create: (args: {
      collection: ImportRecord["collection"];
      data: Record<string, unknown>;
      draft?: boolean;
      overrideAccess?: boolean;
    }) => Promise<{ id: number | string }>;
    update: (args: {
      collection: ImportRecord["collection"];
      id: number | string;
      data: Record<string, unknown>;
      draft?: boolean;
      overrideAccess?: boolean;
    }) => Promise<{ id: number | string }>;
  };
  const rows: ReportRow[] = [];
  const categoryIds = new Map<string, number | string>();

  const records = [...input.records].sort(
    (a, b) => ORDER.indexOf(a.collection) - ORDER.indexOf(b.collection),
  );

  for (const record of records) {
    try {
      let categoryId: number | string | undefined;
      if (record.collection === "posts" && record.categorySlug) {
        categoryId = categoryIds.get(record.categorySlug);
      }

      const data = payloadData(record, categoryId);
      const existing = await withRetry(() => findExisting(payload, record));

      const draft = supportsDrafts(record.collection);

      if (existing) {
        const updated = await withRetry(() =>
          writer.update({
            collection: record.collection,
            id: existing.id,
            data,
            draft,
            overrideAccess: true,
          }),
        );
        if (record.collection === "categories" && typeof record.slug === "string") {
          categoryIds.set(record.slug, updated.id);
        }
        rows.push({
          action: "updated",
          collection: record.collection,
          id: updated.id,
          legacyId: record.legacyId,
          sourceUrl: record.sourceUrl,
        });
        continue;
      }

      const created = await withRetry(() =>
        writer.create({
          collection: record.collection,
          data: draft ? { ...data, _status: "draft" } : data,
          draft,
          overrideAccess: true,
        }),
      );
      if (record.collection === "categories" && typeof record.slug === "string") {
        categoryIds.set(record.slug, created.id);
      }
      rows.push({
        action: "created",
        collection: record.collection,
        id: created.id,
        legacyId: record.legacyId,
        sourceUrl: record.sourceUrl,
      });
    } catch (error) {
      rows.push({
        action: "failed",
        collection: record.collection,
        error: errorText(error),
        legacyId: record.legacyId,
        sourceUrl: record.sourceUrl,
      });
    }
  }

  for (const global of input.globals) {
    try {
      await withRetry(() =>
        payload.updateGlobal({
          slug: global.slug,
          data: global.data,
          draft: true,
          overrideAccess: true,
        }),
      );
      rows.push({ action: "updated", collection: global.slug, legacyId: `global:${global.slug}` });
    } catch (error) {
      rows.push({
        action: "failed",
        collection: global.slug,
        error: errorText(error),
        legacyId: `global:${global.slug}`,
      });
    }
  }

  const report = {
    ranAt: new Date().toISOString(),
    created: rows.filter((row) => row.action === "created").length,
    updated: rows.filter((row) => row.action === "updated").length,
    failed: rows.filter((row) => row.action === "failed").length,
    records: rows,
  };

  const reportPath = path.resolve("migration-data/import-report.json");
  mkdirSync(path.dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `Import ${report.created} created, ${report.updated} updated, ${report.failed} failed. Report: ${reportPath}`,
  );
  if (report.failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(errorText(error));
  process.exit(1);
});
