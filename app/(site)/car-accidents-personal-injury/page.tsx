import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildMedicalProcedureSchema, buildFAQSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { getServiceContent } from "@/lib/service-content";
import { ServicePageBody } from "@/components/ServicePageBody";

const PAGE = getStaticPage("/car-accidents-personal-injury/");
const CONTENT = getServiceContent("/car-accidents-personal-injury/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/car-accidents-personal-injury/", buildMetadata({ ...PAGE, image: PAGE.image ?? CONTENT.heroImage }));
}

export default function Page() {
  return (
    <CMSRoute path={"/car-accidents-personal-injury/"}>
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
