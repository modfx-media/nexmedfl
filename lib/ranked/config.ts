import { SITE_URL } from "@/lib/site-config";

// Ranked site matching uses the same public origin as canonicals.
export const SITE_ORIGIN = SITE_URL;

export const DEFAULT_COVER = "/images/blog/default-cover.jpg";

export const DEFAULT_COVER_ALT = "Ormond Spine & Nerve Center blog article cover";

type CoverTopic = "spine" | "knee" | "nerve" | "recovery" | "accident" | "clinic";

type CoverAsset = {
  src: string;
  topic: CoverTopic;
  tags: readonly string[];
  /** Clinic portraits stay off treatment articles unless the title matches. */
  overflow?: boolean;
};

/**
 * Clinic photos tagged by topic + keywords. Local hand-written posts keep
 * the images already set on them; Ranked extras pick an unused relevant file
 * so the /blogs listing never repeats a cover or a mismatched treatment photo.
 */
const COVER_LIBRARY: readonly CoverAsset[] = [
  {
    src: "/images/blog/chiropractic-care-blog.jpg",
    topic: "spine",
    tags: ["chiropractic", "adjustment", "back pain", "spine"],
  },
  {
    src: "/images/chiropractic-care.jpg",
    topic: "spine",
    tags: ["chiropractic", "shoulder", "neck", "pt", "physical therapy"],
  },
  {
    src: "/images/blog/spinal-decompression-blog.jpg",
    topic: "spine",
    tags: ["spinal decompression", "herniated disc", "disc herniation", "disc"],
  },
  {
    src: "/images/spinal-decompression-therapy.jpg",
    topic: "spine",
    tags: ["non-surgical spine", "non surgical spine", "spine treatment", "herniated disc", "disc"],
  },
  {
    src: "/images/back-pain-featured.jpg",
    topic: "spine",
    tags: ["back pain", "sciatica", "leg pain", "neuromuscular"],
  },
  {
    src: "/images/blog/car-accident-blog.jpg",
    topic: "accident",
    tags: ["car accident", "whiplash", "auto accident"],
  },
  {
    src: "/images/car-accident-personal-injury-care.jpeg",
    topic: "accident",
    tags: ["car accident", "whiplash", "personal injury", "auto accident"],
  },
  {
    src: "/images/blog/knee-pain-blog.jpg",
    topic: "knee",
    tags: ["knee", "joint"],
  },
  {
    src: "/images/knee-decompression-therapy.jpg",
    topic: "knee",
    tags: ["knee decompression", "knee"],
  },
  {
    src: "/images/knee-decompression-therapy-v2.jpg",
    topic: "knee",
    tags: ["knee", "joint pain"],
  },
  {
    src: "/images/knee-pain-treatment.jpg",
    topic: "knee",
    tags: ["knee pain", "knee"],
  },
  {
    src: "/images/legacy/knee-pain-treatment-hero.jpeg",
    topic: "knee",
    tags: ["knee"],
  },
  {
    src: "/images/neuropathy-treatment.jpg",
    topic: "nerve",
    tags: ["neuropathy", "numbness", "tingling", "nerve pain", "nerve"],
  },
  {
    src: "/images/legacy/blog-neuropathy-specialist.jpg",
    topic: "nerve",
    tags: ["neuropathy", "specialist"],
  },
  {
    src: "/images/legacy/blog-burning-sensation.webp",
    topic: "nerve",
    tags: ["burning", "numbness", "tingling"],
  },
  {
    src: "/images/legacy/blog-neuropathy-reversed.jpeg",
    topic: "nerve",
    tags: ["neuropathy reversed", "neuropathy"],
  },
  {
    src: "/images/legacy/blog-medications-neuropathy.avif",
    topic: "nerve",
    tags: ["medication", "medications"],
  },
  {
    src: "/images/legacy/blog-neuropathy-supplement.avif",
    topic: "nerve",
    tags: ["supplement"],
  },
  {
    src: "/images/legacy/neuropathy-consultation.webp",
    topic: "nerve",
    tags: ["nerve", "consultation", "tingling", "numbness"],
  },
  {
    src: "/images/legacy/neuropathy-treatment-hero.jpg",
    topic: "nerve",
    tags: ["nerve pain", "nerve", "neuropathy"],
  },
  {
    src: "/images/blog/laser-therapy-blog.jpg",
    topic: "recovery",
    tags: ["laser"],
  },
  {
    src: "/images/laser-therapy.jpg",
    topic: "recovery",
    tags: ["laser", "inflammation", "healing"],
  },
  {
    src: "/images/blog/shockwave-therapy-blog.jpg",
    topic: "recovery",
    tags: ["shockwave"],
  },
  {
    src: "/images/shockwave-therapy.jpeg",
    topic: "recovery",
    tags: ["shockwave", "stubborn pain"],
  },
  {
    src: "/images/compression-therapy.jpg",
    topic: "recovery",
    tags: ["compression", "circulation", "recovery", "swelling"],
  },
  {
    src: "/images/legacy/contact-us-office.jpg",
    topic: "clinic",
    tags: ["functional medicine", "doctor", "clinic", "office"],
  },
  {
    src: "/images/legacy/meet-our-team-hero.avif",
    topic: "clinic",
    overflow: false,
    tags: ["doctor", "functional medicine", "team"],
  },
  {
    src: "/images/team/noah-herbert-dc-v2.png",
    topic: "clinic",
    overflow: false,
    tags: ["doctor", "chiropractic doctor"],
  },
  {
    src: "/images/legacy/reviews-family.avif",
    topic: "clinic",
    tags: ["holistic", "gut health", "wellness"],
  },
  {
    src: "/images/legacy/hero-background.jpg",
    topic: "clinic",
    tags: ["clinic", "holistic", "pain management"],
  },
  {
    src: "/images/legacy/testimonial-gallery-1.jpg",
    topic: "clinic",
    tags: ["pain management", "active", "holistic"],
  },
  {
    src: "/images/legacy/testimonial-gallery-2.jpg",
    topic: "clinic",
    tags: ["chronic pain", "rehabilitation"],
  },
  {
    src: "/images/legacy/testimonial-gallery-3.jpg",
    topic: "clinic",
    tags: ["brain fog", "fatigue"],
  },
  {
    src: "/images/legacy/testimonial-gallery-4.jpg",
    topic: "clinic",
    tags: ["functional medicine", "chronic pain"],
  },
];

