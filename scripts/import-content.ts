import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

// Push is never allowed from this script, even if the env file asks for it.
process.env.CMS_IMPORT = "1";
process.env.PAYLOAD_DB_PUSH = "false";

type ImportRecord = {
  collection: "categories" | "pages" | "posts";
  legacyId?: string | null;
  sourceUrl?: string | null;
  categorySlug?: string | null;
  slug?: string | null;
  [key: string]: unknown;
};

type GlobalRecord = {
  slug: "header" | "footer" | "site-settings";
  data: Record<string, unknown>;
};

type ImportFile = {
  version: number;
  records: ImportRecord[];
  globals: GlobalRecord[];
};

type ReportAction = "created" | "updated" | "skipped" | "failed";

type ReportRow = {
  collection: string;
  legacyId?: string | null;
  sourceUrl?: string | null;
  action: ReportAction;
  id?: number | string;
  error?: string;
};

type PayloadLike = {
  find: (args: Record<string, unknown>) => Promise<{ docs: Array<Record<string, unknown>> }>;
  findGlobal: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  create: (args: Record<string, unknown>) => Promise<{ id: number | string }>;
  update: (args: Record<string, unknown>) => Promise<{ id: number | string }>;
  updateGlobal: (args: Record<string, unknown>) => Promise<{ id?: number | string }>;
  db: { migrate: (args: { migrations: unknown }) => Promise<void> };
};

const ORDER = ["categories", "pages", "posts"] as const;
const SENSITIVE_ENV = /SECRET|TOKEN|PASSWORD|DATABASE_URL|POSTGRES_|KEY|DSN|URL/i;

function safeString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) {
    const code = "code" in value ? String((value as { code?: unknown }).code ?? "") : "";
    return `${value.name}: ${code} ${value.message}`.trim();
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "[unprintable]";
  }
}

function secretFragments(): string[] {
  const fragments: string[] = [];
  for (const [key, value] of Object.entries(process.env)) {
    if (!value || value.length < 8 || !SENSITIVE_ENV.test(key)) continue;
    fragments.push(value);
    try {
      const parsed = new URL(value);
      if (parsed.password) fragments.push(decodeURIComponent(parsed.password));
      if (parsed.username) fragments.push(decodeURIComponent(parsed.username));
      if (parsed.host) fragments.push(parsed.host);
      if (parsed.hostname.includes(".")) fragments.push(parsed.hostname);
    } catch {
      // Not a URL. The raw value is already included.
    }
  }
  return [...new Set(fragments.filter((fragment) => fragment.length >= 4))].sort(
    (a, b) => b.length - a.length,
  );
}

function redact(text: string): string {
  let out = text.replace(/\b(?:postgres|postgresql|mysql):\/\/\S+/gi, "[redacted-url]");
  out = out.replace(/\bhttps?:\/\/[^\s'"]+/gi, (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.username || parsed.password) return "[redacted-url]";
      if (
        parsed.hostname.includes("neon.tech") ||
        parsed.hostname.includes("vercel-storage") ||
        parsed.search.length > 0
      ) {
        return "[redacted-url]";
      }
      return url;
    } catch {
      return "[redacted-url]";
    }
  });
  for (const fragment of secretFragments()) {
    if (out.includes(fragment)) out = out.split(fragment).join("[redacted]");
  }
  return out;
}

const writeError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  writeError(args.map((arg) => redact(safeString(arg))).join(" "));
};

function errorText(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return redact(error);
  if (error instanceof Error) {
    const cause =
      "cause" in error && error.cause ? ` ${errorText(error.cause)}` : "";
    return redact(`${safeString(error)}${cause}`.trim());
  }
  return redact(safeString(error));
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

function norm(value: unknown): unknown {
  if (value == null || value === "") return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const time = Date.parse(value);
      if (!Number.isNaN(time)) return new Date(time).toISOString();
    }
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map(norm);
  if (typeof value === "object") {
    const source = value as Record<string, unknown>;
    const keys = Object.keys(source).filter(
      (key) => !["id", "createdAt", "updatedAt", "blockName"].includes(key),
    );
    if ("id" in source && keys.length === 0) return norm(source.id);
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      const next = norm(source[key]);
      if (next !== null) out[key] = next;
    }
    return out;
  }
  return null;
}

function sameValue(expected: unknown, actual: unknown): boolean {
  const left = norm(expected);
  const right = norm(actual);
  if (left === right) return true;
  if (left == null || right == null) return left == null && right == null;
  if (typeof left !== typeof right) return String(left) === String(right);
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => sameValue(item, right[index]));
  }
  if (typeof left === "object" && typeof right === "object") {
    const leftObj = left as Record<string, unknown>;
    const rightObj = right as Record<string, unknown>;
    return Object.keys(leftObj).every((key) => sameValue(leftObj[key], rightObj[key]));
  }
  return false;
}

function sameDoc(expected: Record<string, unknown>, actual: Record<string, unknown>): boolean {
  return Object.entries(expected).every(([key, value]) => {
    if (key === "_status") return (actual._status ?? "draft") === value;
    return sameValue(value, actual[key]);
  });
}

function isEmpty(value: unknown): boolean {
  const normalized = norm(value);
  if (normalized == null) return true;
  if (Array.isArray(normalized)) return normalized.length === 0;
  if (typeof normalized === "object") return Object.keys(normalized as object).length === 0;
  return false;
}

