"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HERO, STATS } from "@/lib/home-content";
import { BUSINESS, SITE_NAME } from "@/lib/site-config";
import { HeroBarChart } from "@/components/home/HeroBarChart";

// Real stats reused for both the left-side trust strip and the floating
// "outcomes" card on the right.
const TRUST_MARKERS = [
  { value: `${STATS[0].value}${STATS[0].suffix}`, label: "Years of experience" },
  { value: `${STATS[2].value}${STATS[2].suffix}`, label: "Patients helped" },
  { value: `${STATS[3].value}${STATS[3].suffix}`, label: "Satisfaction" },
];

function StarRow() {
  return (
    <span className="flex items-center gap-0.5 text-brand-cyan">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L1.4 7.9l6-.9L10 1.5Z" />
        </svg>
      ))}
    </span>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4 text-brand-cyan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Zm-3 10 2 2 4-4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 text-brand-cyan"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3v3M17 3v3M3.5 9h17M5 6h14a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6Z" />
    </svg>
  );
}

export function Hero({
  rating,
  reviewCount,
  reviewsUrl,
}: {
  rating: number;
  reviewCount: number;
  reviewsUrl: string;
}) {
  return (
    <section
      aria-label={SITE_NAME}
      className="relative isolate overflow-hidden bg-ink"
    >
      {/* Full-bleed background video (falls back to the still photo poster) */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        poster="/images/back-pain-featured.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Dark overlay for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 20% 15%, rgba(20,40,60,0.55) 0%, rgba(10,14,22,0.88) 55%, rgba(8,10,16,0.96) 100%)",
        }}
      />
      {/* Faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 30% 40%, black 30%, transparent 100%)",
        }}
      />
      {/* Ambient floating orbs */}
      <div
        aria-hidden
        className="nexmed-orb-a pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-brand-cyan/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="nexmed-orb-b pointer-events-none absolute -right-24 bottom-16 h-[360px] w-[360px] rounded-full bg-brand-deep/25 blur-[100px]"
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8 lg:py-28">
        {/* LEFT, copy */}
        <div className="flex flex-col">
          {/* Eyebrow chip */}
          <div
            className="nexmed-hero-enter inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-cyan/60" />
              <span className="relative h-2 w-2 rounded-full bg-brand-cyan" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">
              Now Accepting New Patients · Ormond Beach, FL
            </span>
          </div>

          {/* Headline, serif display face, two-line accent break */}
          <h1 className="mt-6 font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[64px]">
            <span
              className="nexmed-hero-enter block"
              style={{ animationDelay: "0.3s" }}
            >
              Your Path To
            </span>
            <span
              className="nexmed-hero-enter block bg-gradient-to-r from-brand-cyan to-brand-deep bg-clip-text text-transparent"
              style={{ animationDelay: "0.45s" }}
            >
              Recovery.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="nexmed-hero-enter mt-5 max-w-xl text-base leading-[1.7] text-white/75 sm:text-[17px]"
            style={{ animationDelay: "0.85s" }}
          >
            {HERO.subheading}
          </p>

          {/* CTAs */}
          <div
            className="nexmed-hero-enter mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "1.0s" }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={HERO.ctaHref}
                className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-brand-cyan to-brand-deep px-8 py-4 text-[15px] font-semibold text-white shadow-[0_18px_44px_-10px_rgba(1,36,83,0.65)] transition-shadow hover:shadow-[0_22px_52px_-8px_rgba(119,189,197,0.7)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
                />
                <span className="relative">{HERO.ctaLabel}</span>
                <svg
                  className="relative h-4 w-4 transition-transform group-hover/cta:translate-x-1"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10m0 0L8 3m5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>

            <a
              href={BUSINESS.telephoneHref}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-[14px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-brand-cyan">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
              </span>
              {BUSINESS.telephone}
            </a>
          </div>

          {/* Trust row */}
          <div
            className="nexmed-hero-enter mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ animationDelay: "1.15s" }}
          >
            {reviewCount > 0 ? (
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/85 transition-colors hover:text-white"
              >
                <StarRow />
                {rating.toFixed(1)} · {reviewCount} Google reviews
              </a>
            ) : null}
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/85">
              <ShieldIcon />
              Non-Surgical &amp; Drug-Free
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/85">
              <CalendarIcon />
              New Patients Welcome · {BUSINESS.hoursDisplay}
            </span>
          </div>

          {/* Real stat trio */}
          <div
            className="nexmed-hero-enter mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-6"
            style={{ animationDelay: "1.3s" }}
          >
            {TRUST_MARKERS.map((marker) => (
              <div key={marker.label} className="flex flex-col leading-tight">
                <span className="bg-gradient-to-br from-brand-cyan to-white bg-clip-text text-2xl font-bold text-transparent">
                  {marker.value}
                </span>
                <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  {marker.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT, floating stat card + consult bubble, resting directly
            on the full-bleed photo (no boxed video/image underneath). */}
        <div className="relative mx-auto flex w-full max-w-[380px] flex-col items-center gap-6 lg:mx-0 lg:ml-auto lg:items-end">
          {/* "Real outcomes" stat card */}
          <div
            className="nexmed-slide-in-right w-full rounded-[24px] border border-white/15 bg-white/[0.06] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex items-center gap-2">
              <span className="nexmed-live-pulse relative flex h-2 w-2 rounded-full text-brand-cyan">
                <span className="relative h-2 w-2 rounded-full bg-brand-cyan" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cyan">
                Real Results
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold leading-snug text-white">
              Real outcomes that move patients forward.
            </p>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-col gap-3">
                {TRUST_MARKERS.map((marker) => (
                  <div key={marker.label} className="leading-tight">
                    <span className="text-xl font-bold text-white">
                      {marker.value}
                    </span>
                    <span className="ml-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/50">
                      {marker.label}
                    </span>
                  </div>
                ))}
              </div>
              <HeroBarChart />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[12px]">
              <span className="text-white/50">Verified care · Updated regularly</span>
              <Link
                href="/reviews/"
                className="font-semibold text-brand-cyan transition-colors hover:text-white"
              >
                See stories →
              </Link>
            </div>
          </div>

          {/* "Book a free consult" bubble, offset to overlap the card
              above, mirroring the reference layout's floating chat-style
              CTA (worded honestly: no live-chat claim, just a direct
              link to booking). */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="nexmed-pop-in -mt-2 w-fit max-w-[300px] self-center lg:-mt-8 lg:mr-6 lg:self-auto"
            style={{ animationDelay: "1.0s" }}
          >
            <Link
              href="/appointment-request/"
              className="group/bubble flex items-center gap-3 rounded-full border border-white/15 bg-white py-2.5 pl-2.5 pr-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-deep text-white">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Zm-3 10 2 2 4-4" />
                </svg>
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-ink">
                  Not sure where to start?
                </span>
                <span className="block text-[12px] font-medium text-ink-soft transition-colors group-hover/bubble:text-brand-deep">
                  Book a free consult →
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
