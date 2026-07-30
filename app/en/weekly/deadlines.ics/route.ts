import { siteOrigin } from "../../../lib/site";

const calendar = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Pioneer//Founder Opportunity Brief//EN\r
CALSCALE:GREGORIAN\r
METHOD:PUBLISH\r
X-WR-CALNAME:Pioneer Founder Opportunity Deadlines\r
BEGIN:VEVENT\r
UID:ef-london-fall-2026-deadline-en@pioneer\r
DTSTAMP:20260730T000000Z\r
DTSTART;VALUE=DATE:20260804\r
SUMMARY:Entrepreneur First London final deadline\r
DESCRIPTION:State your strongest ability, non-consensus belief and why you must build now.\r
URL:${siteOrigin}/en/resources/entrepreneur-first-london\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:berkeley-skydeck-batch-23-deadline-en@pioneer\r
DTSTAMP:20260730T000000Z\r
DTSTART;VALUE=DATE:20260821\r
SUMMARY:Berkeley SkyDeck Batch 23 application deadline\r
DESCRIPTION:Assess location and equity costs and define a six-month product milestone.\r
URL:${siteOrigin}/en/resources/berkeley-skydeck-batch-23\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:techbbq-2026-en@pioneer\r
DTSTAMP:20260730T000000Z\r
DTSTART;VALUE=DATE:20260826\r
DTEND;VALUE=DATE:20260828\r
SUMMARY:TechBBQ 2026\r
DESCRIPTION:List target institutions and pre-book at least six meetings tied to Nordic market, capital or partnership goals.\r
URL:${siteOrigin}/en/resources/techbbq-2026\r
END:VEVENT\r
END:VCALENDAR\r
`;

export function GET() { return new Response(calendar, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="pioneer-weekly-002-en.ics"', "Cache-Control": "public, max-age=3600" } }); }
