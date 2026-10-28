import type { BlogPostEntry } from "@/lib/posts";

import type { CmsDoc } from "./types";

function mediaUrl(image: CmsDoc["image"]): string | undefined {
  if (!image || typeof image === "number") return undefined;
  if (typeof image === "string") return image;
  return image.url || undefined;
}

function textList(items?: { text?: string | null }[] | null): string[] | undefined {
  const values = (items ?? [])
    .map((item) => item.text?.trim())
    .filter((item): item is string => Boolean(item));
  return values.length > 0 ? values : undefined;
}

export function cmsDocToBlogEntry(doc: CmsDoc): BlogPostEntry | null {
  if (!doc.slug || !doc.title) return null;
  const published = doc.datePublished || doc.updatedAt || new Date(0).toISOString();
  const modified = doc.dateModified || published;
  const day = published.slice(0, 10);
  const [year = "1970", month = "01", dayNum = "01"] = day.split("-");

  return {
    year,
    month,
    day: dayNum,
    slug: doc.slug,
    title: doc.title,
    metaTitle: doc.meta?.title || doc.searchTitle || undefined,
    description: doc.meta?.description || doc.description || "",
    image: doc.imagePath || mediaUrl(doc.image),
    imageWidth: doc.imageWidth || undefined,
    imageHeight: doc.imageHeight || undefined,
    imageCaption: doc.imageCaption || undefined,
    datePublished: published,
    dateModified: modified,
    section: doc.section || "Medical Care",
    body: (doc.body ?? []).map((block) => ({
      heading: block.heading || undefined,
      paragraphs: textList(block.paragraphs),
      bullets: textList(block.bullets),
    })),
    relatedServiceHref: doc.relatedServiceHref || undefined,
    relatedServiceLabel: doc.relatedServiceLabel || undefined,
  };
}
