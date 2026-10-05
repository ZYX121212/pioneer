"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type PioneerGuide } from "../data/knowledge";
import { type GuideDecision, ARCHIVE_EVENT, initializeWorkspace, workspaceError, readCompletions, readDecisions, saveGuideDecision, toggleCompletion } from "../lib/founderArchive";

export function GuideProgress({ guide, judgment, mistakes, action }: {
  guide: PioneerGuide;
  judgment: string;
  mistakes: string[];
  action: string;
}) {
  const [done, setDone] = useState(false);
  const [decision, setDecision] = useState<GuideDecision["decision"]>("continue");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [message, setMessage] = useState("");
  useEffect(() => {
    const sync = () => setDone(readCompletions().includes(guide.slug));
    void initializeWorkspace().then(() => { sync(); const current = readGuideDecision(guide.slug); if (current) { setDecision(current.decision); setReason(current.reason); } setLoading(false); }).catch(() => setLoading(false));
    window.addEventListener(ARCHIVE_EVENT, sync); return () => window.removeEventListener(ARCHIVE_EVENT, sync);
  }, [guide.slug]);
  async function saveDecision() {
    if (!reason.trim()) { setMessage("请写下支持判断的证据或理由。"); return; }
    setBusy(true); setMessage("");
    try { await saveGuideDecision({ guide: guide.slug, decision, reason: reason.trim() }); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }
    catch (error) { setMessage(workspaceError(error)); } finally { setBusy(false); }
  }
  async function complete() { setBusy(true); setMessage(""); try { setDone((await toggleCompletion(guide.slug)).includes(guide.slug)); } catch (error) { setMessage(workspaceError(error)); } finally { setBusy(false); } }

  return (
    <section className="guide-fast-track" id="quick-path">
      <div className="fast-track-heading"><span>3-MINUTE PATH</span><h2>先用三分钟，决定这篇是否值得深入。</h2></div>
      <div className="fast-track-grid">
        <article><span>核心判断</span><p>{judgment}</p></article>
        <article><span>最常见的误判</span><ul>{mistakes.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><span>今天完成</span><p>{action}</p></article>
      </div>
      <div className="fast-track-actions">
        <a href="#deep-guide">进入深度指南 ↓</a>
        <button type="button" className={done ? "done" : ""} onClick={complete} disabled={busy || loading}>
          {done ? "已完成这次决策 ✓" : "标记为已完成"}
        </button>
      </div>
      {message && <p role="alert">{message} <Link href="/workspace">打开工作台</Link></p>}
      <div className="guide-decision-capture" id="stage-decision">
        <div>
          <span>阶段判断</span>
          <strong>完成这一步后，你准备怎么处理这个方向？</strong>
        </div>
        <div className="decision-options" aria-label="阶段判断选项">
          {decisionOptions.map((item) => (
            <button type="button" className={decision === item.value ? "active" : ""} disabled={busy || loading} onClick={() => setDecision(item.value)} key={item.value}>
              {item.label}
            </button>
          ))}
        </div>
        <label>
          <span>判断理由</span>
          <textarea disabled={loading} maxLength={5000} rows={2} value={reason} placeholder="写下支持这个判断的证据，尤其是反向证据。" onChange={(event) => setReason(event.target.value)} />
        </label>
        <button type="button" onClick={saveDecision} disabled={busy || loading}>{saved ? "阶段判断已保存 ✓" : "保存阶段判断"}</button>
      </div>
    </section>
  );
}

const decisionOptions: Array<{ value: GuideDecision["decision"]; label: string }> = [
  { value: "continue", label: "继续推进" },
  { value: "narrow", label: "缩小人群" },
  { value: "change", label: "调整假设" },
  { value: "stop", label: "停止方向" },
];

function readGuideDecision(slug: string) {
  return readDecisions().find((item) => item.guide === slug);
}
