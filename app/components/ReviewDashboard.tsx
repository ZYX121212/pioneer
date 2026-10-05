"use client";
import { useEffect, useState, type FormEvent } from "react";
type Submission = { id: number; resource_name: string; resource_url: string; resource_type: string; why_useful: string; deadline: string | null; location: string | null; submitter_email: string; status: string; review_reason: string | null; review_evidence: string | null };
type Report = { id: number; resource_key: string; reason: string; details: string; status: string };
export function ReviewDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]), [reports, setReports] = useState<Report[]>([]), [message, setMessage] = useState(""), [loading, setLoading] = useState(true), [busy, setBusy] = useState<number | null>(null);
  async function load() {
    try { const response = await fetch("/api/admin/reviews", { cache: "no-store" }); if (!response.ok) throw new Error("审核队列无法读取，请确认管理员权限或稍后重试。"); const data = await response.json(); setSubmissions(data.submissions); setReports(data.reports); }
    catch (error) { setMessage(error instanceof Error ? error.message : "队列暂时不可用。"); } finally { setLoading(false); }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/reviews", { cache: "no-store", signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("审核队列无法读取，请确认管理员权限或稍后重试。"); return response.json(); })
      .then(data => { setSubmissions(data.submissions); setReports(data.reports); setLoading(false); })
      .catch(error => { if (!controller.signal.aborted) { setMessage(error instanceof Error ? error.message : "队列暂时不可用。"); setLoading(false); } });
    return () => controller.abort();
  }, []);
  async function review(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault(); const form = event.currentTarget; setBusy(id); setMessage("");
    const values = Object.fromEntries(new FormData(form));
    const action = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ?? "reject";
    try { const response = await fetch("/api/admin/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, id, action, officialConfirmed: values.officialConfirmed === "on" }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "审核保存失败。"); setMessage("审核结果已保存。"); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "无法保存。"); } finally { setBusy(null); }
  }
  return <><div className="product-heading"><div><h1>资源审核与纠错</h1><p><a href="/admin/mail">通知发布与投递</a> · <a href="/admin/analytics">内部统计</a></p><p>核验来源归属、名称、资格与日期。自动检查仅确认页面证据，人工判断须记录依据。</p></div><button type="button" className="product-button" onClick={() => { setLoading(true); void load(); }} disabled={loading}>刷新队列</button></div>{message && <p role="status">{message}</p>}{loading && <p>正在读取审核队列…</p>}<h2>资源提交 · {submissions.length}</h2>{submissions.map(row => <article className="product-panel" key={row.id}><h3>{row.resource_name} · {row.status}</h3><p><a href={row.resource_url} target="_blank" rel="noreferrer">查看提交来源</a></p><p>{row.resource_type} · {row.location} · {row.deadline ?? "无日期"}</p><p>{row.why_useful}</p><p>联系邮箱（仅管理员可见）：{row.submitter_email}</p><p>自动审核原因：{row.review_reason ?? "尚未处理"}</p>{row.review_evidence && <details><summary>自动核验依据</summary><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(JSON.parse(row.review_evidence), null, 2)}</pre></details>}<form className="product-form" onSubmit={event => review(event, row.id)}><label>核验来源 URL<input name="sourceUrl" type="url" defaultValue={row.resource_url} /></label><label>官方页面标题<input name="sourceTitle" maxLength={160} /></label><label className="wide">官方依据短摘录<textarea name="sourceExcerpt" maxLength={160} rows={2} /></label><label className="wide">审核说明<textarea name="note" minLength={20} maxLength={1200} required rows={3} placeholder="至少 20 字：记录来源归属、日期及通过/拒绝原因" /></label><label className="wide"><span><input type="checkbox" name="officialConfirmed" /> 我已确认来源归属，并核对名称与所填日期</span></label><button type="submit" name="action" value="approve" disabled={busy === row.id}>核验通过并收录</button><button type="submit" name="action" value="reject" disabled={busy === row.id}>不予收录</button>{row.status === "approved" && <button type="submit" name="action" value="withdraw" disabled={busy === row.id}>撤回收录</button>}</form></article>)}{submissions.length === 0 && !loading && <p>暂时没有资源提交。</p>}<h2>纠错 · {reports.length}</h2>{reports.map(row => <article className="product-panel" key={row.id}><h3>{row.resource_key} · {row.status}</h3><p>{row.reason}：{row.details}</p>{row.status === "pending" && <form className="product-form" onSubmit={event => review(event, row.id)}><label className="wide">处理说明<textarea name="note" minLength={20} maxLength={1200} required rows={2} /></label><button type="submit" value="resolve-report" disabled={busy === row.id}>标记已核验处理</button></form>}</article>)}</>;
}
