import type { Resource } from "../data/resources";
import { resourceFreshness } from "./resourceFreshness";
export type ProgramStatus = "open" | "closing" | "rolling" | "review" | "archived" | "info";
export function programDeadline(resource: Resource): string | undefined {
  return resource.highlights.find(h => /截止|deadline|cutoff/i.test(h.label))?.value;
}
export function programStatus(resource: Resource, now = new Date()): ProgramStatus {
  const freshness = resourceFreshness(resource, now);
  if (freshness === "historical") return "archived";
  const deadline = programDeadline(resource);
  const date = deadline?.match(/\d{4}[.-]\d{2}[.-]\d{2}/)?.[0].replaceAll(".", "-");
  const day = date ? Date.parse(`${date}T00:00:00Z`) : NaN;
  const validDay = Number.isFinite(day) && new Date(day).toISOString().slice(0, 10) === date;
  // PT uses Los Angeles DST rules; never assume a fixed UTC offset.
  const time = deadline?.match(/(\d{1,2}):(\d{2})\s*(PT|UTC|GMT|HKT|SGT|CST)\b/i);
  let instant = NaN;
  if (validDay && time && Number(time[1]) < 24 && Number(time[2]) < 60) {
    const hours = Number(time[1]), minutes = Number(time[2]), zone = time[3].toUpperCase();
    const target = day + (hours * 60 + minutes) * 60000;
    if (zone === "PT") {
      const guess = target + 8 * 3600000;
      const parts = new Intl.DateTimeFormat("en", { timeZone: "America/Los_Angeles", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(guess));
      const part = (type: string) => parts.find(p => p.type === type)?.value;
      const local = Date.parse(`${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}:00Z`);
      instant = guess + target - local;
    } else if (zone === "UTC" || zone === "GMT") instant = target;
    else if (zone === "HKT" || zone === "SGT") instant = target - 8 * 3600000;
    // CST alone is ambiguous; do not invent a timezone.
  }
  if (Number.isFinite(instant) && now.getTime() >= instant) return "archived";
  if (validDay && !Number.isFinite(instant) && now.getTime() >= day) return "review";
  if (freshness === "needs-review" || resource.verification === "link-only") return "review";
  const status = resource.status;
  const closingTime = Number.isFinite(instant) ? instant : validDay ? day : NaN;
  if (/持续|全年|rolling/i.test(status)) return "rolling";
  if (/开放|可申请|申请中|\bopen\b|\bapplications?\b|Winter 2027 申请|即将截止|closing soon/i.test(status)) {
    if (Number.isFinite(closingTime) && closingTime >= now.getTime() && closingTime - now.getTime() <= 14 * 86400000) return "closing";
    return "open";
  }
  return "info";
}
export function programFunding(resource: Resource): "cash" | "credits" | "unspecified" {
  if (/云|cloud|credits/i.test(resource.kind)) return "credits";
  return resource.highlights.some(h => /资金|投资|资助|funding|investment|grant/i.test(h.label) && /\d|资金|资助|投资|cash|fund/i.test(h.value)) ? "cash" : "unspecified";
}
export function programFormat(resource: Resource): "online" | "onsite" | "hybrid" | "unspecified" {
  const documented = resource.highlights.filter(h => /参与|形式|方式|format/i.test(h.label)).map(h => h.value).join(" ");
  const text = `${documented} ${resource.description}`;
  if (/混合|hybrid|线上与线下|线上和线下/i.test(text)) return "hybrid";
  if (/在线|线上|online/i.test(text)) return "online";
  if (/线下|现场|in.person|on.site/i.test(text)) return "onsite";
  return "unspecified";
}
export function programHighlight(highlights: Resource["highlights"], pattern: RegExp, fallback: string) {
  return highlights.find(h => pattern.test(h.label))?.value || fallback;
}
