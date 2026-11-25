import { publicSitemapLocs, selectPublicPosts } from "@/lib/cms/publish-window";
import { getCmsSitemapEntries } from "@/lib/cms/sitemap";
import { SITE_URL } from "@/lib/site-config";
import { BLOG_POSTS, getBlogPostPath } from "@/lib/posts";
import { getPublishedBlogEntries } from "@/lib/ranked/entries";

// Short ISR so a scheduled post is added after datePublished without a redeploy.
export const revalidate = 300;

// Mirrors the live site's Rank Math "post-sitemap.xml" (blog posts only).
export async function GET() {
  const posts = await getPublishedBlogEntries();
  const baseline = new Set(BLOG_POSTS.map((post) => getBlogPostPath(post)));
  const extras = await getCmsSitemapEntries("posts");
  const extraPaths = new Set(
    extras.map((entry) => entry.path).filter((path) => !baseline.has(path)),
  );
  const visible = selectPublicPosts(
    posts.filter((post) => {
      const path = getBlogPostPath(post);
      return baseline.has(path) || extraPaths.has(path);
    }),
    { draft: false },
  );
  const locs = publicSitemapLocs(visible, { origin: SITE_URL, draft: false });
  const urls = visible.map(
    (post, index) => `  <url>
    <loc>${locs[index]}</loc>
    <lastmod>${post.dateModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
