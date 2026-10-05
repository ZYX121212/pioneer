import { getChatGPTUser } from "../chatgpt-auth";
import { getD1 } from "../../db/d1";
import { resources } from "../data/resources";
import { getEnglishResource } from "../data/english";
import { pioneerGuides } from "../data/knowledge";
import { listCommunity } from "../lib/submissionService";
import { communityExpired } from "../lib/community";
import { freshnessLabel, resourceFreshness } from "../lib/resourceFreshness";
import { FounderWorkspace, type WorkspaceResource } from "./FounderWorkspace";
import { SiteFooter, SiteHeader } from "./SiteChrome";
export async function WorkspacePage({ lang }: { lang: "zh" | "en" }) {
  const en = lang === "en", prefix = en ? "/en" : "";
  const user = await getChatGPTUser();
  const catalog: WorkspaceResource[] = resources.map(row => { const copy = en ? getEnglishResource(row.slug) ?? row : row; const freshness = resourceFreshness(row); return { slug: row.slug, name: row.name, type: row.type, location: copy.location, timing: copy.timing, status: freshness === "reviewed" ? copy.status : freshnessLabel(freshness, lang), verified: row.verified, fit: copy.bestFor, cautions: copy.considerations, href: `${prefix}${row.detailPath ?? `/resources/${row.slug}`}` }; });
  let communityUnavailable = false;
  if (user) try { const rows = await listCommunity(await getD1()); catalog.push(...rows.map(row => ({ slug: row.slug, name: row.name, type: row.resource_type, location: row.location ?? "—", timing: row.deadline ?? (en ? "No supplied date" : "未提供日期"), status: communityExpired(row) ? (en ? "Historical window" : "历史窗口") : (en ? "Community source check" : "社区来源核验"), verified: row.verified_at.slice(0, 10), fit: [en ? "Check individual eligibility on the official source" : "在官方来源核对具体资格"], cautions: [en ? "Contributor's recommendation; benefits and eligibility are not independently researched" : "贡献者推荐理由，权益与资格尚未独立研究"], href: `${prefix}/community/${row.slug}` }))); } catch { communityUnavailable = true; }
  const englishTitles: Record<string, string> = { "find-the-real-problem": "Find the real customer problem", "first-user-interview": "Run your first customer interview", "define-your-mvp": "Define your MVP", "find-your-first-ten-users": "Find your first ten users", "test-your-pricing": "Test your pricing", "close-your-first-sales": "Close your first sales", "test-your-cofounder": "Test your cofounder relationship", "set-up-company-and-equity": "Set up your company and equity", "decide-whether-to-fundraise": "Decide whether to fundraise", "measure-retention-and-pmf": "Measure retention and product-market fit", "build-your-startup-metrics": "Build your startup metrics", "hire-your-first-employee": "Hire your first employee", "prepare-your-fundraising-process": "Prepare your fundraising process", "learn-from-startup-failures": "Learn from startup failures" };
  return <main><SiteHeader lang={lang} languageHref={`${en ? "" : "/en"}/workspace`} /><section className="product-shell">{communityUnavailable && <p role="status">{en ? "Community resources are temporarily unavailable. Your saved shortlist is preserved; refresh later to compare those entries." : "社区资源暂时无法读取，收藏清单会保留，请稍后刷新再对比这些条目。"}</p>}<FounderWorkspace lang={lang} signedIn={!!user} accountLabel={user?.displayName ?? ""} catalog={catalog} guides={pioneerGuides.map(row => ({ slug: row.slug, title: en ? englishTitles[row.slug] ?? row.title : row.title, number: row.number }))} /></section><SiteFooter lang={lang} /></main>;
}
