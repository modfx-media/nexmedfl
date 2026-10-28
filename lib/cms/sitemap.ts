import { listCmsDocs } from "./queries";
import { normalizePublicPath, type CmsDoc } from "./types";

export type CmsSitemapEntry = {
  path: string;
  lastmod: string;
};

function isExcluded(doc: CmsDoc): boolean {
  return Boolean(doc.meta?.noIndex || doc.meta?.excludeFromSitemap);
}

/** Published CMS paths that are safe to add to a sitemap. */
export async function getCmsSitemapEntries(
  collection: "pages" | "posts",
): Promise<CmsSitemapEntry[]> {
  const docs = await listCmsDocs(collection);
  const entries: CmsSitemapEntry[] = [];
  for (const doc of docs) {
    if (!doc.path || isExcluded(doc)) continue;
    entries.push({
      path: normalizePublicPath(doc.path),
      lastmod: doc.dateModified || doc.updatedAt || new Date().toISOString(),
    });
  }
  return entries;
}
