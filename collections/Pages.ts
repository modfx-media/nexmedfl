import type { CollectionConfig } from "payload";

import { previewURL } from "@/lib/cms/preview";

import {
  authenticated,
  contentVersions,
  emptyToNull,
  publishedOrAuthenticated,
  slugifyFromName,
} from "./shared";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "path", "slug", "_status", "updatedAt"],
    preview: (doc) => previewURL(typeof doc?.path === "string" ? doc.path : null),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  versions: contentVersions,
  fields: [
    {
      name: "title",
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
      name: "path",
      type: "text",
      unique: true,
      index: true,
      required: false,
      admin: {
        description:
          "Public path with a leading and trailing slash, for example /contact-us/. Optional until you are ready to attach this doc to a URL.",
      },
      hooks: {
        beforeValidate: [emptyToNull],
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
    {
      name: "sourceUrl",
      type: "text",
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [emptyToNull],
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "imagePath",
      type: "text",
      admin: {
        description: "Existing public image path, for example /images/og-default.jpg.",
      },
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "datePublished",
      type: "date",
    },
    {
      name: "dateModified",
      type: "date",
    },
  ],
};
