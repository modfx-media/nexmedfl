import { draftMode } from "next/headers";
import { cache } from "react";
import { getPayload } from "payload";

import config from "@payload-config";

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

async function findByPath(collection: "pages" | "posts", path: string): Promise<CmsDoc | null> {
  const payload = await getPayload({ config });
  const options = await readOptions();
  const normalized = normalizePublicPath(path);
  const result = await payload.find({
    collection,
    depth: 1,
    draft: options.draft,
    limit: 1,
    overrideAccess: options.overrideAccess,
    pagination: false,
    where: {
      path: {
        equals: normalized,
      },
    },
  });
  const doc = result.docs[0] as CmsDoc | undefined;
  if (!doc) return null;
  if (!options.draft && doc._status !== "published") return null;
  return doc;
}

export const getPageByPath = cache(async (path: string): Promise<CmsDoc | null> => {
  return withCMS(() => findByPath("pages", path), null);
});

export const getPostByPath = cache(async (path: string): Promise<CmsDoc | null> => {
  return withCMS(() => findByPath("posts", path), null);
});

export const listCmsDocs = cache(async (collection: "pages" | "posts"): Promise<CmsDoc[]> => {
  return withCMS(async () => {
    const payload = await getPayload({ config });
    const options = await readOptions();
    const result = await payload.find({
      collection,
      depth: 1,
      draft: options.draft,
      limit: 500,
      overrideAccess: options.overrideAccess,
      pagination: false,
      where: options.draft
        ? undefined
        : {
            _status: {
              equals: "published",
            },
          },
    });
    return (result.docs as CmsDoc[]).filter((doc) =>
      options.draft ? true : doc._status === "published",
    );
  }, []);
});
