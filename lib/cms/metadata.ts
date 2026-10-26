import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

import { getPageByPath, getPostByPath } from "./queries";
import type { CmsDoc } from "./types";

function metadataFromDoc(path: string, doc: CmsDoc, type: "website" | "article"): Metadata {
  const title = doc.meta?.title || doc.searchTitle || doc.title || "";
  const description = doc.meta?.description || doc.description || "";
  const metadata = buildMetadata({
    path,
    title,
    description,
    image: doc.imagePath || undefined,
    type,
  });

  if (doc.meta?.canonicalUrl) {
    metadata.alternates = { canonical: doc.meta.canonicalUrl };
  }

  if (doc.meta?.noIndex || doc.meta?.noFollow) {
    metadata.robots = {
      index: !doc.meta?.noIndex,
      follow: !doc.meta?.noFollow,
    };
  }

  return metadata;
}

/** Published CMS meta wins. Otherwise the existing hardcoded metadata is returned unchanged. */
export async function resolvePageMetadata(path: string, fallback: Metadata): Promise<Metadata> {
  const doc = await getPageByPath(path);
  if (!doc) return fallback;
  return metadataFromDoc(path, doc, "website");
}

export async function resolvePostMetadata(path: string, fallback: Metadata): Promise<Metadata> {
  const doc = await getPostByPath(path);
  if (!doc) return fallback;
  return metadataFromDoc(path, doc, "article");
}
