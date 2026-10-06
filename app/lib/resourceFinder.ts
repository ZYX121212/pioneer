import type { Resource } from "../data/resources";
import { getEnglishResource } from "../data/english";
import { resourceFreshness, resourceStage } from "./resourceFreshness";
export const resourceNeeds = [
  { id: "all", zh: "全部资源", en: "All resources" },
  { id: "funding", zh: "找融资与加速器", en: "Funding & accelerators" },
  { id: "support", zh: "找孵化与支持", en: "Incubators & support" },
  { id: "events", zh: "参加活动", en: "Attend events" },
  { id: "learn", zh: "学习与案例", en: "Learning & examples" },
] as const;
export function resourceNeed(resource: Resource): string {
  if (resource.type === "startup" || resource.slug === "launch-by-station-f" || /课程|course/i.test(resource.kind)) return "learn";
  if (resource.type === "event") return "events";
  if (resource.type === "program" || /投资|加速|investor|accelerator|venture capital/i.test(resource.kind)) return "funding";
  return "support";
}
export const finderRegions = [
  { id: "global", zh: "全球 / 在线", en: "Global / online", aliases: ["全球", "在线", "Global", "Online"] },
  { id: "china", zh: "中国（含香港）", en: "China (incl. Hong Kong)", aliases: ["中国", "China", "Hong Kong"] },
  { id: "us", zh: "美国", en: "United States", aliases: ["美国", "United States"] },
  { id: "singapore", zh: "新加坡", en: "Singapore", aliases: ["新加坡", "Singapore"] },
  { id: "uk", zh: "英国", en: "United Kingdom", aliases: ["英国", "United Kingdom"] },
  { id: "france", zh: "法国", en: "France", aliases: ["法国", "France"] },
  { id: "germany", zh: "德国", en: "Germany", aliases: ["德国", "Germany"] },
  { id: "finland", zh: "芬兰", en: "Finland", aliases: ["芬兰", "Finland"] },
  { id: "denmark", zh: "丹麦", en: "Denmark", aliases: ["丹麦", "Denmark"] },
  { id: "portugal", zh: "葡萄牙", en: "Portugal", aliases: ["葡萄牙", "Portugal"] },
  { id: "uae", zh: "阿联酋", en: "United Arab Emirates", aliases: ["阿联酋", "United Arab Emirates", "UAE"] },
] as const;
export function matchesFinderRegion(resource: Resource, region: string, location: string) {
  if (region === "all") return true;
  const documented = [resource.location, getEnglishResource(resource.slug)?.location ?? ""].join(" ").toLowerCase();
  if (region === "other") return !finderRegions.some(row => row.aliases.some(alias => documented.includes(alias.toLowerCase())));
  const preset = finderRegions.find(row => row.id === region);
  // Preserve exact-location links from earlier directory versions.
  return preset ? preset.aliases.some(alias => documented.includes(alias.toLowerCase())) : location === region;
}
export type FinderFilters = { query: string; need: string; region: string; stage: string; freshness: string };
export const defaultFinderFilters: FinderFilters = { query: "", need: "all", region: "all", stage: "all", freshness: "non-historical" };
export function findResources(resources: Resource[], filters: FinderFilters, lang: "zh" | "en", now = new Date()) {
  const tokens = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return resources.filter(resource => {
    const english = getEnglishResource(resource.slug);
    const location = lang === "en" ? english?.location ?? resource.location : resource.location;
    const searchable = [resource.name, resource.location, resource.kind, resource.description, ...resource.tags, english?.location, english?.description, ...(english?.tags ?? [])].join(" ").toLocaleLowerCase();
    const freshness = resourceFreshness(resource, now);
    return tokens.every(token => searchable.includes(token)) &&
      (filters.need === "all" || resourceNeed(resource) === filters.need) &&
      matchesFinderRegion(resource, filters.region, location) &&
      (filters.stage === "all" || resourceStage(resource) === filters.stage || resourceStage(resource) === "any") &&
      (filters.freshness === "all" || (filters.freshness === "non-historical" ? freshness !== "historical" : freshness === filters.freshness));
  });
}
