import type { Metadata } from "next";

import { SITE_DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DEFAULT_DESCRIPTION,
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[40vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-ink-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">This page could not be found.</h1>
    </main>
  );
}
