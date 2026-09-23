import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildGoogleReviewsSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { ReviewsPageBody } from "@/components/ReviewsPageBody";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { getDisplayedGoogleReviews } from "@/lib/google-reviews";

const PAGE = getStaticPage("/reviews/");

export const metadata: Metadata = buildMetadata(PAGE);

export default async function Page() {
  const { reviews, meta } = await getDisplayedGoogleReviews();

  return (
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd data={buildGoogleReviewsSchema(reviews, meta)} />
      <GoogleReviews>
        {({ reviews: items, meta: reviewMeta }) => (
          <ReviewsPageBody reviews={items} meta={reviewMeta} />
        )}
      </GoogleReviews>
    </>
  );
}
