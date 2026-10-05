import type { Resource } from "../data/resources";
import type { CommunityRow } from "./submissionService";
import { communityStatus } from "./communityFreshness";

export function communityToResource(row: CommunityRow, lang: "zh" | "en" = "zh"): Resource {
  const en = lang === "en";
  return { id: -row.id, slug: row.slug, type: row.resource_type as Resource["type"], kind: en ? "Community resource" : "社区资源", name: row.name, location: row.location ?? (en ? "See official source" : "查看官方来源"), description: row.contributor_reason, overview: row.source_title, editorialNote: en ? "Official link checked; benefits and eligibility need your own review." : "官方链接已核验，权益与资格需行动前复核。", whyItMatters: row.contributor_reason, bestFor: [], considerations: [], highlights: [], tags: [en ? "Community" : "社区推荐", row.stage], timing: row.deadline ?? (en ? "No supplied deadline" : "未提供截止日期"), status: communityStatus(row, lang), verified: row.verified_at.slice(0, 10), source: row.source_title, url: row.url, detailPath: `/community/${row.slug}`, color: "blue", monogram: "C", founderStage: ["idea", "validation", "traction", "growth"].includes(row.stage) ? row.stage as Resource["founderStage"] : "any", verification: "link-only" };
}
