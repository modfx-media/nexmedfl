import { RichText } from "@payloadcms/richtext-lexical/react";

import { JsonLd } from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import { hasLexicalContent, type CmsDoc } from "@/lib/cms/types";

export function PublishedPage({ doc }: { doc: CmsDoc }) {
  const path = doc.path || "/";
  const title = doc.title || "Untitled";
  const description = doc.meta?.description || doc.description || "";

  return (
    <>
      <JsonLd
        data={buildGraph({
          path,
          title: doc.meta?.title || title,
          description,
          datePublished: doc.datePublished || undefined,
          dateModified: doc.dateModified || doc.updatedAt || undefined,
        })}
      />
      <main data-cms="page" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-[15px] leading-[1.8] text-ink-soft">{description}</p>
        ) : null}
        {hasLexicalContent(doc.content) ? (
          <div className="mt-8 space-y-4 text-[15px] leading-[1.8] text-ink-soft [&_a]:font-semibold [&_a]:text-brand-deep [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-4">
            <RichText data={doc.content as never} />
          </div>
        ) : null}
      </main>
    </>
  );
}
