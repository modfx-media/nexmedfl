/**
 * Per-client Google review types + fallback.
 * Fallback quotes must be real 5-star Google reviews for THIS business.
 * Leave googleReviews empty if none are on file.
 */
export const googleReviewsMeta = {
  rating: 5, // Google's overall rating for the current branded listing
  reviewCount: 3, // Google's total review count on that listing, all stars
  fiveStarCount: 3,
  placeId: "ChIJQ2hLJZHd5ogRR2K8n0lioUU",
  reviewsUrl:
    "https://www.google.com/maps/place/?q=place_id:ChIJQ2hLJZHd5ogRR2K8n0lioUU",
} as const;

/** Same clinic / same suite, previous Google listing (NexMed). */
export const additionalPlaceIds = ["ChIJEeyhWzvd5ogR64z96u9wU0M"] as const;

export type GoogleReview = {
  quote: string;
  name: string;
  rating: number;
  relativeTime?: string;
};

export type GoogleReviewsMeta = {
  rating: number;
  reviewCount: number;
  fiveStarCount: number;
  placeId: string;
  reviewsUrl: string;
};

export const googleReviews: GoogleReview[] = [
  {
    name: "M & G Lewis",
    rating: 5,
    quote:
      "I have been receiving neuropathy treatment  at this  Ormond Beach office for the past year and have achieved much relief.  I highly recommend this facility and the doctor and staff are excellent.",
    relativeTime: "a month ago",
  },
  {
    name: "George “Geo” Marz",
    rating: 5,
    quote:
      "Been a patient for coming up.on a year & there has been significant improvement with my nueropathy...the staff is very friendly and caring and I can whole heartedly recommend their services!",
    relativeTime: "a month ago",
  },
  {
    name: "Florence Howard",
    rating: 5,
    quote:
      "Girls in the office are very knowledgeable, kind and very caring and work to take care of everyone",
    relativeTime: "a month ago",
  },
  {
    name: "Fatima Lavado",
    rating: 5,
    quote:
      "I wish I had found them earlier. For years my doctor would say it was caused by diabetes and I just needed to take my medication. Well thank God I found this place. Before I couldn’t wiggle my toes and my feet were going numb but now with the treatment that I’ve been receiving, I could finally feel my toes again. I feel blessed thank you to all of you.. if you feel numbness in your feet or  hands, I highly recommend that you come and get diagnosed. The staff is wonderful and so is the doctor give them a call make an appointment. Have a blessed day..",
    relativeTime: "7 months ago",
  },
  {
    name: "Samuel. Blanco",
    rating: 5,
    quote:
      "I have coming here for about seven months and felt relief in my neuropathy. The staff are awesome and treat you well and understanding how sometimes schedules with work interfere. My pain levels have dropped. This therapy works. Give it time.",
    relativeTime: "3 months ago",
  },
  {
    name: "Patricia Leagle",
    rating: 5,
    quote:
      "Everyone at the office are fantastic.  They all go out of their way to make sure you are well taken care of when you go in for your treatment. I would highly recommend this office to anyone who suffers from neuropathy. In just a few weeks of treatment I could see a big difference in my feet. What a true blessing the entire staff is.",
    relativeTime: "9 months ago",
  },
  {
    name: "Miguel Farese",
    rating: 5,
    quote:
      "This is my first time having this treatment I am bone and bone on my knee ,and Next Med service looks extremely good 👍 everything they on me is excellent.  They are friendly and very professional.  I would recommend the office and procedure.",
    relativeTime: "6 months ago",
  },
  {
    name: "Olivia Holte",
    rating: 5,
    quote:
      "Absolutely amazing! I love Central Florida health center. From my first appointment all of the staff was so friendly and supportive. I am always treated like a VIP. I am a type 1 diabetic suffering from neuropathy in my hands and feet. Already in a month into treatment I'm in less pain. If you are looking for treatment for neuropathy I would highly recommend them.",
  },
  {
    name: "Vicky Kennedy",
    rating: 5,
    quote:
      "My husband Rich & I have learned so much about his neuropathy. We are grateful for the staff at this facility. Their knowledge, professionalism, friendly atmosphere & genuine care is encouraging him to keep up with the prescribed program. He is improving little by little. Thank you!",
  },
  {
    name: "Rose Marie Diaz",
    rating: 5,
    quote:
      "This is an awesome place to go to. When you walk in, you walk into an awesome atmosphere and are greeted by all the staff with smiling faces. This office in Ormond Beach Florida is very professional. They are here to help you and Answer any questions you have about your treatment. Thank you for being made to feel like you are with family, you guys are fantastic.",
  },
];

/** The only acceptance test for a card or a JSON-LD review. */
export function isFiveStarReview(review: GoogleReview): boolean {
  return review.rating === 5 && review.quote.trim().length > 0 && review.name.trim().length > 0;
}

export const fiveStarReviews = googleReviews.filter(isFiveStarReview);
