import type { CollectionConfig } from "payload";

import { previewURL } from "@/lib/cms/preview";

import {
  authenticated,
  contentVersions,
  emptyToNull,
  publishedOrAuthenticated,
  slugifyFromName,
} from "./shared";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "path", "_status", "updatedAt"],
    preview: (doc) => previewURL(typeof doc?.path === "string" ? doc.path : null),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  versions: contentVersions,
  defaultSort: "-datePublished",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "searchTitle",
      type: "text",
      admin: {
        description: "Search and social title when it should differ from the on-page title.",
      },
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
        description: "Public path, for example /blogs/your-post/. Optional at create.",
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
      name: "section",
      type: "text",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imagePath",
      type: "text",
    },
    {
      name: "imageCaption",
      type: "text",
    },
    {
      name: "imageWidth",
      type: "text",
    },
    {
      name: "imageHeight",
      type: "text",
    },
    {
      name: "datePublished",
      type: "date",
    },
    {
      name: "dateModified",
      type: "date",
    },
    {
      name: "relatedServiceHref",
      type: "text",
    },
    {
      name: "relatedServiceLabel",
      type: "text",
    },
    {
      name: "body",
      type: "array",
      fields: [
        {
          name: "heading",
          type: "text",
        },
        {
          name: "paragraphs",
          type: "array",
          fields: [
            {
              name: "text",
              type: "textarea",
              required: true,
            },
          ],
        },
        {
          name: "bullets",
          type: "array",
          fields: [
            {
              name: "text",
              type: "textarea",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
