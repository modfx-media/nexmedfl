import type { ReactNode } from "react";

import { getPageByPath, getPostByPath } from "@/lib/cms/queries";

import { PublishedPage } from "./PublishedPage";
import { PublishedPost } from "./PublishedPost";

/**
 * Published Payload doc wins. Until then, the designed page renders unchanged.
 * Draft reads happen only while Next draft mode is enabled.
 */
export async function CMSRoute({
  path,
  kind = "page",
  children,
}: {
  path: string;
  kind?: "page" | "post";
  children: ReactNode;
}) {
  if (kind === "post") {
    const doc = await getPostByPath(path);
    if (!doc) return children;
    return <PublishedPost doc={doc} />;
  }

  const doc = await getPageByPath(path);
  if (!doc) return children;
  return <PublishedPage doc={doc} />;
}
