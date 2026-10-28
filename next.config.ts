import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The live WordPress site serves every URL with a trailing slash
  // (e.g. /payment-plans/). This preserves those exact URLs with no
  // redirects, protecting current SEO rankings.
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  // Keep cron/webhook bundles small: never file-trace public media.
  outputFileTracingExcludes: {
    "*": [
      "./public/images/**",
      "./public/**/*.mp4",
      "./public/**/*.webm",
    ],
  },
  // Sharp's linux binaries are optional dependencies and are otherwise
  // omitted from the Vercel trace, which crashes /admin on image reads.
  outputFileTracingIncludes: {
    "/admin/**/*": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
  serverExternalPackages: [
    "pg",
    "@payloadcms/db-vercel-postgres",
    "@neondatabase/serverless",
    "@vercel/postgres",
  ],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
