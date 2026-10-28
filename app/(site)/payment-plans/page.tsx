import type { Metadata } from "next";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildFAQSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { getStaticPage } from "@/lib/pages";
import { PaymentPlansPageBody } from "@/components/PaymentPlansPageBody";
import { PAYMENT_PLANS_FAQS } from "@/lib/payment-content";

const PAGE = getStaticPage("/payment-plans/");

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/payment-plans/", buildMetadata(PAGE));
}

export default function Page() {
  return (
    <CMSRoute path={"/payment-plans/"}>
    <>
      <JsonLd data={buildGraph(PAGE)} />
      <JsonLd data={buildFAQSchema(PAYMENT_PLANS_FAQS)} />
      <PaymentPlansPageBody />
    </>
    </CMSRoute>
  );
}
