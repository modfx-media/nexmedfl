import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import { buildGraph, buildBreadcrumbSchema, buildFAQSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CityOverviewPageBody } from "@/components/service-areas/CityOverviewPageBody";
import {
  SERVICE_AREA_CITIES,
  SERVICE_AREA_TOPICS,
  getCityFaqs,
  getServiceAreaCity,
} from "@/lib/service-area-content";

export function generateStaticParams() {
  return SERVICE_AREA_CITIES.map((city) => ({ city: city.slug }));
}

// Only the known cities above are valid; any other slug should 404
// instead of being treated as a dynamic route.
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/service-areas/[city]">
): Promise<Metadata> {
  const { city: citySlug } = await props.params;
  const city = getServiceAreaCity(citySlug);
  if (!city) return {};
  const path = `/service-areas/${city.slug}/`;
  const title = `Chiropractor & Pain Relief Care in ${city.name}, FL | Ormond Spine & Nerve Center`;
  const description = `Ormond Spine & Nerve Center serves ${city.name}, FL with chiropractic care, spinal & knee decompression, neuropathy treatment & more. Book your visit today!`;
  return resolvePageMetadata(
    path,
    buildMetadata({
      path,
      title,
      description,
    }),
  );
}

export default async function Page(props: PageProps<"/service-areas/[city]">) {
  const { city: citySlug } = await props.params;
  const city = getServiceAreaCity(citySlug);
  if (!city) notFound();

  const title = `Chiropractor & Pain Relief Care in ${city.name}, FL | Ormond Spine & Nerve Center`;
  const description = `Ormond Spine & Nerve Center serves ${city.name}, FL with chiropractic care, spinal & knee decompression, neuropathy treatment & more. Book your visit today!`;
  const faqs = getCityFaqs(city, SERVICE_AREA_TOPICS[0]);

  const path = `/service-areas/${city.slug}/`;

  return (
    <CMSRoute path={path}>
    <>
      <JsonLd
        data={buildGraph({
          path: `/service-areas/${city.slug}/`,
          title,
          description,
          datePublished: "2026-08-20T00:00:00+00:00",
          dateModified: "2026-08-20T00:00:00+00:00",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Areas We Serve", path: "/service-areas/" },
          { name: city.name, path: `/service-areas/${city.slug}/` },
        ])}
      />
      <JsonLd data={buildFAQSchema(faqs)} />
      <CityOverviewPageBody city={city} />
    </>
    </CMSRoute>
  );
}