function inferCoverTopics(text: string): CoverTopic[] {
  const hay = text.toLowerCase();
  const topics: CoverTopic[] = [];
  if (/neuropath|nerve|numb|tingl|burning/.test(hay)) topics.push("nerve");
  if (/\bknee\b|meniscus|osteo/.test(hay)) topics.push("knee");
  if (/shockwave|laser|compression|circulation/.test(hay)) topics.push("recovery");
  if (/car accident|whiplash|auto accident|personal injury/.test(hay)) {
    topics.push("accident");
  }
  if (
    /chiropract|spinal|spine|disc|sciatica|back pain|neck|shoulder|neuromuscular/.test(
      hay,
    )
  ) {
    topics.push("spine");
  }
  if (/functional medicine|brain fog|fatigue|gut health|holistic|doctor/.test(hay)) {
    topics.push("clinic");
  }
  if (topics.length === 0) topics.push("clinic");
  return topics;
}

function isEligibleCover(asset: CoverAsset, topics: CoverTopic[], score: number): boolean {
  if (score > 0) return true;
  if (asset.topic === "clinic" && asset.overflow !== false) return true;
  return topics.includes(asset.topic);
}

function normalizeCover(src: string): string {
  return src.trim().split("?")[0] ?? src;
}

function isGenericCover(src: string): boolean {
  const path = normalizeCover(src);
  return path === DEFAULT_COVER || path.includes("default-cover") || path.includes("og-default");
}

function isPersistedUniqueCover(src: string): boolean {
  const path = normalizeCover(src);
  return (
    path.includes("blob.vercel") ||
    path.startsWith("/images/blog/covers/") ||
    /^https?:\/\//.test(path)
  );
}

function hasTag(hay: string, tag: string): boolean {
  const needle = tag.toLowerCase();
  if (needle.includes(" ")) return hay.includes(needle);
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(hay);
}

function coverScore(asset: CoverAsset, text: string): number {
  const hay = text.toLowerCase();
  let score = 0;
  for (const tag of asset.tags) {
    if (hasTag(hay, tag)) {
      score += 10 + tag.length;
    }
  }
  return score;
}

function hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % 2147483647;
  }
  return hash;
}

function pickFrom(pool: readonly string[], key: string): string {
  return pool[hashKey(key) % pool.length] || DEFAULT_COVER;
}

function rankedCoverScore(asset: CoverAsset, text: string, topics: CoverTopic[]): number {
  const tags = coverScore(asset, text);
  if (!isEligibleCover(asset, topics, tags)) return Number.NEGATIVE_INFINITY;
  let score = tags;
  if (topics.includes(asset.topic)) score += 20;
  if (asset.topic === "clinic" && tags === 0) score += 1;
  return score;
}

function eligiblePool(text: string, used: Set<string>): CoverAsset[] {
  const topics = inferCoverTopics(text);
  const unused = COVER_LIBRARY.filter((asset) => !used.has(normalizeCover(asset.src)));
  const matching = unused.filter(
    (asset) => rankedCoverScore(asset, text, topics) > Number.NEGATIVE_INFINITY,
  );
  if (matching.length > 0) return matching;

  const scenes = unused.filter(
    (asset) => asset.topic === "clinic" && asset.overflow !== false,
  );
  if (scenes.length > 0) return scenes;

  const portraits = unused.filter((asset) => asset.topic === "clinic");
  if (portraits.length > 0) return portraits;

  return unused.filter(
    (asset) => asset.overflow !== false && topics.includes(asset.topic),
  );
}

