import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Authors } from "./collections/Authors";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";
import { SiteSettings } from "./globals/SiteSettings";
import { getCorsOrigins, getServerURL, isLocalDatabaseHost } from "./lib/cms/server-url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const connectionString = process.env.DATABASE_URL || "";
const onVercel = Boolean(process.env.VERCEL);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Posts, Categories, Authors],
  globals: [Header, Footer, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL: getServerURL(),
  cors: getCorsOrigins(),
  csrf: getCorsOrigins(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 8,
    },
    // Schema changes ship as committed migrations. Push stays off on Vercel.
    push: onVercel ? false : process.env.PAYLOAD_DB_PUSH === "true",
    forceUseVercelPostgres: !isLocalDatabaseHost(connectionString),
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["pages", "posts"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) => (typeof doc?.title === "string" ? doc.title : ""),
      generateDescription: ({ doc }) =>
        typeof doc?.description === "string" ? doc.description : "",
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: "canonicalUrl",
          type: "text",
          label: "Canonical URL",
        },
        {
          name: "noIndex",
          type: "checkbox",
          label: "No index",
          defaultValue: false,
        },
        {
          name: "noFollow",
          type: "checkbox",
          label: "No follow",
          defaultValue: false,
        },
        {
          name: "excludeFromSitemap",
          type: "checkbox",
          label: "Exclude from sitemap",
          defaultValue: false,
        },
      ],
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
