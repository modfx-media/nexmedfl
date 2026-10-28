import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildBreadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { AreasWeServeHub } from "@/components/service-areas/AreasWeServeHub";

const PATH = "/service-areas/";
const TITLE = "Areas We Serve | Ormond Spine & Nerve Center";
const DESCRIPTION =
  "Ormond Spine & Nerve Center serves patients across Volusia & Flagler County, FL, including Ormond Beach, Daytona Beach, Palm Coast, DeLand & more. Find your area.";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata(PATH, buildMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
}));
}

export default function Page() {
  return (
    <CMSRoute path={PATH}>
    <>
      <JsonLd
        data={buildGraph({
          path: PATH,
          title: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-08-20T00:00:00+00:00",
          dateModified: "2026-08-20T00:00:00+00:00",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Areas We Serve", path: PATH },
        ])}
      />
      <AreasWeServeHub />
    </>
    </CMSRoute>
  );
}
