import { buildWeeklyFeed } from "../../data/weekly";
import { siteOrigin } from "../../lib/site";
export function GET() {
  return new Response(buildWeeklyFeed("en", siteOrigin), { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
