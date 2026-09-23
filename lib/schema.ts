import { BUSINESS, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "./site-config";
import {
  isFiveStarReview,
  type GoogleReview,
  type GoogleReviewsMeta,
} from "./reviews";

/**
 * Pure JSON-LD graph builder, replicates the exact Rank Math `@graph`
 * emitted on the live nexmedfl.com site (verified field-by-field via curl
 * against the homepage, a static page, and a blog post), with one
 * intentional enhancement: the LocalBusiness node now also includes
 * `address` and `telephone` (sourced from `BUSINESS` in site-config.ts).
 * The old site's Organization node omitted these, but they're standard,
 * recommended LocalBusiness fields for local SEO / rich results and don't
 * conflict with anything else scraped from the legacy site. Only include
 * an `ImageObject` node when the page has a featured image.
 *
 * No Node built-ins are used here, so this module is safe to import from
 * both Server and Client Components.
 */

export interface GraphInput {
  /** Path including leading and trailing slash, e.g. "/contact-us/" */
  path: string;
  title: string;
  description: string;
  image?: string;
  /** Defaults to "200"/"200" (the WordPress theme's fixed thumbnail size,
   *  used by every non-post page on the live site regardless of the
   *  actual source image's native dimensions). Blog posts pass the real
   *  values scraped from the live JSON-LD instead. */
  imageWidth?: string;
  imageHeight?: string;
  imageCaption?: string;
  datePublished?: string;
  dateModified?: string;
  /** "Article" for pages, "BlogPosting" for /YYYY/MM/DD/slug/ posts */
  articleType?: "Article" | "BlogPosting";
  /** article:section, blog posts only */
  section?: string;
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// The live site's Person node is the WordPress "developer" author account
// on every single page/post, it is not per-author data, so it's a fixed
// constant rather than something derived per page.
const PERSON_ID = `${SITE_URL}/author/developer/`;
const PERSON_NODE = {
  "@type": "Person" as const,
  "@id": PERSON_ID,
  name: "developer",
  url: PERSON_ID,
  image: {
    "@type": "ImageObject",
    "@id":
      "https://secure.gravatar.com/avatar/7eceadbfff0bcd04a129e895bfc0bc0120de2678295978e7ab443ac3927e6951?s=96&d=mm&r=g",
    url: "https://secure.gravatar.com/avatar/7eceadbfff0bcd04a129e895bfc0bc0120de2678295978e7ab443ac3927e6951?s=96&d=mm&r=g",
    caption: "developer",
    inLanguage: "en",
  },
  sameAs: [SITE_URL],
  worksFor: { "@id": ORGANIZATION_ID },
};

export function buildGraph(input: GraphInput) {
  const {
    path,
    title,
    description,
    image,
    imageWidth = "200",
    imageHeight = "200",
    imageCaption,
    datePublished,
    dateModified,
    articleType = "Article",
    section,
  } = input;

  const isHomePage = path === "/";
  const pageUrl = `${SITE_URL}${path}`;
  const webPageId = `${pageUrl}#webpage`;
  const richSnippetId = `${pageUrl}#richSnippet`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Organization"],
        "@id": ORGANIZATION_ID,
        name: BUSINESS.name,
        url: SITE_URL,
        telephone: BUSINESS.telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.address.streetAddress,
          addressLocality: BUSINESS.address.addressLocality,
          addressRegion: BUSINESS.address.addressRegion,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.addressCountry,
        },
        openingHours: BUSINESS.openingHours,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en",
        ...(isHomePage
          ? {
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?s={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }
          : {}),
      },
      ...(image
        ? [
            {
              "@type": "ImageObject",
              "@id": image,
              url: image,
              width: imageWidth,
              height: imageHeight,
              ...(imageCaption ? { caption: imageCaption } : {}),
              inLanguage: "en",
            },
          ]
        : []),
      {
        "@type": "WebPage",
        "@id": webPageId,
        url: pageUrl,
        name: title,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(isHomePage ? { about: { "@id": ORGANIZATION_ID } } : {}),
        isPartOf: { "@id": WEBSITE_ID },
        ...(image ? { primaryImageOfPage: { "@id": image } } : {}),
        inLanguage: "en",
      },
      PERSON_NODE,
      {
        "@type": articleType,
        headline: title,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(section ? { articleSection: section } : {}),
        author: { "@id": PERSON_ID, name: "developer" },
        publisher: { "@id": ORGANIZATION_ID },
        description,
        name: title,
        "@id": richSnippetId,
        isPartOf: { "@id": webPageId },
        ...(image ? { image: { "@id": image } } : {}),
        inLanguage: "en",
        mainEntityOfPage: { "@id": webPageId },
      },
    ],
  };
}

