import { getD1 } from "../../db/d1";
import { listCommunity, type CommunityRow } from "../lib/submissionService";
import { communityExpired } from "../lib/community";
import { CommunityExplorer } from "./CommunityExplorer";
import { SiteFooter, SiteHeader } from "./SiteChrome";
export async function CommunityDirectory({ lang }: { lang: "zh" | "en" }) {
  const en = lang === "en"; let rows: CommunityRow[] = []; let error = false;
  try { rows = await listCommunity(await getD1()); } catch { error = true; }
  return <main><SiteHeader lang={lang} languageHref={en ? "/community" : "/en/community"} /><section className="product-shell"><div className="product-heading"><div><span className="section-index">COMMUNITY RESOURCES</span><h1>{en ? "Resources founders contribute" : "创业者共同发现的资源"}</h1><p>{en ? "Official links and supplied dates are checked. Contributor reasons remain their own views, separate from Pioneer's research briefs." : "这里核验官方链接及所填日期。推荐理由保留贡献者观点，与 Pioneer 深度整理档案分开标注。"}</p></div><a className="product-button" href={en ? "/en/submit" : "/submit"}>{en ? "Recommend a resource" : "推荐资源"}</a></div>{error ? <p role="alert">{en ? "Resources are temporarily unavailable. Reload to retry." : "资源暂时无法加载，请刷新重试。"}</p> : <CommunityExplorer lang={lang} rows={rows.map(row => ({ slug: row.slug, name: row.name, type: row.resource_type, location: row.location ?? "", stage: row.stage, reason: row.contributor_reason, deadline: row.deadline, checkedAt: row.verified_at.slice(0, 10), archived: communityExpired(row) }))} />}</section><SiteFooter lang={lang} /></main>;
}
