import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { LegalPageBody } from "@/components/LegalPageBody";
import { HIPAA_PRIVACY_POLICY } from "@/lib/legal-content";
import { getStaticPage } from "@/lib/pages";

const PAGE = getStaticPage("/hippa-privacy-policy/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/hippa-privacy-policy/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/hippa-privacy-policy/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <LegalPageBody content={HIPAA_PRIVACY_POLICY} />
    </>
    </CMSRoute>
  );
}
