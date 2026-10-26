import type { GlobalConfig } from "payload";

import { authenticated, globalVersions } from "@/collections/shared";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: () => true,
    update: authenticated,
  },
  versions: globalVersions,
  fields: [
    { name: "siteName", type: "text" },
    { name: "description", type: "textarea" },
    { name: "phone", type: "text" },
    { name: "email", type: "text" },
    { name: "address", type: "textarea" },
  ],
};
