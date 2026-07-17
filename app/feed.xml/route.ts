import { siteOrigin } from "../lib/site";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pioneer 本周创业机会</title>
    <link>${siteOrigin}/weekly</link>
    <description>每周只选择真正值得创业者行动的计划、活动和机构变化。</description>
    <language>zh-CN</language>
    <atom:link href="${siteOrigin}/feed.xml" rel="self" type="application/rss+xml" />
    <item>
      <title>本周值得行动的 4 个创业机会｜2026.07.17</title>
      <link>${siteOrigin}/weekly</link>
      <guid isPermaLink="true">${siteOrigin}/weekly</guid>
      <pubDate>Fri, 17 Jul 2026 00:00:00 GMT</pubDate>
      <description>WAIC、Y Combinator、Entrepreneur First 与 Berkeley SkyDeck：为什么现在值得看、适合谁，以及今天应该完成什么。</description>
    </item>
  </channel>
</rss>`;

export function GET() {
  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
