import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildLocalBusinessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { ContactUsPageBody } from "@/components/ContactUsPageBody";

const PAGE = getStaticPage("/contact-us/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/contact-us/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/contact-us/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd data={buildLocalBusinessSchema()} />
      <ContactUsPageBody />
    </>
    </CMSRoute>
  );
}
