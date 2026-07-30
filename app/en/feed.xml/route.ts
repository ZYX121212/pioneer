import { siteOrigin } from "../../lib/site";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Pioneer Weekly Founder Opportunities</title><link>${siteOrigin}/en/weekly</link>
<description>One weekly selection of programs, events and institution changes worth founder action.</description><language>en</language>
<atom:link href="${siteOrigin}/en/feed.xml" rel="self" type="application/rss+xml" />
<item><title>4 startup opportunities worth acting on | 2026.07.30</title><link>${siteOrigin}/en/weekly</link><guid isPermaLink="true">${siteOrigin}/en/weekly</guid><pubDate>Thu, 30 Jul 2026 00:00:00 GMT</pubDate><description>Entrepreneur First, Berkeley SkyDeck, AWS Activate and TechBBQ: why now, who it fits and what to do today.</description></item>
</channel></rss>`;

export function GET() { return new Response(feed, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }); }
