import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildMedicalProcedureSchema, buildFAQSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { getServiceContent } from "@/lib/service-content";
import { ServicePageBody } from "@/components/ServicePageBody";

const PAGE = getStaticPage("/neuropathy-treatment/");
const CONTENT = getServiceContent("/neuropathy-treatment/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/neuropathy-treatment/", buildMetadata({ ...PAGE, image: PAGE.image ?? CONTENT.heroImage }));
}

export default function Page() {
  return (
    <CMSRoute path={"/neuropathy-treatment/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd
        data={buildMedicalProcedureSchema({
          path: PAGE.path,
          name: CONTENT.heading,
          description: PAGE.description,
        })}
      />
      {CONTENT.faqs && <JsonLd data={buildFAQSchema(CONTENT.faqs)} />}
      <ServicePageBody {...CONTENT} />
    </>
    </CMSRoute>
  );
}
