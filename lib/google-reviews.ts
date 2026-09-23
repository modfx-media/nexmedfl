import { cache } from "react";
import {
  additionalPlaceIds,
  fiveStarReviews,
  googleReviewsMeta,
  isFiveStarReview,
  type GoogleReview,
  type GoogleReviewsMeta,
} from "./reviews";

const REVIEWS_REVALIDATE_SECONDS = 60 * 60 * 24;
const PLACES_FIELD_MASK = "id,rating,userRatingCount,googleMapsUri,reviews";

export type GoogleReviewsPayload = {
  reviews: GoogleReview[];
  meta: GoogleReviewsMeta;
};

type PlacesReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string };
};

type PlacesDetailsResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
  error?: { message?: string; status?: string };
};

function fallbackPayload(): GoogleReviewsPayload {
  return {
    reviews: fiveStarReviews,
    meta: { ...googleReviewsMeta },
  };
}

function reviewKey(review: GoogleReview): string {
  return `${review.name.trim().toLowerCase()}|${review.quote.trim().toLowerCase().slice(0, 80)}`;
}

function mergeFiveStarReviews(...lists: GoogleReview[][]): GoogleReview[] {
  const merged = new Map<string, GoogleReview>();
  for (const list of lists) {
    for (const review of list) {
      if (!isFiveStarReview(review)) continue;
      const key = reviewKey(review);
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, review);
        continue;
      }
      if (!existing.relativeTime && review.relativeTime) {
        merged.set(key, review);
      }
    }
  }
  return [...merged.values()];
}

function mapPlaceReview(review: PlacesReview): GoogleReview | null {
  const quote = (review.text?.text ?? review.originalText?.text ?? "").trim();
  const name = review.authorAttribution?.displayName?.trim() ?? "";
  const rating = review.rating ?? 0;

  // Exact 5 only. Drop 4, 4.5, empty text, and nameless authors here.
  if (rating !== 5 || !quote || !name) return null;

  return {
    quote,
    name,
    rating: 5,
    relativeTime: review.relativePublishTimeDescription,
  };
}

async function fetchPlaceDetails(
  apiKey: string,
  placeId: string,
): Promise<PlacesDetailsResponse | null> {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": PLACES_FIELD_MASK,
        },
        next: {
          revalidate: REVIEWS_REVALIDATE_SECONDS,
          tags: ["google-reviews"],
        },
      },
    );

    const data = (await response.json()) as PlacesDetailsResponse;

    if (!response.ok || data.error) {
      console.error(
        "Google Places reviews request failed:",
        data.error?.message ?? response.statusText,
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error("Google Places reviews fetch error:", error);
    return null;
  }
}

function reviewsFromPlace(data: PlacesDetailsResponse | null): GoogleReview[] {
  if (!data) return [];
  return (data.reviews ?? [])
    .map(mapPlaceReview)
    .filter((review): review is GoogleReview => review !== null)
    .filter(isFiveStarReview);
}

/**
 * Places API (New), then 5-star reviews with text only.
 * Google returns at most 5 most-relevant reviews per listing. Filter that set.
 * Also keeps verified 5-star quotes already on file for this clinic.
 */
export const getDisplayedGoogleReviews = cache(
  async (): Promise<GoogleReviewsPayload> => {
    const apiKey =
      process.env.GOOGLE_PLACES_API_KEY?.trim() ||
      process.env.GOOGLE_API_KEY?.trim();
    const placeId =
      process.env.GOOGLE_PLACE_ID?.trim() || googleReviewsMeta.placeId;

    if (!apiKey || placeId.startsWith("REPLACE_")) return fallbackPayload();

    const extraIds = additionalPlaceIds.filter((id) => id && id !== placeId);
    const [primary, ...extras] = await Promise.all([
      fetchPlaceDetails(apiKey, placeId),
      ...extraIds.map((id) => fetchPlaceDetails(apiKey, id)),
    ]);

    const liveReviews = mergeFiveStarReviews(
      reviewsFromPlace(primary),
      ...extras.map(reviewsFromPlace),
      fiveStarReviews,
    );

    if (liveReviews.length === 0) return fallbackPayload();

    return {
      reviews: liveReviews,
      meta: {
        rating: primary?.rating ?? googleReviewsMeta.rating,
        reviewCount: primary?.userRatingCount ?? googleReviewsMeta.reviewCount,
        fiveStarCount: liveReviews.length,
        placeId,
        reviewsUrl: primary?.googleMapsUri ?? googleReviewsMeta.reviewsUrl,
      },
    };
  },
);
