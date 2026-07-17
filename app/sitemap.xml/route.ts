import { pioneerGuides } from "../data/knowledge";
import { resources } from "../data/resources";
import { siteOrigin } from "../lib/site";

const staticPaths = [
  "",
  "/programs",
  "/organizations",
  "/events",
  "/startups",
  "/knowledge",
  "/weekly",
  "/submit",
  "/waic-2026",
  "/en",
  "/en/submit",
  "/en/programs",
  "/en/organizations",
  "/en/events",
  "/en/startups",
];

export async function GET() {
  const resourcePaths = resources.flatMap((resource) => [
    resource.detailPath ?? `/resources/${resource.slug}`,
    `/en/resources/${resource.slug}`,
  ]);
  const guidePaths = pioneerGuides.map((guide) => `/knowledge/${guide.slug}`);
  const paths = [...new Set([...staticPaths, ...resourcePaths, ...guidePaths])];
  const urls = paths.map((path) => {
    const frequency = path.includes("/resources/") ? "monthly" : "weekly";
    const priority = path === "" ? "1.0" : path.includes("/resources/") ? "0.7" : "0.8";
    return `<url><loc>${siteOrigin}${path}</loc><lastmod>2026-07-17</lastmod><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
