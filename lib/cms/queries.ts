import { draftMode } from "next/headers";
import { cache } from "react";
import { getPayload } from "payload";

import config from "@payload-config";

import { isPublicPost, publishedByDateWhere } from "./publish-window";
import { withCMS } from "./safe";
import { normalizePublicPath, type CmsDoc } from "./types";

async function readOptions(): Promise<{ draft: boolean; overrideAccess: boolean }> {
  try {
    const { isEnabled } = await draftMode();
    if (isEnabled) return { draft: true, overrideAccess: true };
  } catch {
    // Static generation has no draft-mode request scope.
  }
  return { draft: false, overrideAccess: false };
}

export async function isCmsDraftMode(): Promise<boolean> {
  const options = await readOptions();
  return options.draft;
}

function postsDueWhere(now: Date) {
  return {
    and: [
      {
        _status: {
          equals: "published",
        },
      },
      publishedByDateWhere(now),
    ],
  };
}

async function findByPath(collection: "pages" | "posts", path: string): Promise<CmsDoc | null> {
  const payload = await getPayload({ config });
  const options = await readOptions();
  const normalized = normalizePublicPath(path);
  const now = new Date();
  const result = await payload.find({
    collection,
    depth: 1,
    draft: options.draft,
    limit: 1,
    overrideAccess: options.overrideAccess,
    pagination: false,
    where:
      options.draft || collection !== "posts"
        ? {
            path: {
              equals: normalized,
            },
          }
        : {
            and: [
              {
                path: {
                  equals: normalized,
                },
              },
              publishedByDateWhere(now),
            ],
          },
  });
  const doc = result.docs[0] as CmsDoc | undefined;
  if (!doc) return null;
  if (!options.draft && doc._status !== "published") return null;
  if (!options.draft && collection === "posts" && !isPublicPost(doc, { now })) return null;
  return doc;
}

export const getPageByPath = cache(async (path: string): Promise<CmsDoc | null> => {
  return withCMS(() => findByPath("pages", path), null);
});

export const getPostByPath = cache(async (path: string): Promise<CmsDoc | null> => {
  return withCMS(() => findByPath("posts", path), null);
});

export const listCmsDocs = cache(
  async (collection: "pages" | "posts", includeDrafts = true): Promise<CmsDoc[]> => {
    return withCMS(async () => {
      const payload = await getPayload({ config });
      const options = await readOptions();
      const draft = includeDrafts && options.draft;
      const now = new Date();
      const result = await payload.find({
        collection,
        depth: 1,
        draft,
        limit: 500,
        overrideAccess: draft,
        pagination: false,
        where: draft
          ? undefined
          : collection === "posts"
            ? postsDueWhere(now)
            : {
                _status: {
                  equals: "published",
                },
              },
      });
      return (result.docs as CmsDoc[]).filter((doc) => {
        if (draft) return true;
        if (doc._status !== "published") return false;
        if (collection === "posts" && !isPublicPost(doc, { now })) return false;
        return true;
      });
    }, []);
  },
);
