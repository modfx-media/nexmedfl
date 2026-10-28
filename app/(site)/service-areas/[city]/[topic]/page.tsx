import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePageMetadata } from "@/lib/cms/metadata";
import { buildMetadata } from "@/lib/seo";
import {
  buildGraph,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildMedicalWebPageSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ServiceAreaPageBody } from "@/components/service-areas/ServiceAreaPageBody";
import {
  SERVICE_AREA_CITIES,
  SERVICE_AREA_TOPICS,
  getCityFaqs,
  getServiceAreaCity,
  getServiceAreaTopic,
} from "@/lib/service-area-content";

export function generateStaticParams() {
  return SERVICE_AREA_CITIES.flatMap((city) =>
    SERVICE_AREA_TOPICS.map((topic) => ({ city: city.slug, topic: topic.slug })),
  );
}

// Only the generated city x topic combinations above are valid; any
// other slug pair should 404 instead of being treated as a dynamic route.
export const dynamicParams = false;

function resolveParams(params: { city: string; topic: string }) {
  const city = getServiceAreaCity(params.city);
  const topic = getServiceAreaTopic(params.topic);
  return { city, topic };
}

export async function generateMetadata(
  props: PageProps<"/service-areas/[city]/[topic]">
): Promise<Metadata> {
  const { city, topic } = resolveParams(await props.params);
  if (!city || !topic) return {};
  const path = `/service-areas/${city.slug}/${topic.slug}/`;
  const title = `${topic.label} in ${city.name}, FL | Ormond Spine & Nerve Center`;
  const description = `${topic.label} for ${city.name}, FL patients at Ormond Spine & Nerve Center, about ${city.driveMinutes === 0 ? "right in town" : `a ${city.driveMinutes}-minute drive`}. Book your appointment today!`;
  return resolvePageMetadata(
    path,
    buildMetadata({
      path,
      title,
      description,
    }),
  );
}

export default async function Page(
  props: PageProps<"/service-areas/[city]/[topic]">
) {
  const { city, topic } = resolveParams(await props.params);
  if (!city || !topic) notFound();

  const title = `${topic.label} in ${city.name}, FL | Ormond Spine & Nerve Center`;
  const description = `${topic.label} for ${city.name}, FL patients at Ormond Spine & Nerve Center, about ${city.driveMinutes === 0 ? "right in town" : `a ${city.driveMinutes}-minute drive`}. Book your appointment today!`;
  const faqs = [...getCityFaqs(city, topic), ...topic.faqs];

  const path = `/service-areas/${city.slug}/${topic.slug}/`;

  return (
    <CMSRoute path={path}>
    <>
      <JsonLd
        data={buildGraph({
          path: `/service-areas/${city.slug}/${topic.slug}/`,
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
          { name: topic.label, path: `/service-areas/${city.slug}/${topic.slug}/` },
        ])}
      />
      <JsonLd
        data={buildMedicalWebPageSchema({
          path: `/service-areas/${city.slug}/${topic.slug}/`,
          name: title,
          description,
        })}
      />
      <JsonLd data={buildFAQSchema(faqs)} />
      <ServiceAreaPageBody city={city} topic={topic} />
    </>
    </CMSRoute>
  );
}
