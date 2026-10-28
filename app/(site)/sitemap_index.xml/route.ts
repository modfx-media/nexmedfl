import { SITE_URL } from "@/lib/site-config";

// Legacy WP/Rank Math URL, kept for back-compat (e.g. existing external
// links/search console history). Same content as the standard /sitemap.xml.
export async function GET() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/post-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/page-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
