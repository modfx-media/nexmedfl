import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { LeadFormEmbed } from "@/components/LeadFormEmbed";
import { LocationSection } from "@/components/home/LocationSection";
import { ContactGoogleReviews } from "@/components/ContactGoogleReviews";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { BUSINESS } from "@/lib/site-config";
import { CONTACT_PAGE_CONTENT } from "@/lib/contact-content";

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4.5 5L19 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5c0 8.3 6.7 15 15 15l3-4-6-3-2 2c-2.5-1.2-4.8-3.5-6-6l2-2-3-6-4 3Z" />
    </svg>
  );
}

/**
 * /contact-us/ page body, intro, hours, benefits, LeadConnector form, and
 * the shared LocationSection (address, phone, email, map) for the
 * location/"how to reach us" requirement.
 */
export function ContactUsPageBody() {
  const content = CONTACT_PAGE_CONTENT;

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

        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-brand-cyan/30 bg-white/70 px-3 py-1.5 shadow-[0_8px_28px_-14px_rgba(1,36,83,0.35)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-deep">
              {content.eyebrow}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {content.heading}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            {content.intro}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-bg-tinted px-4 py-2 text-[13px] font-semibold text-ink">
              <ClockIcon />
              {BUSINESS.hoursDisplay}
            </span>
            <Link
              href={BUSINESS.telephoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-bg-tinted px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-brand-cyan/40 hover:text-brand-deep"
            >
              <PhoneIcon />
              {BUSINESS.telephone}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits + form */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div>
            <ul className="space-y-5">
              {content.benefits.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 0.08}>
                  <li className="flex gap-3.5 rounded-2xl border border-surface-border bg-white p-5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-deep text-white">
                      <CheckIcon />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">
                        {benefit.title}
                      </p>
                      <p className="mt-1 text-[14px] leading-[1.7] text-ink-soft">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-[0_24px_60px_-38px_rgba(1,36,83,0.3)] sm:p-6">
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {content.formHeading}
              </h2>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-ink-soft">
                {content.formIntro}
              </p>
              <div className="mt-6">
                <LeadFormEmbed title={content.formHeading} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <GoogleReviews>
        {({ reviews, meta }) => (
          <ContactGoogleReviews reviews={reviews} meta={meta} />
        )}
      </GoogleReviews>

      <LocationSection />
    </main>
  );
}
