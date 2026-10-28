import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CareerOpportunitiesPageBody } from "@/components/CareerOpportunitiesPageBody";
import { getStaticPage } from "@/lib/pages";

const PAGE = getStaticPage("/career-opportunities/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/career-opportunities/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/career-opportunities/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <CareerOpportunitiesPageBody />
    </>
    </CMSRoute>
  );
}
