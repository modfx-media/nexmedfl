"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { TESTIMONIAL_GALLERY } from "@/lib/home-content";
import { SITE_NAME } from "@/lib/site-config";

function StarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L1.4 7.9l6-.9L10 1.5Z" />
    </svg>
  );
}

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

export function TestimonialsCarousel({
  items,
  rating,
  reviewCount,
  reviewsUrl,
}: {
  items: { name: string; quote: string; when?: string }[];
  rating: number;
  reviewCount: number;
  reviewsUrl: string;
}) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const testimonial = items[index] ?? items[0];

  function go(delta: number) {
    setIndex((current) => (current + delta + items.length) % items.length);
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-3">
          {TESTIMONIAL_GALLERY.map((src) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={src}
                alt={`${SITE_NAME} patient care`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 22vw, 45vw"
              />
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Happy Patients
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
            Real Stories, Real Results
          </h2>

          {reviewCount > 0 ? (
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>
                {rating.toFixed(1)} · {reviewCount} Google reviews
              </span>
            </a>
          ) : null}

          <div className="mt-6 min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={testimonial.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {testimonial.name}
                </p>
                {testimonial.when ? (
                  <p className="mt-1 text-[12px] text-ink-muted">{testimonial.when}</p>
                ) : null}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border text-ink transition-colors hover:border-brand hover:text-brand"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border text-ink transition-colors hover:border-brand hover:text-brand"
            >
              →
            </button>
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-sm font-semibold text-brand-deep transition-colors hover:text-brand"
            >
              View all Google reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
