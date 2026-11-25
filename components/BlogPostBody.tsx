import Image from "next/image";
import Link from "next/link";
import { imageSrcForRendering } from "@/lib/cms/image-src";
import { Reveal } from "@/components/Reveal";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { PostCard } from "@/components/blog/BlogFilterGrid";
import {
  getBlogPostPath,
  getBlogTopic,
  getReadTimeMinutes,
  type BlogPostEntry,
} from "@/lib/posts";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Full article body for blog posts that have written `body` content
 * (see lib/posts.ts). Renders a reading-progress bar, a hero image/title
 * with topic + read-time pills, the article sections, a closing CTA
 * card, and a "related reading" card grid.
 */
function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    return (
      <a
        key={`${match[2]}-${index}`}
        href={match[2]}
        className="font-semibold text-brand-deep underline decoration-brand-cyan/40 underline-offset-2 hover:decoration-brand-deep"
      >
        {match[1]}
      </a>
    );
  });
}

export function BlogPostBody({
  post,
  posts,
}: {
  post: BlogPostEntry;
  posts: BlogPostEntry[];
}) {
  const topic = getBlogTopic(post);
  const readTime = getReadTimeMinutes(post);
  const related = posts
    .filter((p) => p.slug !== post.slug && getBlogTopic(p) === topic)
    .slice(0, 3);

  return (
    <main>
      <ReadingProgressBar />
      <article>
        <section className="relative overflow-hidden bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 15% 0%, rgba(119,189,197,0.1) 0%, transparent 55%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-[13px] font-medium text-ink-muted">
                <Link href="/blogs/" className="hover:text-brand-deep">
                  Blog
                </Link>{" "}
                / <span className="text-ink-soft">{topic}</span>
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-cyan/30 bg-white/70 px-3 py-1.5 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-deep">
                    {topic}
                  </span>
                </span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-bg-tinted px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
                  {readTime} min read
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {post.title}
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-3 text-[13px] font-medium text-ink-soft">
                {formatDate(post.datePublished)}
              </p>
            </Reveal>

            {post.image && (
              <Reveal delay={0.2}>
                <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-surface-border">
                  <Image
                    src={imageSrcForRendering(post.image)}
                    alt={post.imageCaption ?? post.title}
                    fill
                    sizes="(min-width: 1024px) 768px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {post.body?.map((block, i) => (
              <Reveal key={block.heading ?? i} delay={Math.min(i * 0.06, 0.3)}>
                <div>
                  {block.heading && (
                    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                      {block.heading}
                    </h2>
                  )}
                  <div className={block.heading ? "mt-3 space-y-4" : "space-y-4"}>
                    {block.paragraphs?.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-[15px] leading-[1.8] text-ink-soft"
                      >
                        {renderInlineMarkdown(paragraph)}
                      </p>
                    ))}
                    {block.bullets && block.bullets.length > 0 && (
                      <ul className="list-disc space-y-2 pl-5">
                        {block.bullets.map((item, bIndex) => (
                          <li
                            key={bIndex}
                            className="text-[15px] leading-[1.8] text-ink-soft"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-2xl border border-surface-border bg-bg-tinted p-7 text-center sm:p-9">
              <p className="text-lg font-bold tracking-tight text-ink">
                Ready to take the next step?
              </p>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft">
                {post.relatedServiceLabel
                  ? `Learn more about ${post.relatedServiceLabel} or request your appointment today.`
                  : "Request your appointment today and let our Ormond Beach team build a plan for you."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {post.relatedServiceHref && (
                  <Link
                    href={post.relatedServiceHref}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-surface-border bg-white px-6 py-3 text-[14px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand-cyan/40"
                  >
                    {post.relatedServiceLabel}
                  </Link>
                )}
                <Link
                  href="/appointment-request/"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-brand-cyan to-brand-deep px-6 py-3 text-[14px] font-semibold text-white shadow-[0_18px_44px_-10px_rgba(1,36,83,0.55)] transition-all hover:scale-[1.03]"
                >
                  Request an Appointment
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Related Reading
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost, i) => (
                <PostCard
                  key={getBlogPostPath(relatedPost)}
                  post={relatedPost}
                  delay={Math.min(i * 0.06, 0.3)}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
