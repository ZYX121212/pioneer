import type { Resource } from "../data/resources";
import { weeklyIssue, weeklyOpportunities } from "../data/weekly";
export type ResourceFreshness = "reviewed" | "needs-review" | "historical";
export function resourceFreshness(resource: Pick<Resource, "status" | "verified" | "url">, now = new Date()): ResourceFreshness {
  if (/归档|历史|已结束|已截止|archiv|historical|ended|closed/i.test(resource.status)) return "historical";
  const weekly = weeklyOpportunities.find(row => row.url.replace(/\/$/, "") === resource.url.replace(/\/$/, ""));
  if (weekly) { if (now.getTime() >= Date.parse(weekly.expiresAt)) return "historical"; if (now.getTime() >= Date.parse(weeklyIssue.validUntil)) return "needs-review"; }
  const date = resource.verified.match(/\d{4}[.-]\d{2}[.-]\d{2}/)?.[0].replaceAll(".", "-");
  if (!date || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) return "needs-review";
  return now.getTime() - Date.parse(`${date}T00:00:00Z`) > 30 * 86_400_000 ? "needs-review" : "reviewed";
}
export function freshnessLabel(status: ResourceFreshness, lang: "zh" | "en") {
  return ({ reviewed: { zh: "近期核验档案", en: "Recently reviewed brief" }, "needs-review": { zh: "需重新核验当前窗口", en: "Current window needs rechecking" }, historical: { zh: "历史归档", en: "Historical · archived" } })[status][lang];
}
export function resourceStage(resource: Resource): string {
  if (resource.founderStage) return resource.founderStage;
  if (resource.stageType === "seed") return "validation";
  if (resource.stageType === "series-a") return "traction";
  if (resource.stageType) return "growth";
  // Missing stage evidence stays unspecified rather than inferring eligibility from a brand.
  return "any";
}
