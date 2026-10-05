import { SaveResource } from "./SaveResource";
import { notFound } from "next/navigation";
import { getD1 } from "../../db/d1";
import type { CommunityRow } from "../lib/submissionService";
import { communityFreshness, communityStatus } from "../lib/community";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { ResourceReport } from "./ResourceReport";
export async function CommunityDetail({ slug, lang }: { slug: string; lang: "zh" | "en" }) {
  const en = lang === "en"; let row: CommunityRow | null;
  try { row = await (await getD1()).prepare("SELECT * FROM community_resources WHERE slug = ? AND status IN ('published','archived')").bind(slug).first<CommunityRow>(); }
  catch { return <main><SiteHeader lang={lang} /><section className="product-shell"><h1>{en ? "Resource unavailable" : "资源暂时不可用"}</h1><p role="alert">{en ? "Please reload later. Your saved links remain intact." : "请稍后刷新，已保存的链接不会丢失。"}</p></section><SiteFooter lang={lang} /></main>; }
  if (!row) notFound();
  const expired = communityFreshness(row) === "historical";
  const evidence = JSON.parse(row.evidence) as { checks?: string[]; checkedAt?: string };
  return <main><SiteHeader lang={lang} languageHref={`${en ? "" : "/en"}/community/${slug}`} /><section className="product-shell"><a href={en ? "/en/community" : "/community"}>{en ? "Community resources" : "社区资源"}</a><h1>{row.name}</h1><p>{communityStatus(row, lang)} · {row.verified_at.slice(0, 10)}</p><div className="product-grid"><article className="product-panel"><h2>{en ? "Contributor's recommendation" : "贡献者推荐理由"}</h2><p>{row.contributor_reason}</p><p>{en ? "This is the contributor's view, not an independently researched claim about benefits or eligibility." : "此内容来自提交者，与独立研究的权益或资格结论分开标注。"}</p><p>{row.location}</p><p>{en ? "Supplied date" : "提交日期"}：{row.deadline ?? (en ? "Not supplied" : "未提供")}</p><p>{en ? "Before acting: check eligibility, total cost and the current official status." : "行动前请核对资格、总成本和官方当前状态。"}</p>{!expired && <a className="product-button" href={row.url} target="_blank" rel="noreferrer">{en ? "Open official source" : "打开官方来源"}</a>}{expired && <a href={row.url} target="_blank" rel="noreferrer">{en ? "View historical source" : "查看历史来源"}</a>}</article><aside className="product-panel"><h2>{en ? "Verification evidence" : "核验依据"}</h2><p>{row.source_title}</p><p>{row.source_excerpt}</p><p><a href={row.url} target="_blank" rel="noreferrer">{row.url}</a></p><ul>{(evidence.checks ?? []).map(check => <li key={check}>{({ public_https: en ? "Public HTTPS source" : "公开 HTTPS 来源", known_official_host: en ? "Known official domain" : "已知官方域名", name_on_official_page: en ? "Name found on official page" : "官方页面确认名称", date_on_official_page: en ? "Supplied date found on official page" : "官方页面确认所填日期", editor_verified: en ? "Editor verified ownership and evidence" : "编辑确认来源归属及依据" } as Record<string, string>)[check] ?? check}</li>)}</ul><p>{en ? "Source checks do not guarantee admission, investment or available capacity." : "来源核验不代表保证录取、投资或剩余名额。"}</p></aside></div><SaveResource slug={slug} lang={lang} /><ResourceReport resourceKey={slug} lang={lang} /></section><SiteFooter lang={lang} /></main>;
}
