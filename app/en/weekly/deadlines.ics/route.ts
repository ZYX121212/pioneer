import { siteOrigin } from "../../../lib/site";

const calendar = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Pioneer//Founder Opportunity Brief//EN\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
X-WR-CALNAME:Pioneer Founder Opportunity Deadlines\r
BEGIN:VEVENT\r
UID:waic-2026-en@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;VALUE=DATE:20260717\r
DTEND;VALUE=DATE:20260721\r
SUMMARY:WAIC 2026 World Artificial Intelligence Conference\r
DESCRIPTION:Choose one route, list five targets and agree one next step after every useful conversation.\r
URL:${siteOrigin}/en/waic-2026\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:yc-fall-2026-deadline-en@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;TZID=America/Los_Angeles:20260727T200000\r
SUMMARY:Y Combinator Fall 2026 application deadline\r
DESCRIPTION:Check the user problem, demo, progress evidence and founder advantage.\r
URL:${siteOrigin}/en/resources/y-combinator\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:ef-london-fall-2026-deadline-en@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;VALUE=DATE:20260804\r
SUMMARY:Entrepreneur First London final deadline\r
DESCRIPTION:State your strongest ability, non-consensus belief and why you must build now.\r
URL:${siteOrigin}/en/resources/entrepreneur-first-london\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:berkeley-skydeck-batch-23-deadline-en@pioneer\r
DTSTAMP:20260717T000000Z\r
DTSTART;VALUE=DATE:20260821\r
SUMMARY:Berkeley SkyDeck Batch 23 application deadline\r
DESCRIPTION:Assess location and equity costs and define a six-month product milestone.\r
URL:${siteOrigin}/en/resources/berkeley-skydeck-batch-23\r
END:VEVENT\r
END:VCALENDAR\r
`;

export function GET() { return new Response(calendar, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="pioneer-weekly-001-en.ics"', "Cache-Control": "public, max-age=3600" } }); }
