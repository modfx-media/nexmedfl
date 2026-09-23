import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, MEDICAL_BUSINESS_SCHEMA } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { MeetTheDoctor } from "@/components/home/MeetTheDoctor";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { ConditionsTeaser } from "@/components/home/ConditionsTeaser";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { LocationSection } from "@/components/home/LocationSection";
import { getPublishedBlogEntries } from "@/lib/ranked/entries";
import { getDisplayedGoogleReviews } from "@/lib/google-reviews";

export const revalidate = 3600;

const PAGE = getStaticPage("/");

export const metadata: Metadata = buildMetadata(PAGE);

export default async function Home() {
  const [posts, { meta }] = await Promise.all([
    getPublishedBlogEntries(),
    getDisplayedGoogleReviews(),
  ]);
  return (
    <>
      <JsonLd data={buildGraph(PAGE)} />
      {/* Standalone MedicalBusiness schema, only present on the live homepage. */}
      <JsonLd data={MEDICAL_BUSINESS_SCHEMA} />
      <main>
        <Hero
          rating={meta.rating}
          reviewCount={meta.reviewCount}
          reviewsUrl={meta.reviewsUrl}
        />
        <TrustBar />
        <ServicesGrid />
        <ConditionsTeaser />
        <WelcomeSection />
        <MeetTheDoctor />
        <HowItWorks />
        <StatsSection />
        <GoogleReviews>
          {({ reviews, meta: reviewMeta }) => (
            <TestimonialsCarousel
              items={reviews.map((review) => ({
                name: review.name,
                quote: review.quote,
                when: review.relativeTime ?? "Posted on Google",
              }))}
              rating={reviewMeta.rating}
              reviewCount={reviewMeta.reviewCount}
              reviewsUrl={reviewMeta.reviewsUrl}
            />
          )}
        </GoogleReviews>
        <BlogTeaser posts={posts} />
        <LocationSection />
        {/* "Get in Touch" CTA band is intentionally not repeated here, it's
            already rendered site-wide by SiteFooter (via app/layout.tsx),
            using the same FOOTER_CTA copy the live homepage's footer uses. */}
      </main>
    </>
  );
}
