"use client";
import Link from "next/link";
import { ResultCopy } from "./ResultCopy";
import { useEffect, useState, type FormEvent } from "react";
import { initializeWorkspace, updateWorkspace, workspaceError } from "../lib/founderArchive";
import type { GuideDecision } from "../lib/workspaceModel";
export function GuideWorkbook({ slug, title, fields, lang = "zh", captureDecision = false }: { slug: string; title: string; fields: string[]; lang?: "zh" | "en"; captureDecision?: boolean }) {
  const en = lang === "en", prefix = en ? "/en" : "";
  const [values, setValues] = useState<string[]>(fields.map(() => "")), [decision, setDecision] = useState<GuideDecision["decision"]>("continue"), [reason, setReason] = useState(""), [complete, setComplete] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [nextAction, setNextAction] = useState("");
  useEffect(() => { if (captureDecision) void initializeWorkspace().then(record => { setComplete(record.state.completions.includes(slug)); }).catch(() => {}); }, [slug, captureDecision]);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!values.some(value => value.trim())) { setMessage(en ? "Add observed evidence to at least one field." : "请至少填写一项实际证据。"); return; }
    if (captureDecision && !reason.trim()) { setMessage(en ? "Add evidence supporting your decision." : "请写下支持判断的证据。"); return; }
    setBusy(true); setMessage("");
    try {
      const now = new Date().toISOString(), content = fields.map((field, index) => `${field}\n${values[index]?.trim() || (en ? "Not recorded" : "尚未记录")}`).join("\n\n");
      await updateWorkspace(state => {
        state.archive.unshift({ id: crypto.randomUUID(), guide: slug, type: en ? "Worksheet" : "实践工作表", title, summary: values.filter(value => value.trim()).join(" · ").slice(0, 1000), content, savedAt: now });
        if (captureDecision) { state.decisions = [{ guide: slug, decision, reason: reason.trim(), savedAt: now }, ...state.decisions.filter(row => row.guide !== slug)]; state.completions = complete ? [...new Set([...state.completions, slug])] : state.completions.filter(value => value !== slug); }
        if (nextAction.trim()) state.tasks.unshift({ id: crypto.randomUUID(), text: nextAction.trim(), due: "", done: false, createdAt: now });
      });
      setMessage(en ? "Evidence saved to your private workspace." : "证据已保存到私密工作台。");
    } catch (error) { setMessage(workspaceError(error, lang)); } finally { setBusy(false); }
  }
  const content = [title, ...fields.map((field, index) => `${field}\n${values[index]?.trim() || "—"}`), ...(captureDecision ? [en ? `Decision\n${decision}` : `方向判断\n${({ continue: "继续", narrow: "缩小", change: "调整", stop: "停止" })[decision]}`, `${en ? "Supporting evidence, including counter-evidence" : "支持证据，包括反向证据"}\n${reason.trim() || "—"}`, `${en ? "Task complete" : "判断任务完成"}\n${complete ? (en ? "Yes" : "是") : (en ? "No" : "否")}`] : []), `${en ? "Next action" : "下一步行动"}\n${nextAction.trim() || "—"}`].join("\n\n");
  return <form className="guide-cloud-workbook" onSubmit={save}><p>{en ? "Write observations, supporting evidence and the next test. Inputs stay on this page until you choose to save to your signed-in account." : "写下观察、支持证据及下一次验证。输入留在本页，主动保存后才写入登录账号。"}</p>{fields.map((field, index) => <label key={`${index}-${field}`}><span>{field}</span><textarea rows={3} maxLength={1000} value={values[index] ?? ""} onChange={event => setValues(current => current.map((value, at) => at === index ? event.target.value : value))} /></label>)}{captureDecision && <fieldset><legend>{en ? "Your decision" : "方向判断"}</legend><label><span>{en ? "Next move" : "准备如何推进"}</span><select value={decision} onChange={event => setDecision(event.target.value as GuideDecision["decision"])}>{Object.entries({ continue: en ? "Continue" : "继续", narrow: en ? "Narrow" : "缩小", change: en ? "Change" : "调整", stop: en ? "Stop" : "停止" }).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>{en ? "Supporting evidence, including counter-evidence" : "支持证据，包括反向证据"}</span><textarea rows={3} maxLength={5000} required value={reason} onChange={event => setReason(event.target.value)} /></label><label className="workspace-check"><input type="checkbox" checked={complete} onChange={event => setComplete(event.target.checked)} />{en ? "Mark this decision task complete" : "标记此项判断任务完成"}</label></fieldset>}<label><span>{en ? "Add a next action (optional)" : "加入下一步行动（可选）"}</span><input maxLength={500} value={nextAction} onChange={event => setNextAction(event.target.value)} /></label><div className="workspace-data-actions"><button type="submit" disabled={busy}>{busy ? (en ? "Saving…" : "保存中…") : (en ? "Save evidence and decision" : "保存证据")}</button><ResultCopy text={content} label={en ? "Copy worksheet" : "复制工作表"} lang={lang} /><Link href={`${prefix}/workspace`}>{en ? "Open workspace" : "打开工作台"}</Link></div>{message && <p role="status">{message}</p>}</form>;
}
