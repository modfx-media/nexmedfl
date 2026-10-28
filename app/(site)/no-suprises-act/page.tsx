import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { LegalPageBody } from "@/components/LegalPageBody";
import { NO_SURPRISES_ACT } from "@/lib/legal-content";
import { getStaticPage } from "@/lib/pages";

const PAGE = getStaticPage("/no-suprises-act/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/no-suprises-act/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/no-suprises-act/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <LegalPageBody content={NO_SURPRISES_ACT} />
    </>
    </CMSRoute>
  );
}
