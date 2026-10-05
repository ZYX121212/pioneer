import { getD1 } from "../../db/d1";
import type { Resource } from "../data/resources";
import { listCommunity, type CommunityRow } from "./submissionService";

export function communityExpired(row: Pick<CommunityRow, "deadline" | "status">, now = new Date()): boolean {
  return row.status === "archived" || Boolean(row.deadline && Date.parse(`${row.deadline}T23:59:59Z`) < now.getTime());
}
export function communityToResource(row: CommunityRow, lang: "zh" | "en" = "zh"): Resource {
  const en = lang === "en", expired = communityExpired(row);
  return { id: -row.id, slug: row.slug, type: row.resource_type as Resource["type"], kind: en ? "Community resource" : "社区资源", name: row.name, location: row.location ?? (en ? "See official source" : "查看官方来源"), description: row.contributor_reason, overview: row.source_title, editorialNote: en ? "Official link checked; benefits and eligibility need your own review." : "官方链接已核验，权益与资格需行动前复核。", whyItMatters: row.contributor_reason, bestFor: [], considerations: [], highlights: [], tags: [en ? "Community" : "社区推荐", row.stage], timing: row.deadline ?? (en ? "No supplied deadline" : "未提供截止日期"), status: expired ? (en ? "Historical archive" : "历史归档") : (en ? "Official link checked" : "官方链接已核验"), verified: row.verified_at.slice(0, 10), source: row.source_title, url: row.url, detailPath: `/community/${row.slug}`, color: "blue", monogram: "C", founderStage: ["idea", "validation", "traction", "growth"].includes(row.stage) ? row.stage as Resource["founderStage"] : "any", verification: "link-only" };
}
export async function communityEntries(type?: string, lang: "zh" | "en" = "zh") {
  try { return { resources: (await listCommunity(await getD1(), type)).filter(row => row.resource_type !== "knowledge").map(row => communityToResource(row, lang)), unavailable: false }; }
  catch (error) { console.error("Community directory unavailable", error); return { resources: [], unavailable: true }; }
}
