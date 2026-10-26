import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CMSRoute } from "@/components/cms/CMSRoute";
import { resolvePostMetadata } from "@/lib/cms/metadata";
import { getPostByPath } from "@/lib/cms/queries";
import { buildMetadata } from "@/lib/seo";
import { buildGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { BlogPostBody } from "@/components/BlogPostBody";
import { getBlogPostPath } from "@/lib/posts";
import {
  findPublishedBlogPost,
  getPublishedBlogEntries,
  getPublishedBlogEntryParams,
} from "@/lib/ranked/entries";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600;

// JSON-LD requires a fully-qualified image URL; post.image may be a
// relative local path (e.g. "/images/blog/...") for posts using locally
// hosted images, or already-absolute for legacy externally hosted images.
function absoluteImage(image?: string): string | undefined {
  if (!image) return undefined;
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

export async function generateStaticParams() {
  return getPublishedBlogEntryParams().catch(() => []);
}

// New Ranked slugs must resolve before the next full build.
export const dynamicParams = true;

export async function generateMetadata(
  props: PageProps<"/blogs/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await findPublishedBlogPost(slug);
  const path = `/blogs/${slug}/`;
  const fallback = post
    ? buildMetadata({
        path: getBlogPostPath(post),
        title: post.metaTitle ?? post.title,
        description: post.description,
        image: post.image,
        type: "article",
      })
    : {};
  return resolvePostMetadata(path, fallback);
}

export default async function BlogPostPage(
  props: PageProps<"/blogs/[slug]">
) {
  const { slug } = await props.params;
  const path = `/blogs/${slug}/`;
  const [post, posts] = await Promise.all([
    findPublishedBlogPost(slug),
    getPublishedBlogEntries(),
  ]);
  if (!post) {
    const cmsPost = await getPostByPath(path);
    if (!cmsPost) notFound();
    return (
      <CMSRoute path={path} kind="post">
        {null}
      </CMSRoute>
    );
  }

  return (
    <CMSRoute path={path} kind="post">
    <>
      <JsonLd
        data={buildGraph({
          path,
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
      {post.body ? (
        <BlogPostBody post={post} posts={posts} />
      ) : (
        <PagePlaceholder title={post.title} path={path} />
      )}
    </>
    </CMSRoute>
  );
}
