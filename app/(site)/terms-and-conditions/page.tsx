import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { LegalPageBody } from "@/components/LegalPageBody";
import { TERMS_CONDITIONS } from "@/lib/legal-content";

const PAGE = getStaticPage("/terms-and-conditions/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/terms-and-conditions/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/terms-and-conditions/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <LegalPageBody content={TERMS_CONDITIONS} />
    </>
    </CMSRoute>
  );
}
