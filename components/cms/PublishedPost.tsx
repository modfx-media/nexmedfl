import { BlogPostBody } from "@/components/BlogPostBody";
import { JsonLd } from "@/components/JsonLd";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { cmsDocToBlogEntry } from "@/lib/cms/map-post";
import type { CmsDoc } from "@/lib/cms/types";
import { getPublishedBlogEntries } from "@/lib/ranked/entries";
import { getBlogPostPath } from "@/lib/posts";
import { buildGraph } from "@/lib/schema";
import { SITE_URL } from "@/lib/site-config";

function absoluteImage(image?: string): string | undefined {
  if (!image) return undefined;
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

export async function PublishedPost({ doc }: { doc: CmsDoc }) {
  const post = cmsDocToBlogEntry(doc);
  if (!post) return null;
  const posts = await getPublishedBlogEntries();
  const resolvedPath = doc.path || getBlogPostPath(post);

  return (
    <>
      <JsonLd
        data={buildGraph({
          path: resolvedPath,
          title: post.title,
          description: post.description,
          image: absoluteImage(post.image),
          imageWidth: post.imageWidth,
          imageHeight: post.imageHeight,
          imageCaption: post.imageCaption,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          articleType: "BlogPosting",
          section: post.section,
        })}
      />
      <div data-cms="post">
        {post.body && post.body.length > 0 ? (
          <BlogPostBody post={post} posts={posts} />
        ) : (
          <PagePlaceholder title={post.title} path={resolvedPath} />
        )}
      </div>
    </>
  );
}
