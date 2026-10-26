import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildBreadcrumbSchema, buildMedicalConditionsSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ConditionCategoryPage } from "@/components/conditions/ConditionCategoryPage";
import { getConditionPage, getOtherConditionPages } from "@/lib/condition-pages-content";

const PAGE = getConditionPage("knee-joint")!;

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata(PAGE.path, buildMetadata({
  path: PAGE.path,
  title: PAGE.metaTitle,
  description: PAGE.metaDescription,
}));
}

export default function Page() {
  return (
    <CMSRoute path={PAGE.path}>
    <>
      <JsonLd
        data={buildGraph({ path: PAGE.path, title: PAGE.metaTitle, description: PAGE.metaDescription })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Conditions", path: "/conditions-we-treat/" },
          { name: PAGE.navLabel, path: PAGE.path },
        ])}
      />
      <JsonLd
        data={buildMedicalConditionsSchema(
          PAGE.sections.map((section) => ({
            name: section.label,
            description: section.description,
            path: `${PAGE.path}#${section.slug}`,
          })),
        )}
      />
      <ConditionCategoryPage page={PAGE} otherPages={getOtherConditionPages(PAGE.slug)} />
    </>
    </CMSRoute>
  );
}
