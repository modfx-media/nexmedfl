// Central, client-safe site configuration.
// Pure data only (no Node builtins) so this can be imported from both
// Server and Client Components without breaking the Turbopack build.

// Public SEO origin. Production canonicals, sitemap locs, Open Graph
// URLs, JSON-LD, and robots.txt all use this apex. NEXT_PUBLIC_SITE_URL
// and NEXT_PUBLIC_SERVER_URL are not read here: those may point at a
// *.vercel.app host for Payload, and must not change public SEO.
const PRODUCTION_ORIGIN = "https://ormondspinenervecenter.com";

function resolvePublicOrigin(): string {
  const configured = process.env.SITE_ORIGIN?.trim();
  if (!configured) return PRODUCTION_ORIGIN;
  try {
    const host = new URL(configured).hostname.replace(/^www\./, "").toLowerCase();
    if (host === "ormondspinenervecenter.com") return PRODUCTION_ORIGIN;
  } catch {
    return PRODUCTION_ORIGIN;
  }
  return PRODUCTION_ORIGIN;
}

export const SITE_URL = resolvePublicOrigin();
export const SITE_NAME = "Ormond Spine & Nerve Center";
export const SITE_DEFAULT_DESCRIPTION =
  "Ormond Spine & Nerve Center is a medical clinic in Ormond Beach, FL specializing in chiropractic care, spinal and knee decompression therapy, neuropathy treatment, shockwave, laser, and compression therapy.";

export const BUSINESS = {
  name: SITE_NAME,
  legalName: "Ormond Spine & Nerve Center",
  telephone: "386-361-3391",
  telephoneHref: "tel:386-361-3391",
  email: "info@ormondspinenervecenter.com",
  emailHref: "mailto:info@ormondspinenervecenter.com",
  // Real logo artwork (cropped to content bounds, transparent background);
  // used for the header, footer, mobile drawer, and schema/Open Graph images.
  logo: "/images/logo-v3.png",
  logoWidth: 1235,
  logoHeight: 509,
  address: {
    streetAddress: "141 Sagebrush Trail, Suite C",
    addressLocality: "Ormond Beach",
    addressRegion: "FL",
    postalCode: "32174",
    addressCountry: "US",
  },
  addressDisplay: "141 Sagebrush Trail, Suite C Ormond Beach, FL 32174",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=141+Sagebrush+Trail+Suite+C+Ormond+Beach+FL+32174",
  openingHours: ["Tuesday,Wednesday,Thursday,Friday 08:30-17:00"],
  // Human-readable hours string reused across contact-focused pages.
  hoursDisplay: "Tue–Fri · 8:30 AM – 5:00 PM",
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/NexMedOrmond",
  instagram: "https://www.instagram.com/nexmedormond/",
  youtube: "https://www.youtube.com/channel/UCHhGf0vLqsVA6k-0hmLasvA",
};

export type NavLink = {
  label: string;
  href: string;
};

// Primary header / "Quick Links" footer navigation, matching the live site.
export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/meet-our-team/" },
  { label: "Services", href: "/services/" },
  {
    label: "Car Accident Care",
    href: "/car-accidents-personal-injury/",
  },
  { label: "Reviews", href: "/reviews/" },
  { label: "Appointment Request", href: "/appointment-request/" },
  { label: "Blog", href: "/blogs/" },
  { label: "Areas We Serve", href: "/service-areas/" },
  { label: "Contact Us", href: "/contact-us/" },
  { label: "Careers", href: "/career-opportunities/" },
];

export type HeaderNavItem = {
  label: string;
  /** Omitted for items that are dropdown-toggle-only on the live site (e.g. "About Us"). */
  href?: string;
  children?: NavLink[];
  /** Grouped mega-menu columns, Services and Conditions. */
  categories?: ServiceCategory[];
};

export type ServiceCategory = {
  label: string;
  /** Optional link for the category label itself (e.g. the Conditions
   *  mega-menu's category headings deep-link to their dedicated
   *  /conditions/[category]/ page). Services categories omit this. */
  href?: string;
  items: NavLink[];
};

// Services mega-menu categories, grouped by body system per the Ormond
// Spine & Nerve Center service catalogue.
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    label: "Spine & Chiropractic Care",
    items: [
      { label: "Chiropractic Care", href: "/chiropractic-care/" },
      {
        label: "Spinal Decompression Therapy",
        href: "/spinal-decompression-therapy/",
      },
      {
        label: "Car Accident Care",
        href: "/car-accidents-personal-injury/",
      },
    ],
  },
  {
    label: "Knee & Joint Care",
    items: [
      {
        label: "Knee Decompression Therapy",
        href: "/knee-decompression-therapy/",
      },
      { label: "Knee Pain Treatment", href: "/knee-pain-treatment/" },
    ],
  },
  {
    label: "Nerve & Neuropathy Care",
    items: [
      { label: "Neuropathy Treatment", href: "/neuropathy-treatment/" },
    ],
  },
  {
    label: "Recovery & Advanced Therapies",
    items: [
      { label: "Shockwave Therapy", href: "/shockwave-therapy/" },
      { label: "Laser Therapy", href: "/laser-therapy/" },
      { label: "Compression Therapy", href: "/compression-therapy/" },
    ],
  },
];

