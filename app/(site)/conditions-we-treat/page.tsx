import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildMedicalWebPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { ConditionsHub } from "@/components/ConditionsHub";
import { CONDITIONS_INTRO, CONDITION_CATEGORIES } from "@/lib/conditions-content";

const PAGE = getStaticPage("/conditions-we-treat/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/conditions-we-treat/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/conditions-we-treat/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd
        data={buildMedicalWebPageSchema({
          path: PAGE.path,
          name: PAGE.title,
          description: PAGE.description,
        })}
      />
      <ConditionsHub intro={CONDITIONS_INTRO} categories={CONDITION_CATEGORIES} />
    </>
    </CMSRoute>
  );
}
