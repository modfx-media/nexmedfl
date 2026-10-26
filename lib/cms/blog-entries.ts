import type { BlogPostEntry } from "@/lib/posts";

import { cmsDocToBlogEntry } from "./map-post";
import { listCmsDocs } from "./queries";

/** Published (or draft-mode) CMS posts mapped onto the designed blog entry shape. */
export async function listCmsBlogEntries(): Promise<BlogPostEntry[]> {
  const docs = await listCmsDocs("posts");
  return docs.flatMap((doc) => {
    const entry = cmsDocToBlogEntry(doc);
    return entry ? [entry] : [];
  });
}
