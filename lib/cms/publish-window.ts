/**
 * Public posts use `datePublished` as the go-live instant.
 * A missing or unparseable value is already live. Draft preview skips the check.
 * `publishedByDateWhere` matches this rule for Payload queries (null dates stay included).
 */

export type DatedPost = {
  datePublished?: string | null;
};

export type PublicPostOptions = {
  draft?: boolean;
  now?: Date;
};

export function isPublicPost(post: DatedPost, options: PublicPostOptions = {}): boolean {
  if (options.draft) return true;
  const raw = post.datePublished;
  if (raw == null || raw === "") return true;
  const time = Date.parse(raw);
  if (Number.isNaN(time)) return true;
  const now = options.now ?? new Date();
  return time <= now.getTime();
}

export function selectPublicPosts<T extends DatedPost>(
  posts: readonly T[],
  options: PublicPostOptions = {},
): T[] {
  return posts.filter((post) => isPublicPost(post, options));
}

export function findPublicPost<T extends DatedPost & { slug: string }>(
  posts: readonly T[],
  slug: string,
  options: PublicPostOptions = {},
): T | undefined {
  return selectPublicPosts(posts, options).find((post) => post.slug === slug);
}

export function publicSitemapLocs(
  posts: readonly (DatedPost & { slug: string })[],
  options: PublicPostOptions & { origin: string },
): string[] {
  const origin = options.origin.replace(/\/$/, "");
  return selectPublicPosts(posts, options).map((post) => `${origin}/blogs/${post.slug}/`);
}

/** Payload `where` fragment: datePublished <= now, or no date set. */
export function publishedByDateWhere(now: Date = new Date()) {
  return {
    or: [
      { datePublished: { less_than_equal: now.toISOString() } },
      { datePublished: { exists: false } },
    ],
  };
}
