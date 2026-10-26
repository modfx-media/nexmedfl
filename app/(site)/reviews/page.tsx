import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildGoogleReviewsSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { ReviewsPageBody } from "@/components/ReviewsPageBody";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { getDisplayedGoogleReviews } from "@/lib/google-reviews";

const PAGE = getStaticPage("/reviews/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/reviews/", buildMetadata(PAGE));
}

export default async function Page() {
  const { reviews, meta } = await getDisplayedGoogleReviews();

  return (
    <CMSRoute path={"/reviews/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd data={buildGoogleReviewsSchema(reviews, meta)} />
      <GoogleReviews>
        {({ reviews: items, meta: reviewMeta }) => (
          <ReviewsPageBody reviews={items} meta={reviewMeta} />
        )}
      </GoogleReviews>
    </>
    </CMSRoute>
  );
}