export interface MedicalProcedureInput {
  /** Path including leading and trailing slash, e.g. "/chiropractic-care/" */
  path: string;
  name: string;
  description: string;
  /** Body part(s) this procedure/therapy targets, e.g. "Spine" or "Knee". */
  bodyLocation?: string;
  /** schema.org MedicalProcedureType enumeration value (bare label is fine
   *, most of the clinic's equipment-driven offerings are non-invasive). */
  procedureType?: "NoninvasiveProcedure" | "PercutaneousProcedure";
}

/**
 * `MedicalProcedure` JSON-LD for the new equipment/program-driven service
 * pages. Emitted as an ADDITIONAL <script> tag alongside the standard
 * `buildGraph()` output (same pattern as the homepage's standalone
 * `MedicalBusiness` block), not a replacement for it.
 */
export function buildMedicalProcedureSchema({
  path,
  name,
  description,
  bodyLocation,
  procedureType = "NoninvasiveProcedure",
}: MedicalProcedureInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    description,
    url: `${SITE_URL}${path}`,
    procedureType: `https://schema.org/${procedureType}`,
    ...(bodyLocation ? { bodyLocation } : {}),
    provider: {
      "@type": "MedicalBusiness",
      "@id": ORGANIZATION_ID,
      name: BUSINESS.name,
    },
  };
}

export interface FAQInput {
  question: string;
  answer: string;
}

/**
 * `FAQPage` JSON-LD for service pages that include an on-page FAQ
 * section, emitted as an ADDITIONAL <script> tag alongside `buildGraph()`
 * and `buildMedicalProcedureSchema()`, same pattern as those.
 */
export function buildFAQSchema(faqs: FAQInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export interface MedicalWebPageInput {
  /** Path including leading and trailing slash, e.g. "/services/" */
  path: string;
  name: string;
  description: string;
  /** schema.org `MedicalSpecialty` enumeration value, e.g. "Physiotherapy". */
  medicalAudience?: string;
}

/**
 * `MedicalWebPage` JSON-LD for hub/overview pages (services & conditions
 * listings) that aren't a single procedure, emitted as an ADDITIONAL
 * <script> tag alongside `buildGraph()`, same pattern as
 * `buildMedicalProcedureSchema()` and `buildFAQSchema()`.
 */
export function buildMedicalWebPageSchema({
  path,
  name,
  description,
  medicalAudience = "Patient",
}: MedicalWebPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    lastReviewed: "2026-08-05",
    audience: {
      "@type": "MedicalAudience",
      audienceType: medicalAudience,
    },
    publisher: {
      "@type": "MedicalBusiness",
      "@id": ORGANIZATION_ID,
      name: BUSINESS.name,
    },
  };
}

export interface AggregateRatingInput {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

/**
 * `AggregateRating` JSON-LD, attached to the same `@id` as the main
 * Organization node emitted by `buildGraph()`, Google merges JSON-LD
 * nodes that share an `@id` across multiple <script> tags on a page, so
 * this doesn't need to duplicate the rest of the Organization fields.
 *
 * NOTE: `ratingValue`/`reviewCount` are PLACEHOLDER figures. Replace with
 * the real, current values from Google Business Profile (or your review
 * platform of record) before launch, do not leave estimated numbers in
 * production schema.
 */
export function buildAggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: AggregateRatingInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": ORGANIZATION_ID,
    name: BUSINESS.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating,
      worstRating,
    },
  };
}

/**
 * Live Google reviews schema: overall rating/count from Places, and
 * only the 5-star quotes that are actually rendered on the page.
 */
