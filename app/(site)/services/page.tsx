import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildMedicalWebPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { ServicesHub } from "@/components/ServicesHub";

const PAGE = getStaticPage("/services/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/services/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/services/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd
        data={buildMedicalWebPageSchema({
          path: PAGE.path,
          name: PAGE.title,
          description: PAGE.description,
        })}
      />
      <ServicesHub />
    </>
    </CMSRoute>
  );
}
