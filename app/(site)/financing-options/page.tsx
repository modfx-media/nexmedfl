import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildFAQSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { FinancingOptionsPageBody } from "@/components/FinancingOptionsPageBody";
import { FINANCING_FAQS } from "@/lib/financing-content";

const PAGE = getStaticPage("/financing-options/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/financing-options/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/financing-options/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd data={buildFAQSchema(FINANCING_FAQS)} />
      <FinancingOptionsPageBody />
    </>
    </CMSRoute>
  );
}