function hasImportedData(existing: Record<string, unknown>, data: Record<string, unknown>): boolean {
  return Object.entries(data).some(([key, value]) => {
    if (key === "_status") return false;
    if (isEmpty(value)) return false;
    return !isEmpty(existing[key]);
  });
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

async function findExisting(payload: PayloadLike, record: ImportRecord) {
  const draft = record.collection === "pages" || record.collection === "posts";
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

  if (record.sourceUrl && draft) {
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

function writeReport(report: Record<string, unknown>) {
  const reportPath = path.resolve("migration-data/import-report.json");
  mkdirSync(path.dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return reportPath;
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const apply = args.includes("--apply") || process.env.CMS_IMPORT_APPLY === "1";
  const publish = process.env.CMS_IMPORT_PUBLISH === "1";
  const unknown = args.filter((arg) => arg !== "--apply");
  if (unknown.length > 0) {
    console.error(`Unexpected args: ${unknown.join(" ")}`);
    process.exit(1);
  }

  const input = JSON.parse(readFileSync("data/content-export.json", "utf8")) as ImportFile;
  if (input.version !== 1) {
    throw new Error(`Unsupported export version ${input.version}`);
  }

  const { getPayload } = await import("payload");
  const { default: config } = await import("@payload-config");
  const payload = (await withRetry(() => getPayload({ config }))) as unknown as PayloadLike;

  if (apply) {
    const migrations = (payload.db as { prodMigrations?: unknown }).prodMigrations;
    await withRetry(() => payload.db.migrate({ migrations }));
  }

  const rows: ReportRow[] = [];
  const categoryIds = new Map<string, number | string>();
  const status = publish ? "published" : "draft";

  const records = [...input.records].sort(
    (a, b) => ORDER.indexOf(a.collection) - ORDER.indexOf(b.collection),
  );

  for (const record of records) {
    try {
      let categoryId: number | string | undefined;
      if (record.collection === "posts" && record.categorySlug) {
        categoryId = categoryIds.get(String(record.categorySlug));
      }

      const data = payloadData(record, categoryId);
      const draftable = record.collection === "pages" || record.collection === "posts";
      if (draftable) data._status = status;
      const draft = draftable && !publish;
      const existing = await withRetry(() => findExisting(payload, record));

      if (existing && sameDoc(data, existing)) {
        if (record.collection === "categories" && typeof record.slug === "string") {
          categoryIds.set(record.slug, existing.id as number | string);
        }
        rows.push({
          action: "skipped",
          collection: record.collection,
          id: existing.id as number | string,
          legacyId: record.legacyId,
          sourceUrl: record.sourceUrl,
        });
        continue;
      }

      if (!apply) {
        rows.push({
          action: existing ? "updated" : "created",
          collection: record.collection,
          id: existing?.id as number | string | undefined,
          legacyId: record.legacyId,
          sourceUrl: record.sourceUrl,
        });
        if (record.collection === "categories" && typeof record.slug === "string" && existing?.id != null) {
          categoryIds.set(record.slug, existing.id as number | string);
        }
        continue;
      }

      const saved = existing
        ? await withRetry(() =>
            payload.update({
              collection: record.collection,
              id: existing.id,
              data,
              draft,
              overrideAccess: true,
            }),
          )
        : await withRetry(() =>
            payload.create({
              collection: record.collection,
              data,
              draft,
              overrideAccess: true,
            }),
          );

      if (record.collection === "categories" && typeof record.slug === "string") {
        categoryIds.set(record.slug, saved.id);
      }
      rows.push({
        action: existing && hasImportedData(existing, data) ? "updated" : "created",
        collection: record.collection,
        id: saved.id,
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
      const data = {
        ...global.data,
        _status: status,
      };
      const draft = !publish;
      let existing: Record<string, unknown> | null = null;
      try {
        existing = await withRetry(() =>
          payload.findGlobal({
            slug: global.slug,
            depth: 0,
            draft: true,
            overrideAccess: true,
          }),
        );
      } catch {
        existing = null;
      }

      const populated = existing ? hasImportedData(existing, data) : false;
      if (existing && populated && sameDoc(data, existing)) {
        rows.push({
          action: "skipped",
          collection: global.slug,
          id: existing.id as number | string | undefined,
          legacyId: `global:${global.slug}`,
        });
        continue;
      }

      if (!apply) {
        rows.push({
          action: populated ? "updated" : "created",
          collection: global.slug,
          legacyId: `global:${global.slug}`,
        });
        continue;
      }

      const saved = await withRetry(() =>
        payload.updateGlobal({
          slug: global.slug,
          data,
          draft,
          overrideAccess: true,
        }),
      );
      rows.push({
        action: populated ? "updated" : "created",
        collection: global.slug,
        id: saved.id,
        legacyId: `global:${global.slug}`,
      });
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
    dryRun: !apply,
    publish,
    push: false,
    created: rows.filter((row) => row.action === "created").length,
    updated: rows.filter((row) => row.action === "updated").length,
    skipped: rows.filter((row) => row.action === "skipped").length,
    failed: rows.filter((row) => row.action === "failed").length,
    records: rows,
  };
  const reportPath = writeReport(report);
  console.log(
    `Import dryRun=${report.dryRun} publish=${report.publish} created=${report.created} updated=${report.updated} skipped=${report.skipped} failed=${report.failed}. Report: ${reportPath}`,
  );
  if (report.failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(errorText(error));
  process.exit(1);
});
