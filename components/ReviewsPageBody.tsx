import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { REVIEWS_INTRO } from "@/lib/reviews-content";
import type { GoogleReview, GoogleReviewsMeta } from "@/lib/reviews";

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L1.4 7.9l6-.9L10 1.5Z" />
    </svg>
  );
}

// Standard multi-color Google "G" mark, used only to attribute these
// reviews as coming from Google (nominative use), matching the familiar
// look of a Google review widget.
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

// Deterministic Google-Material-style avatar colors, keyed off the
// reviewer's name so each card gets a stable, distinct color.
const AVATAR_PALETTE = ["#1A73E8", "#D93025", "#188038", "#F9AB00", "#9334E6", "#12B5CB", "#E8710A"];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * /reviews/ page body, hero with aggregate rating summary, a grid of
 * real patient testimonials (reused from the homepage carousel), and a
 * closing appointment CTA. Styled with the site's brand tokens, matching
 * the tone of ServicePageBody's hero/section patterns.
 */
export function ReviewsPageBody({
  reviews,
  meta,
}: {
  reviews: GoogleReview[];
  meta: GoogleReviewsMeta;
}) {
  if (reviews.length === 0) return null;

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 15% 0%, rgba(119,189,197,0.1) 0%, transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-10 h-[360px] w-[360px] rounded-full bg-brand-cyan/15 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 h-[320px] w-[320px] rounded-full bg-brand-deep/10 blur-[100px]"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-brand-cyan/30 bg-white/70 px-3 py-1.5 shadow-[0_8px_28px_-14px_rgba(1,36,83,0.35)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-deep">
              {REVIEWS_INTRO.eyebrow}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {REVIEWS_INTRO.heading}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            {REVIEWS_INTRO.intro}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <GoogleIcon className="h-6 w-6" />
            <div className="flex gap-1 text-[#FBBC04]">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5" />
              ))}
            </div>
            <p className="text-sm font-semibold text-ink">
              {meta.rating.toFixed(1)} average · {meta.reviewCount} Google reviews
            </p>
          </div>
          <a
            href={meta.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep transition-colors hover:text-brand"
          >
            View all Google reviews
          </a>
        </div>
      </section>

      {/* Review cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-surface-border bg-white p-6 shadow-[0_18px_48px_-32px_rgba(15,23,42,0.28)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.32)]">
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
                    style={{ backgroundColor: avatarColor(review.name) }}
                    aria-hidden="true"
                  >
                    {initials(review.name)}
                    <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white p-[3px] shadow ring-1 ring-black/5">
                      <GoogleIcon className="h-full w-full" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{review.name}</p>
                    <p className="text-[12px] text-ink-muted">
                      {review.relativeTime ?? "Google review"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5 text-[#FBBC04]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-[1.7] text-ink-soft">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-bg-tinted">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Ready to Become Our Next Success Story?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Schedule a visit and see why Ormond Beach patients trust our team
            for chiropractic, spine, and nerve care.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/appointment-request/"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-brand-cyan to-brand-deep px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_44px_-10px_rgba(1,36,83,0.55)] transition-all hover:scale-[1.03]"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
