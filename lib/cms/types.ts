export type CmsMeta = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;
  excludeFromSitemap?: boolean | null;
};

export type CmsBodyBlock = {
  heading?: string | null;
  paragraphs?: { text?: string | null }[] | null;
  bullets?: { text?: string | null }[] | null;
};

export type CmsDoc = {
  id: number | string;
  title?: string | null;
  searchTitle?: string | null;
  slug?: string | null;
  path?: string | null;
  description?: string | null;
  section?: string | null;
  imagePath?: string | null;
  imageCaption?: string | null;
  imageWidth?: string | null;
  imageHeight?: string | null;
  image?: { url?: string | null; alt?: string | null } | number | string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  relatedServiceHref?: string | null;
  relatedServiceLabel?: string | null;
  body?: CmsBodyBlock[] | null;
  content?: unknown;
  meta?: CmsMeta | null;
  _status?: "draft" | "published" | null;
  updatedAt?: string | null;
};

export function normalizePublicPath(input: string): string {
  if (!input || input === "/") return "/";
  const withLead = input.startsWith("/") ? input : `/${input}`;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
}

export function hasLexicalContent(content: unknown): content is { root: { children?: unknown[] } } {
  if (!content || typeof content !== "object" || !("root" in content)) return false;
  const root = (content as { root?: { children?: unknown[] } }).root;
  return Array.isArray(root?.children) && root.children.length > 0;
}
