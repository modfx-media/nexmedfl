import type { CollectionConfig } from "payload";

import { authenticated } from "./shared";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    useAsTitle: "alt",
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    staticDir: "media",
  },
};
