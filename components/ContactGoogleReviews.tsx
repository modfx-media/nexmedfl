import { Reveal } from "@/components/Reveal";
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
 * Compact "Google reviews" preview section for the /contact-us/ page,
 * mirrors the Google-review card styling used on the full /reviews/
 * page (matching Google icon, star color, and avatar treatment) but
 * shows just a few reviews plus a link to the full Google listing.
 */
export function ContactGoogleReviews({
  reviews,
  meta,
}: {
  reviews: GoogleReview[];
  meta: GoogleReviewsMeta;
}) {
  if (reviews.length === 0) return null;

  const featured = reviews;

  return (
    <section className="bg-bg-tinted">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-brand-cyan/30 bg-white px-3 py-1.5 shadow-[0_8px_28px_-14px_rgba(1,36,83,0.35)]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-deep">
                Patient Reviews
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Trusted by Ormond Beach Patients
            </h2>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
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
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((review, i) => (
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

        <div className="mt-10 text-center">
          <a
            href={meta.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-deep transition-colors hover:text-brand"
          >
            View all Google reviews
            <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 6h8m0 0L6 2m4 4L6 10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
