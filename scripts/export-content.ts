import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { BLOG_POSTS } from "../lib/posts";
import { STATIC_PAGES } from "../lib/pages";
import {
  BUSINESS,
  FOOTER_CONDITIONS,
  FOOTER_CTA,
  FOOTER_LEGAL,
  FOOTER_SERVICES,
  FOOTER_TAGLINE,
  MAIN_NAV,
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
} from "../lib/site-config";

const ORIGIN = "https://ormondspinenervecenter.com";

function slugFromPath(urlPath: string): string {
  if (urlPath === "/") return "home";
  return urlPath.replace(/^\/|\/$/g, "").replace(/\//g, "-");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = new Map<string, { collection: "categories"; legacyId: string; slug: string; name: string }>();

for (const post of BLOG_POSTS) {
  const name = post.section || "Medical Care";
  const slug = slugify(name) || "medical-care";
  categories.set(slug, {
    collection: "categories",
    legacyId: `category:${slug}`,
    name,
    slug,
  });
}

const pages = STATIC_PAGES.map((page) => {
  const sourceUrl = `${ORIGIN}${page.path === "/" ? "/" : page.path}`;
  return {
    collection: "pages" as const,
    legacyId: `page:${page.path}`,
    sourceUrl,
    slug: slugFromPath(page.path),
    path: page.path,
    title: page.title,
    description: page.description,
    imagePath: page.image ?? null,
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    meta: {
      title: page.title,
      description: page.description,
      canonicalUrl: sourceUrl,
    },
  };
});

const posts = BLOG_POSTS.map((post) => {
  const urlPath = `/blogs/${post.slug}/`;
  const sourceUrl = `${ORIGIN}${urlPath}`;
  const section = post.section || "Medical Care";
  return {
    collection: "posts" as const,
    legacyId: `post:${post.slug}`,
    sourceUrl,
    slug: post.slug,
    path: urlPath,
    title: post.title,
    searchTitle: post.metaTitle ?? post.title,
    description: post.description,
    section,
    categorySlug: slugify(section) || "medical-care",
    imagePath: post.image ?? null,
    imageCaption: post.imageCaption ?? null,
    imageWidth: post.imageWidth ?? null,
    imageHeight: post.imageHeight ?? null,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    relatedServiceHref: post.relatedServiceHref ?? null,
    relatedServiceLabel: post.relatedServiceLabel ?? null,
    body: (post.body ?? []).map((block) => ({
      heading: block.heading ?? null,
      paragraphs: (block.paragraphs ?? [])
        .filter((text) => text.trim())
        .map((text) => ({ text })),
      bullets: (block.bullets ?? [])
        .filter((text) => text.trim())
        .map((text) => ({ text })),
    })),
    meta: {
      title: post.metaTitle ?? post.title,
      description: post.description,
      canonicalUrl: sourceUrl,
    },
  };
});

const exportDoc = {
  version: 1 as const,
  records: [...categories.values(), ...pages, ...posts],
  globals: [
    {
      slug: "header" as const,
      data: {
        navItems: MAIN_NAV.map((item) => ({ label: item.label, href: item.href })),
      },
    },
    {
      slug: "footer" as const,
      data: {
        tagline: FOOTER_TAGLINE,
        ctaEyebrow: FOOTER_CTA.eyebrow,
        ctaHeading: FOOTER_CTA.heading,
        ctaBody: FOOTER_CTA.body,
        ctaButtonLabel: FOOTER_CTA.buttonLabel,
        ctaButtonHref: FOOTER_CTA.buttonHref,
        serviceLinks: FOOTER_SERVICES,
        conditionLinks: FOOTER_CONDITIONS,
        legalLinks: FOOTER_LEGAL,
      },
    },
    {
      slug: "site-settings" as const,
      data: {
        siteName: SITE_NAME,
        description: SITE_DEFAULT_DESCRIPTION,
        phone: BUSINESS.telephone,
        email: BUSINESS.email,
        address: BUSINESS.addressDisplay,
      },
    },
  ],
};

const outPath = path.resolve("data/content-export.json");
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(exportDoc, null, 2)}\n`);
console.log(
  `Wrote ${outPath} (${exportDoc.records.length} records, ${exportDoc.globals.length} globals)`,
);
