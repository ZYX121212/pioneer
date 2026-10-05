"use client";
import { useState, type FormEvent } from "react";
export function ResourceReport({ resourceKey, lang = "zh" }: { resourceKey: string; lang?: "zh" | "en" }) {
  const en = lang === "en", [open, setOpen] = useState(false), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), resourceKey }) });
      if (!response.ok) throw new Error(en ? "Unable to save the correction. Retry later." : "纠错暂时无法保存，请稍后重试。");
      setMessage(en ? "Correction saved for editor review." : "纠错已保存，编辑会核验处理。"); form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to submit"); } finally { setBusy(false); }
  }
  return <section className="product-panel"><button type="button" className="product-button" onClick={() => setOpen(!open)} aria-expanded={open}>{en ? "Report a correction" : "报告纠错"}</button>{open && <form className="product-form" onSubmit={submit}><label>{en ? "Issue" : "问题类型"}<select name="reason"><option value="broken">{en ? "Broken link" : "链接失效"}</option><option value="expired">{en ? "Expired date" : "日期已过期"}</option><option value="incorrect">{en ? "Incorrect information" : "信息不准确"}</option><option value="other">{en ? "Other" : "其他"}</option></select></label><label className="wide">{en ? "What should be corrected? Include a source if possible." : "哪里需要更正？可补充依据链接。"}<textarea name="details" minLength={10} maxLength={1000} rows={3} required /></label><button type="submit" disabled={busy}>{busy ? (en ? "Saving…" : "保存中…") : (en ? "Send correction" : "提交纠错")}</button></form>}{message && <p role="status">{message}</p>}</section>;
}
