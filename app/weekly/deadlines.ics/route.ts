import { siteOrigin } from "../../lib/site";

const calendar = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Pioneer//Founder Opportunity Brief//ZH-CN\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
X-WR-CALNAME:Pioneer 创业机会截止日\r
BEGIN:VEVENT\r
UID:waic-2026@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;VALUE=DATE:20260717\r
DTEND;VALUE=DATE:20260721\r
SUMMARY:WAIC 2026 世界人工智能大会\r
DESCRIPTION:Pioneer 本周机会：选定路线、列出联系人，并为每次交流约定后续动作。\r
URL:${siteOrigin}/waic-2026\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:yc-fall-2026-deadline@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;TZID=America/Los_Angeles:20260727T200000\r
SUMMARY:Y Combinator Fall 2026 申请截止\r
DESCRIPTION:提交前检查：用户问题、产品演示、进展证据与创始团队优势。\r
URL:${siteOrigin}/resources/y-combinator\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:ef-london-fall-2026-deadline@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;VALUE=DATE:20260804\r
SUMMARY:Entrepreneur First London 最终截止\r
DESCRIPTION:提交前写清最强能力、非共识判断，以及为什么必须现在创业。\r
URL:${siteOrigin}/resources/entrepreneur-first-london\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:berkeley-skydeck-batch-23-deadline@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;VALUE=DATE:20260821\r
SUMMARY:Berkeley SkyDeck Batch 23 申请截止\r
DESCRIPTION:提交前核算驻场与股权成本，并准备六个月可验证的产品里程碑。\r
URL:${siteOrigin}/resources/berkeley-skydeck-batch-23\r
END:VEVENT\r
END:VCALENDAR\r
`;

export function GET() {
  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pioneer-weekly-001.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
