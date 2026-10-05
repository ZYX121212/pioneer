import { getD1 } from "../../db/d1";
import { findSubmission } from "../lib/submissionService";
import { reviewReasons } from "../lib/resourceReview";
import { SiteFooter, SiteHeader } from "./SiteChrome";
export async function SubmissionReceipt({ token, lang }: { token: string; lang: "zh" | "en" }) {
  const en = lang === "en";
  let row = null; let unavailable = false;
  try { if (/^[a-f0-9]{32}$/.test(token)) row = await findSubmission(await getD1(), token); } catch { unavailable = true; }
  const labels: Record<string, string> = en ? { approved: "Published", pending: "Awaiting editor review", reviewing: "Automatic checks in progress", rejected: "Not published", duplicate: "Already listed" } : { approved: "已收录", pending: "等待人工复核", reviewing: "自动核验中", rejected: "未收录", duplicate: "已有档案" };
  const path = row?.published_slug ? row.published_slug.startsWith("/") ? row.published_slug : `/community/${row.published_slug}` : null;
  return <main><SiteHeader lang={lang} languageHref={`${en ? "" : "/en"}/submissions/${token}`} /><section className="product-shell"><span className="section-index">SUBMISSION RECEIPT</span><h1>{en ? "Your submission" : "你的资源提交"}</h1><p>{en ? "This private link lets you return to check the result. Keep it to yourself." : "这条私密链接可以随时查询结果，请仅供自己保存。"}</p>{unavailable ? <p role="alert">{en ? "Review records are temporarily unavailable. Reload to retry." : "审核记录暂时不可用，请刷新重试。"}</p> : row ? <article className="product-panel"><h2>{row.resource_name}</h2><strong>{labels[row.status] ?? row.status}</strong><p>{reviewReasons[(row.review_reason ?? "").split(":")[0]]?.[lang] ?? (en ? "Your submission is saved. Checks will appear here." : "提交已保存，核验结果会显示在这里。")}</p>{row.review_reason?.startsWith("editor_rejected:") && <p>{row.review_reason.slice("editor_rejected:".length).trim()}</p>}{row.reviewed_at && <p>{en ? "Last reviewed" : "最近审核"}：{row.reviewed_at.slice(0, 10)}</p>}{path && <a href={`${en ? "/en" : ""}${path}`}>{en ? "View resource" : "查看资源"}</a>}<p><a href={`${en ? "/en" : ""}/submit`}>{en ? "Submit a corrected resource" : "补充或更正后再次提交"}</a></p></article> : <p>{en ? "Receipt not found. Check the link you saved after submitting." : "未找到提交记录，请检查提交后保存的链接。"}</p>}</section><SiteFooter lang={lang} /></main>;
}
