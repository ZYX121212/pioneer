import { siteOrigin } from "../../lib/site";

const calendar = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Pioneer//Founder Opportunity Brief//ZH-CN\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
X-WR-CALNAME:Pioneer 创业机会截止日\r
BEGIN:VEVENT\r
UID:ef-london-fall-2026-deadline@pioneer\r
DTSTAMP:20260730T000000Z\r
DTSTART;VALUE=DATE:20260804\r
SUMMARY:Entrepreneur First London 最终截止\r
DESCRIPTION:提交前写清最强能力、非共识判断，以及为什么必须现在创业。\r
URL:${siteOrigin}/resources/entrepreneur-first-london\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:berkeley-skydeck-batch-23-deadline@pioneer\r
DTSTAMP:20260730T000000Z\r
DTSTART;VALUE=DATE:20260821\r
SUMMARY:Berkeley SkyDeck Batch 23 申请截止\r
DESCRIPTION:提交前核算驻场与股权成本，并准备六个月可验证的产品里程碑。\r
URL:${siteOrigin}/resources/berkeley-skydeck-batch-23\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:techbbq-2026@pioneer\r
DTSTAMP:20260730T000000Z\r
DTSTART;VALUE=DATE:20260826\r
DTEND;VALUE=DATE:20260828\r
SUMMARY:TechBBQ 2026\r
DESCRIPTION:提前列出目标机构，并约定至少 6 场与北欧市场、融资或合作直接相关的会面。\r
URL:${siteOrigin}/resources/techbbq-2026\r
END:VEVENT\r
END:VCALENDAR\r
`;

export function GET() {
  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pioneer-weekly-002.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
