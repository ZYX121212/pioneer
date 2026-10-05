import { resourceFreshness } from "./resourceFreshness";
import type { CommunityRow } from "./submissionService";

export function communityExpired(row: Pick<CommunityRow, "deadline" | "status">, now = new Date()): boolean {
  return row.status === "archived" || Boolean(row.deadline && Date.parse(`${row.deadline}T23:59:59Z`) < now.getTime());
}
export function communityFreshness(row: Pick<CommunityRow, "deadline" | "status" | "verified_at" | "url">, now = new Date()) {
  return resourceFreshness({ status: communityExpired(row, now) ? "historical" : "checked", verified: row.verified_at.slice(0, 10), url: row.url }, now);
}
export function communityStatus(row: Pick<CommunityRow, "deadline" | "status" | "verified_at" | "url">, lang: "zh" | "en", now = new Date()) {
  return ({ reviewed: { zh: "官方链接近期核验", en: "Official link recently checked" }, "needs-review": { zh: "需重新核验当前窗口", en: "Current window needs rechecking" }, historical: { zh: "历史归档", en: "Historical archive" } })[communityFreshness(row, now)][lang];
}
