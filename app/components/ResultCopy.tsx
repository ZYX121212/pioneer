"use client";

import { useId, useState } from "react";

export function ResultCopy({ text, label, lang = "zh" }: { text: string; label: string; lang?: "zh" | "en" }) {
  const en = lang === "en";
  const id = useId();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(false);

  async function copy() {
    setMessage("");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setExpanded(true);
      setMessage(en ? "Automatic copying is unavailable. Select the complete text below and copy it manually." : "暂时无法自动复制。请选择下面的完整文本，手动复制。");
    }
  }

  return <div className="workbook-copy">
    <button type="button" onClick={copy}>{copied ? (en ? "Copied ✓" : "已复制 ✓") : label}</button>
    <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>{expanded ? (en ? "Hide text" : "收起文本") : (en ? "View text / copy manually" : "查看文本 / 手动复制")}</button>
    {message && <p role="status">{message}</p>}
    <div id={id} hidden={!expanded}>
      <label><span>{en ? "Complete result" : "完整结果"}</span><textarea aria-label={en ? `${label}: complete text` : `${label}：完整文本`} readOnly rows={8} value={text} /></label>
      <p>{en ? "Select all text, then copy with your keyboard or context menu." : "选中全部文本后，使用键盘或右键菜单复制。"}</p>
    </div>
  </div>;
}
