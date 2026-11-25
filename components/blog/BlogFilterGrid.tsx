"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getBlogPostPath,
  getBlogTopic,
  getReadTimeMinutes,
  type BlogPostEntry,
} from "@/lib/posts";
import { BLOG_TOPICS } from "@/lib/contact-content";
import { imageSrcForRendering } from "@/lib/cms/image-src";
import { Reveal } from "@/components/Reveal";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function TopicPill({ label, tone = "onLight" }: { label: string; tone?: "onLight" | "onDark" }) {
  return (
    <span
      className={
        tone === "onDark"
          ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-deep shadow-sm backdrop-blur"
          : "inline-flex w-fit items-center gap-1.5 rounded-full bg-bg-tinted px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-deep"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
      {label}
    </span>
  );
}

export function PostCard({ post, delay, large = false }: { post: BlogPostEntry; delay: number; large?: boolean }) {
  const topic = getBlogTopic(post);
  const readTime = getReadTimeMinutes(post);

  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={getBlogPostPath(post)}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-white transition-all hover:-translate-y-1.5 hover:border-brand-cyan/40 hover:shadow-[0_28px_64px_-32px_rgba(1,36,83,0.35)] ${
          large ? "lg:flex-row" : ""
        }`}
      >
        <div
          className={`relative w-full overflow-hidden ${
            large ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"
          }`}
        >
          {post.image ? (
            <Image
              src={imageSrcForRendering(post.image)}
              alt={post.imageCaption ?? post.title}
              fill
              sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={large}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-cyan/15 to-brand-deep/10" />
          )}
          <div className="absolute left-3 top-3">
            <TopicPill label={topic} tone="onDark" />
          </div>
        </div>

        <div className={`flex flex-1 flex-col p-5 ${large ? "lg:p-8" : ""}`}>
          <p
            className={`font-semibold leading-snug text-ink ${
              large ? "text-xl sm:text-2xl" : "text-[15px]"
            }`}
          >
            {post.title}
          </p>
          <p
            className={`mt-2.5 flex-1 text-ink-soft ${
              large ? "line-clamp-3 text-[15px] leading-relaxed" : "line-clamp-3 text-[13.5px] leading-relaxed"
            }`}
          >
            {post.description}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-surface-border pt-4">
            <span className="text-[12px] font-medium text-ink-muted">
              {formatDate(post.datePublished)} &middot; {readTime} min read
            </span>
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-deep transition-transform group-hover:translate-x-0.5">
              Read More <span aria-hidden>&rarr;</span>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function BlogFilterGrid({ posts }: { posts: BlogPostEntry[] }) {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    // Show every post in the selected topic so no article becomes unreachable from the index.
    return active === "All" ? posts : posts.filter((post) => getBlogTopic(post) === active);
  }, [active, posts]);

  const featured = active === "All" ? filtered[0] : undefined;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={() => setActive("All")}
          className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
            active === "All"
              ? "border-transparent bg-gradient-to-br from-brand-cyan to-brand-deep text-white shadow-[0_10px_28px_-14px_rgba(1,36,83,0.55)]"
              : "border-surface-border bg-white text-ink hover:border-brand-cyan/40 hover:text-brand-deep"
          }`}
        >
          All Articles
        </button>
        {BLOG_TOPICS.map((topic) => (
          <button
            key={topic.label}
            type="button"
            onClick={() => setActive(topic.label)}
            title={topic.description}
            className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
              active === topic.label
                ? "border-transparent bg-gradient-to-br from-brand-cyan to-brand-deep text-white shadow-[0_10px_28px_-14px_rgba(1,36,83,0.55)]"
                : "border-surface-border bg-white text-ink hover:border-brand-cyan/40 hover:text-brand-deep"
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Featured post */}
      {featured && (
        <div className="mt-10">
          <PostCard post={featured} delay={0} large />
        </div>
      )}

      {/* Grid */}
      {rest.length > 0 ? (
        <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${featured ? "mt-8" : "mt-10"}`}>
          {rest.map((post, i) => (
            <PostCard key={getBlogPostPath(post)} post={post} delay={Math.min((i % 6) * 0.06, 0.3)} />
          ))}
        </div>
      ) : (
        <p className="mt-14 text-center text-[14px] text-ink-soft">
          No articles in this topic yet, check back soon.
        </p>
      )}
    </div>
  );
}
