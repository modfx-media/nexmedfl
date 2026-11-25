import assert from "node:assert/strict";
import test from "node:test";

import {
  findPublicPost,
  isPublicPost,
  publicSitemapLocs,
  publishedByDateWhere,
  selectPublicPosts,
} from "./publish-window";

const ORIGIN = "https://ormondspinenervecenter.com";

/** Mirrors live Payload posts plus one undated published post. Clock is 25 Nov 2026. */
const NOW = new Date("2026-11-25T18:06:00.000Z");

const FIXTURE = [
  {
    slug: "compression-therapy-for-heavy-legged-shoppers",
    datePublished: "2026-12-10T12:00:00.000Z",
  },
  {
    slug: "low-speed-crashes-call-for-car-accident-treatment",
    datePublished: "2026-12-03T12:00:00.000Z",
  },
  {
    slug: "improve-desk-posture-chiropractor",
    datePublished: "2026-11-26T12:00:00.000Z",
  },
  {
    slug: "peripheral-neuropathy-treatment-vs-waiting-it-out",
    datePublished: "2026-11-19T12:00:00.000Z",
  },
  {
    slug: "how-laser-therapy-may-help-relieve-tendon-pain-in-new-smyrna-beach",
    datePublished: "2026-10-15T14:00:00+00:00",
  },
  {
    slug: "published-without-a-date",
    datePublished: null,
  },
];

const FUTURE = [
  "compression-therapy-for-heavy-legged-shoppers",
  "low-speed-crashes-call-for-car-accident-treatment",
  "improve-desk-posture-chiropractor",
];

const PAST = [
  "peripheral-neuropathy-treatment-vs-waiting-it-out",
  "how-laser-therapy-may-help-relieve-tendon-pain-in-new-smyrna-beach",
  "published-without-a-date",
];

test("listing includes past posts and excludes future ones", () => {
  const slugs = selectPublicPosts(FIXTURE, { now: NOW }).map((post) => post.slug);
  assert.deepEqual(slugs, PAST);
  for (const slug of FUTURE) assert.equal(slugs.includes(slug), false);
});

test("detail resolves past posts and notFound for future posts unless previewing", () => {
  for (const slug of PAST) {
    assert.equal(findPublicPost(FIXTURE, slug, { now: NOW })?.slug, slug);
  }
  for (const slug of FUTURE) {
    assert.equal(findPublicPost(FIXTURE, slug, { now: NOW }), undefined);
    assert.equal(findPublicPost(FIXTURE, slug, { now: NOW, draft: true })?.slug, slug);
  }
});

test("sitemap locs drop only future posts", () => {
  const locs = publicSitemapLocs(FIXTURE, { now: NOW, origin: ORIGIN });
  assert.deepEqual(
    locs,
    PAST.map((slug) => `${ORIGIN}/blogs/${slug}/`),
  );
  for (const slug of FUTURE) {
    assert.equal(locs.includes(`${ORIGIN}/blogs/${slug}/`), false);
  }
});

test("a post joins listing, detail, and sitemap at its publish instant", () => {
  const slug = "improve-desk-posture-chiropractor";
  const publishAt = new Date("2026-11-26T12:00:00.000Z");
  const before = new Date(publishAt.getTime() - 1);

  assert.equal(isPublicPost({ datePublished: publishAt.toISOString() }, { now: before }), false);
  assert.equal(
    findPublicPost(FIXTURE, slug, { now: before }),
    undefined,
  );
  assert.equal(
    publicSitemapLocs(FIXTURE, { now: before, origin: ORIGIN }).includes(
      `${ORIGIN}/blogs/${slug}/`,
    ),
    false,
  );

  const listing = selectPublicPosts(FIXTURE, { now: publishAt }).map((post) => post.slug);
  assert.equal(listing.includes(slug), true);
  assert.equal(findPublicPost(FIXTURE, slug, { now: publishAt })?.slug, slug);
  assert.equal(
    publicSitemapLocs(FIXTURE, { now: publishAt, origin: ORIGIN }).includes(
      `${ORIGIN}/blogs/${slug}/`,
    ),
    true,
  );
});

test("draft preview keeps future posts in the listing", () => {
  const slugs = selectPublicPosts(FIXTURE, { now: NOW, draft: true }).map((post) => post.slug);
  assert.deepEqual(
    slugs,
    FIXTURE.map((post) => post.slug),
  );
});

test("payload where matches the public date rule", () => {
  const where = publishedByDateWhere(NOW);
  assert.deepEqual(where, {
    or: [
      { datePublished: { less_than_equal: "2026-11-25T18:06:00.000Z" } },
      { datePublished: { exists: false } },
    ],
  });
});
