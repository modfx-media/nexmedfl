import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { AppointmentRequestPageBody } from "@/components/AppointmentRequestPageBody";

const PAGE = getStaticPage("/appointment-request/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/appointment-request/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/appointment-request/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <AppointmentRequestPageBody />
    </>
    </CMSRoute>
  );
}
