import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { SitemapPageBody } from "@/components/SitemapPageBody";
import { getPublishedBlogEntries } from "@/lib/ranked/entries";

export const revalidate = 3600;

const PAGE = getStaticPage("/sitemap/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/sitemap/", buildMetadata(PAGE));
}

export default async function Page() {
  const posts = await getPublishedBlogEntries();

  return (
    <CMSRoute path={"/sitemap/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <SitemapPageBody posts={posts} />
    </>
    </CMSRoute>
  );
}
