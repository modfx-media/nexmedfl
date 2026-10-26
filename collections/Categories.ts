import type { CollectionConfig } from "payload";

import { authenticated, emptyToNull, slugifyFromName } from "./shared";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [emptyToNull, slugifyFromName],
      },
    },
    {
      name: "legacyId",
      type: "text",
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [emptyToNull],
      },
    },
  ],
};
