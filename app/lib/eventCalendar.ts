import type { Resource } from "../data/resources";
import { resourceFreshness } from "./resourceFreshness";
export function eventCalendarDates(r: Resource) {
  const end = r.eventWindow?.lastDay;
  const first = r.highlights.find(x => /活动日期|Dates/.test(x.label))?.value.match(/\d{4}[.-]\d{2}[.-]\d{2}/)?.[0].replaceAll(".", "-");
  if (!first || !end || !/^\d{4}-\d{2}-\d{2}$/.test(end) || !Number.isFinite(Date.parse(end)) || new Date(end).toISOString().slice(0,10) !== end || !Number.isFinite(Date.parse(first)) || new Date(first).toISOString().slice(0,10) !== first || first > end) return undefined;
  return { start: first, end: new Date(Date.parse(end + "T00:00:00Z") + 86400000).toISOString().slice(0,10) };
}
const escape = (s: string) => s.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");
// Fold by UTF-8 octets, never splitting a multibyte character (RFC 5545).
function fold(line: string) { let out = "", n = 0; for (const c of line) { const size = new TextEncoder().encode(c).length; if (n + size > 75) { out += "\r\n "; n = 1; } out += c; n += size; } return out; }
export function eventCalendar(r: Resource, lang: "zh" | "en", alarm?: 1 | 7, now = new Date()) {
  const dates = eventCalendarDates(r);
  if (r.type !== "event" || resourceFreshness(r,now) !== "reviewed" || !dates) return undefined;
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const description = lang === "en" ? `Date-only event in ${r.eventWindow!.timeZone}. Confirm pass access and schedule on the official site. Import this file into your calendar; alerts depend on your calendar settings.` : `活动举办地时区：${r.eventWindow!.timeZone}。仅标记活动日期，请在官网核对票种与日程。导入日历后，提醒由日历应用及其设置决定。`;
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Pioneer//Founder Events//EN","CALSCALE:GREGORIAN","BEGIN:VEVENT",`UID:${r.slug}@pioneer-events`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${dates.start.replaceAll("-","")}`,`DTEND;VALUE=DATE:${dates.end.replaceAll("-","")}`,`SUMMARY:${escape(r.name)}`,`LOCATION:${escape(r.location)}`,`DESCRIPTION:${escape(description)}`,`URL:${escape(r.url)}`];
  if (alarm) lines.push("BEGIN:VALARM",`TRIGGER:-P${alarm}D`,"ACTION:DISPLAY",`DESCRIPTION:${escape(r.name)}`,"END:VALARM");
  lines.push("END:VEVENT","END:VCALENDAR"); return lines.map(fold).join("\r\n") + "\r\n";
}
export function eventCalendarResponse(request: Request, r: Resource | undefined, lang: "zh" | "en") {
  if (!r || r.type !== "event") return new Response("Event not found", {status:404});
  const alarm = new URL(request.url).searchParams.get("alarm");
  if (alarm !== null && alarm !== "1" && alarm !== "7") return new Response("Invalid reminder interval",{status:400});
  const content = eventCalendar(r,lang,alarm ? Number(alarm) as 1|7 : undefined);
  if (!content) return new Response(lang === "en" ? "This edition has ended or its dates need rechecking. No actionable calendar is available." : "本届已结束或日期需重新核验，暂不提供行动日历。",{status:410,headers:{"Cache-Control":"no-store"}});
  return new Response(content,{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":`attachment; filename="pioneer-${r.slug}${alarm ? `-reminder-${alarm}d` : ""}.ics"`,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
}