function pickBestCover(text: string, used: Set<string>, key?: string): string {
  const topics = inferCoverTopics(text);
  const pool = eligiblePool(text, used);
  const choices = pool.length > 0 ? pool : [];
  if (choices.length === 0) return DEFAULT_COVER;

  let best = choices[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const asset of choices) {
    const score = rankedCoverScore(asset, text, topics);
    if (score > bestScore) {
      best = asset;
      bestScore = score;
    }
  }

  if (bestScore <= 0 && key) {
    return pickFrom(
      choices.map((asset) => asset.src),
      key,
    );
  }

  return best.src;
}

/** Deterministic clinic photo when Blob/AI cover is not ready yet. */
export function fallbackCover(title: string, slug?: string): string {
  return pickBestCover(title, new Set(), slug);
}

type Coverable = {
  title: string;
  slug: string;
  description?: string;
  image?: string;
};

/**
 * Guarantee one distinct cover per post. Reserved slugs (local hand-written
 * posts) keep their existing image. Ranked extras get the best unused
 * keyword match from COVER_LIBRARY.
 */
export function assignUniqueBlogCovers<T extends Coverable>(
  posts: T[],
  options?: { reservedSlugs?: Iterable<string> },
): T[] {
  const reservedSlugs = new Set(options?.reservedSlugs ?? []);
  const used = new Set<string>();
  const out = posts.map((post) => ({ ...post }));

  for (const post of out) {
    if (reservedSlugs.has(post.slug) && post.image && !isGenericCover(post.image)) {
      used.add(normalizeCover(post.image));
    }
  }

  const pending: number[] = [];
  for (let i = 0; i < out.length; i += 1) {
    const post = out[i];
    if (reservedSlugs.has(post.slug)) continue;

    const img = post.image?.trim();
    if (img && isPersistedUniqueCover(img) && !used.has(normalizeCover(img))) {
      used.add(normalizeCover(img));
      continue;
    }

    pending.push(i);
  }

  while (pending.length > 0) {
    let bestPending = 0;
    let bestAsset: CoverAsset | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestSlug = out[pending[0]]?.slug ?? "";

    for (let j = 0; j < pending.length; j += 1) {
      const post = out[pending[j]];
      const text = `${post.title} ${post.description ?? ""}`;
      const topics = inferCoverTopics(text);
      const pool = eligiblePool(text, used);
      for (const asset of pool) {
        const score = rankedCoverScore(asset, text, topics);
        if (score > bestScore || (score === bestScore && post.slug < bestSlug)) {
          bestScore = score;
          bestAsset = asset;
          bestPending = j;
          bestSlug = post.slug;
        }
      }
    }

    if (!bestAsset) {
      const leftover = out[pending[0]];
      const pool = eligiblePool(`${leftover.title} ${leftover.description ?? ""}`, used);
      const fallback =
        pool[0] ??
        COVER_LIBRARY.find((asset) => !used.has(normalizeCover(asset.src)));
      if (!fallback) break;
      leftover.image = fallback.src;
      used.add(normalizeCover(fallback.src));
      pending.splice(0, 1);
      continue;
    }

    const chosen = out[pending[bestPending]];
    chosen.image = bestAsset.src;
    used.add(normalizeCover(bestAsset.src));
    pending.splice(bestPending, 1);
  }

  const claimed = new Set<string>();
  for (const post of out) {
    const img = post.image ? normalizeCover(post.image) : "";
    if (img && !claimed.has(img)) {
      claimed.add(img);
      continue;
    }
    if (reservedSlugs.has(post.slug)) continue;
    const next = pickBestCover(
      `${post.title} ${post.description ?? ""}`,
      claimed,
      post.slug,
    );
    post.image = next;
    claimed.add(normalizeCover(next));
  }

  return out;
}

export const DEFAULT_CTA = {
  label: "Request an Appointment",
  href: "/appointment-request/",
};

/** Cover prompt for this brand. No patient faces / medical gore. */
export function coverPrompt(title: string): string {
  return [
    "Editorial photograph, 16:9 landscape, premium medical clinic photography.",
    "Modern chiropractic and spine-care clinic in coastal Florida, calm and professional.",
    `Theme inspired by: ${title.slice(0, 120)}.`,
    "Cinematic lighting, sharp, no grain, no watermark.",
    "No text, no letters, no logos, no captions, no readable signage.",
    "No patient faces, no medical gore, no graphic injuries.",
  ].join(" ");
}

/**
 * Slugs that already have a committed file at /images/blog/covers/{slug}.png
 * List only. Do not fs.stat public/ — that packs images into the cron bundle.
 */
export const COMMITTED_COVER_SLUGS: readonly string[] = [];
