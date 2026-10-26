import { readFileSync } from "node:fs";

type Manifest = {
  urls: { path: string }[];
};

type ExportDoc = {
  version: number;
  records: { collection: string; path?: string }[];
  globals: unknown[];
};

const manifest = JSON.parse(readFileSync("migration-data/url-manifest.json", "utf8")) as Manifest;
const exported = JSON.parse(readFileSync("data/content-export.json", "utf8")) as ExportDoc;

if (exported.version !== 1) {
  console.error(`export version ${exported.version} is not 1`);
  process.exit(1);
}

const blogPaths = manifest.urls
  .map((url) => url.path)
  .filter((urlPath) => urlPath.startsWith("/blogs/") && urlPath !== "/blogs/");

const postPaths = new Set(
  exported.records.filter((record) => record.collection === "posts").map((record) => record.path),
);

const missing = blogPaths.filter((urlPath) => !postPaths.has(urlPath));
if (missing.length > 0) {
  console.error(`Export is missing ${missing.length} manifest blog URL(s):`);
  for (const urlPath of missing) console.error(`  ${urlPath}`);
  process.exit(1);
}

console.log(
  `Export covers all ${blogPaths.length} manifest blog URLs (${exported.records.length} records, ${exported.globals.length} globals).`,
);
