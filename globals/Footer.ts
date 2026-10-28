import type { GlobalConfig } from "payload";

import { authenticated, globalVersions } from "@/collections/shared";

const linkFields = [
  { name: "label", type: "text" as const },
  { name: "href", type: "text" as const },
];

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: {
    read: () => true,
    update: authenticated,
  },
  versions: globalVersions,
  fields: [
    { name: "tagline", type: "textarea" },
    { name: "ctaEyebrow", type: "text" },
    { name: "ctaHeading", type: "text" },
    { name: "ctaBody", type: "textarea" },
    { name: "ctaButtonLabel", type: "text" },
    { name: "ctaButtonHref", type: "text" },
    { name: "serviceLinks", type: "array", fields: linkFields },
    { name: "conditionLinks", type: "array", fields: linkFields },
    { name: "legalLinks", type: "array", fields: linkFields },
  ],
};