// Conditions mega-menu categories, the full catalogue from the Ormond
// Spine & Nerve Center conditions list, grouped by body region. Each
// category label deep-links to its dedicated /conditions/[category]/
// page (lib/condition-pages-content.ts is the content source of truth),
// and each item deep-links straight to that condition's section anchor
// on the same page.
export const CONDITION_CATEGORIES: ServiceCategory[] = [
  {
    label: "Neuropathy & Nerve",
    href: "/conditions/neuropathy-nerve/",
    items: [
      {
        label: "Peripheral Neuropathy",
        href: "/conditions/neuropathy-nerve/#peripheral-neuropathy",
      },
      {
        label: "Diabetic Neuropathy",
        href: "/conditions/neuropathy-nerve/#diabetic-neuropathy",
      },
      {
        label: "Chemotherapy-Induced Neuropathy",
        href: "/conditions/neuropathy-nerve/#chemotherapy-induced-neuropathy",
      },
      {
        label: "Burning Feet Syndrome",
        href: "/conditions/neuropathy-nerve/#burning-feet-syndrome",
      },
      {
        label: "Numbness & Tingling",
        href: "/conditions/neuropathy-nerve/#numbness-and-tingling",
      },
    ],
  },
  {
    label: "Spine",
    href: "/conditions/spine/",
    items: [
      { label: "Herniated Disc", href: "/conditions/spine/#herniated-disc" },
      { label: "Bulging Disc", href: "/conditions/spine/#bulging-disc" },
      { label: "Sciatica", href: "/conditions/spine/#sciatica" },
      { label: "Spinal Stenosis", href: "/conditions/spine/#spinal-stenosis" },
      {
        label: "Chronic Low Back Pain",
        href: "/conditions/spine/#chronic-low-back-pain",
      },
      { label: "Neck Pain", href: "/conditions/spine/#neck-pain" },
      {
        label: "Whiplash Injuries",
        href: "/conditions/spine/#whiplash-injuries",
      },
    ],
  },
  {
    label: "Knee & Joint",
    href: "/conditions/knee-joint/",
    items: [
      {
        label: "Knee Osteoarthritis",
        href: "/conditions/knee-joint/#knee-osteoarthritis",
      },
      {
        label: "Chronic Knee Pain",
        href: "/conditions/knee-joint/#chronic-knee-pain",
      },
      {
        label: "Meniscus Irritation",
        href: "/conditions/knee-joint/#meniscus-irritation",
      },
      {
        label: "Patellofemoral Pain Syndrome",
        href: "/conditions/knee-joint/#patellofemoral-pain-syndrome",
      },
      {
        label: "Joint Stiffness",
        href: "/conditions/knee-joint/#joint-stiffness",
      },
    ],
  },
  {
    label: "Joint & Extremity",
    href: "/conditions/joint-extremity/",
    items: [
      { label: "Shoulder Pain", href: "/conditions/joint-extremity/#shoulder-pain" },
      { label: "Frozen Shoulder", href: "/conditions/joint-extremity/#frozen-shoulder" },
      {
        label: "Tennis & Golfer's Elbow",
        href: "/conditions/joint-extremity/#tennis-golfers-elbow",
      },
      {
        label: "Carpal Tunnel Syndrome",
        href: "/conditions/joint-extremity/#carpal-tunnel-syndrome",
      },
      {
        label: "Hip Pain & Arthritis",
        href: "/conditions/joint-extremity/#hip-pain-and-arthritis",
      },
      {
        label: "Plantar Fasciitis",
        href: "/conditions/joint-extremity/#plantar-fasciitis",
      },
    ],
  },
  {
    label: "Muscle & Soft Tissue",
    href: "/conditions/muscle-soft-tissue/",
    items: [
      { label: "Muscle Strains", href: "/conditions/muscle-soft-tissue/#muscle-strains" },
      { label: "Trigger Points", href: "/conditions/muscle-soft-tissue/#trigger-points" },
      {
        label: "Myofascial Pain Syndrome",
        href: "/conditions/muscle-soft-tissue/#myofascial-pain-syndrome",
      },
      {
        label: "Tendinitis & Tendinosis",
        href: "/conditions/muscle-soft-tissue/#tendinitis-and-tendinosis",
      },
      {
        label: "Sports & Overuse Injuries",
        href: "/conditions/muscle-soft-tissue/#sports-and-overuse-injuries",
      },
    ],
  },
  {
    label: "Circulatory & Recovery",
    href: "/conditions/circulatory-recovery/",
    items: [
      {
        label: "Poor Circulation",
        href: "/conditions/circulatory-recovery/#poor-circulation",
      },
      { label: "Leg Swelling", href: "/conditions/circulatory-recovery/#leg-swelling" },
      {
        label: "Athletic Recovery",
        href: "/conditions/circulatory-recovery/#athletic-recovery",
      },
      { label: "Muscle Fatigue", href: "/conditions/circulatory-recovery/#muscle-fatigue" },
    ],
  },
  {
    label: "Headaches",
    href: "/conditions/headaches/",
    items: [
      {
        label: "Cervicogenic Headaches",
        href: "/conditions/headaches/#cervicogenic-headaches",
      },
      { label: "Tension Headaches", href: "/conditions/headaches/#tension-headaches" },
      {
        label: "Neck-Related Migraines",
        href: "/conditions/headaches/#neck-related-migraines",
      },
    ],
  },
  {
    label: "Wellness",
    href: "/conditions/wellness/",
    items: [
      {
        label: "Preventative Chiropractic Care",
        href: "/conditions/wellness/#preventative-chiropractic-care",
      },
      {
        label: "Mobility & Flexibility",
        href: "/conditions/wellness/#mobility-and-flexibility",
      },
      {
        label: "Healthy Aging Support",
        href: "/conditions/wellness/#healthy-aging-support",
      },
      { label: "Fall Prevention", href: "/conditions/wellness/#fall-prevention" },
    ],
  },
];