export function buildGoogleReviewsSchema(
  reviews: GoogleReview[],
  meta: GoogleReviewsMeta,
) {
  const visible = reviews.filter(isFiveStarReview);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": ORGANIZATION_ID,
    name: BUSINESS.name,
    ...(meta.rating > 0 && meta.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: meta.rating,
            reviewCount: meta.reviewCount,
            bestRating: "5",
          },
        }
      : {}),
    ...(visible.length > 0
      ? {
          review: visible.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody: review.quote,
          })),
        }
      : {}),
  };
}

export interface TeamMemberInput {
  name: string;
  jobTitle: string;
  description?: string;
}

/**
 * `Physician` JSON-LD nodes for the team page. Emitted as an ADDITIONAL
 * <script> tag alongside `buildGraph()`.
 *
 * NOTE: `name`/`jobTitle`/`description` below are PLACEHOLDER values, 
 * replace with each real provider's name and credentials before launch.
 */
export function buildTeamSchema(members: TeamMemberInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": members.map((member, i) => ({
      "@type": "Physician",
      "@id": `${SITE_URL}/meet-our-team/#member-${i + 1}`,
      name: member.name,
      jobTitle: member.jobTitle,
      ...(member.description ? { description: member.description } : {}),
      worksFor: { "@id": ORGANIZATION_ID },
    })),
  };
}

/**
 * `LocalBusiness` JSON-LD carrying full NAP (Name/Address/Phone) data,
 * merged into the same Organization `@id` emitted by `buildGraph()`.
 * Intended for the /contact-us/ page, every value is sourced from the
 * single `BUSINESS` config object (lib/site-config.ts) so the NAP here
 * always matches what's displayed on the page and site-wide.
 */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORGANIZATION_ID,
    name: BUSINESS.name,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    openingHours: BUSINESS.openingHours,
  };
}

/**
 * Standalone MedicalBusiness JSON-LD block, a SECOND, separate
 * <script type="application/ld+json"> tag emitted only on the live
 * homepage (in addition to the main @graph above). Values copied
 * exactly from the live page's own script tag.
 */
export const MEDICAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: BUSINESS.name,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}${BUSINESS.logo}`,
  image: `${SITE_URL}${BUSINESS.logo}`,
  description:
    "Ormond Spine & Nerve Center in Ormond Beach, FL specializes in chiropractic care, spinal and knee decompression therapy, neuropathy treatment, shockwave, laser, and compression therapy.",
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.streetAddress,
    addressLocality: BUSINESS.address.addressLocality,
    addressRegion: BUSINESS.address.addressRegion,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 29.2696495,
    longitude: -81.0986862,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:00",
    },
  ],
  sameAs: [
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.youtube,
  ],
};

export interface BreadcrumbItemInput {
  name: string;
  /** Path including leading and trailing slash, e.g. "/conditions/spine/" */
  path: string;
}

/**
 * `BreadcrumbList` JSON-LD, emitted as an ADDITIONAL <script> tag
 * alongside `buildGraph()`, same pattern as `buildMedicalWebPageSchema()`
 * and `buildFAQSchema()`. Pass items in order, e.g.
 * [{ name: "Home", path: "/" }, { name: "Conditions", path: "/conditions-we-treat/" }, { name: "Spine", path: "/conditions/spine/" }].
 */
export function buildBreadcrumbSchema(items: BreadcrumbItemInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export interface MedicalConditionInput {
  name: string;
  description: string;
  /** Path (with #anchor) this condition's write-up lives at. */
  path: string;
}

/**
 * `MedicalCondition` JSON-LD nodes for each sub-condition section on a
 * /conditions/[category]/ page, emitted as ONE ADDITIONAL <script> tag
 * (a `@graph` array of MedicalCondition nodes) alongside `buildGraph()`
 * and `buildBreadcrumbSchema()`, same stacking pattern used elsewhere in
 * this file.
 */
export function buildMedicalConditionsSchema(conditions: MedicalConditionInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": conditions.map((condition) => ({
      "@type": "MedicalCondition",
      "@id": `${SITE_URL}${condition.path}`,
      name: condition.name,
      description: condition.description,
      url: `${SITE_URL}${condition.path}`,
    })),
  };
}