// Header top-level nav. The Services + Conditions mega menus are the
// two primary discovery surfaces; both are sourced from the clinic's
// service/condition catalogue.
export const HEADER_NAV: HeaderNavItem[] = [
  {
    label: "Services",
    href: "/services/",
    categories: SERVICE_CATEGORIES,
  },
  {
    label: "Conditions",
    href: "/conditions-we-treat/",
    categories: CONDITION_CATEGORIES,
  },
  {
    label: "Car Accident Care",
    href: "/car-accidents-personal-injury/",
  },
  {
    label: "About Us",
    children: [
      { label: "Meet Our Team", href: "/meet-our-team/" },
      { label: "Payment Plans", href: "/payment-plans/" },
      { label: "Reviews", href: "/reviews/" },
      { label: "Blog", href: "/blogs/" },
    ],
  },
  {
    label: "Appointment Request",
    href: "/appointment-request/",
    children: [
      {
        label: "Neuropathy Appointment Request",
        href: "/neuropathy-appointment-request/",
      },
    ],
  },
  { label: "Contact Us", href: "/contact-us/" },
];

// "Our Services" footer column, every individual service leaf page
// (existing + newly added), grouped in the same order as the header
// mega-menu categories.
// "Our Services" footer column, every individual service leaf page,
// grouped in the same order as the header mega-menu categories.
export const FOOTER_SERVICES: NavLink[] = [
  { label: "Chiropractic Care", href: "/chiropractic-care/" },
  { label: "Spinal Decompression Therapy", href: "/spinal-decompression-therapy/" },
  { label: "Knee Decompression Therapy", href: "/knee-decompression-therapy/" },
  { label: "Knee Pain Treatment", href: "/knee-pain-treatment/" },
  { label: "Neuropathy Treatment", href: "/neuropathy-treatment/" },
  { label: "Shockwave Therapy", href: "/shockwave-therapy/" },
  { label: "Laser Therapy", href: "/laser-therapy/" },
  { label: "Compression Therapy", href: "/compression-therapy/" },
];

// "Conditions We Treat" footer column, the 8 dedicated condition
// category pages, same order/labels as the header mega-menu categories.
export const FOOTER_CONDITIONS: NavLink[] = [
  { label: "Spine", href: "/conditions/spine/" },
  { label: "Knee & Joint", href: "/conditions/knee-joint/" },
  { label: "Neuropathy & Nerve", href: "/conditions/neuropathy-nerve/" },
  { label: "Joint & Extremity", href: "/conditions/joint-extremity/" },
  { label: "Muscle & Soft Tissue", href: "/conditions/muscle-soft-tissue/" },
  { label: "Circulatory & Recovery", href: "/conditions/circulatory-recovery/" },
  { label: "Headaches", href: "/conditions/headaches/" },
  { label: "Wellness", href: "/conditions/wellness/" },
];

// Legal links shown in the footer bar, matching the live site.
export const FOOTER_LEGAL: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms & Conditions", href: "/terms-and-conditions/" },
  { label: "HIPAA Privacy Policy", href: "/hippa-privacy-policy/" },
  { label: "No Surprises Act", href: "/no-suprises-act/" },
  { label: "Sitemap", href: "/sitemap/" },
];

// Footer "Get in Touch" CTA band, copy taken verbatim from the live footer.
export const FOOTER_CTA = {
  eyebrow: "Get in Touch",
  heading: "Take the First Step to Better Health",
  body: "Ready to feel your best? Contact Ormond Spine & Nerve Center today to book your appointment or explore our personalized care. Together, we'll help you achieve lasting health and wellness!",
  buttonLabel: "Contact Now",
  buttonHref: "/contact-us/",
};

// Footer brand tagline, taken verbatim from the live footer.
export const FOOTER_TAGLINE =
  "Ormond Spine & Nerve Center delivers advanced medical care with compassion, expertise, and innovation, helping you live healthier and better.";
