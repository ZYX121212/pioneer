"use client";
import { useRef, useState } from "react";
import { refreshWorkspace, updateWorkspace, workspaceError } from "../lib/founderArchive";
import { backupByteLimit, mergeWorkspaceBackup, parseWorkspaceBackup } from "../lib/workspaceBackup";
import type { WorkspaceState } from "../lib/workspaceModel";
export function WorkspaceRestore({ lang, disabled = false }: { lang: "zh" | "en"; disabled?: boolean }) {
  const en = lang === "en";
  const [text, setText] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const [prepared, setPrepared] = useState<{ state: WorkspaceState; merged: WorkspaceState; version: number } | null>(null);
  const generation = useRef(0);
  function edit(value: string) { generation.current++; setText(value); setPrepared(null); setMessage(""); }
  async function readFile(file?: File) {
    if (!file) return;
    const revision = ++generation.current; setPrepared(null); setMessage(""); setText("");
    if (file.size > backupByteLimit) { setMessage(en ? "The file exceeds 1 MB. Choose a Pioneer JSON backup." : "文件超过 1 MB，请选择 Pioneer JSON 备份。"); return; }
    try { const value = await file.text(); if (revision === generation.current) setText(value); }
    catch { if (revision === generation.current) setMessage(en ? "The file could not be read. You can paste its JSON below." : "文件无法读取，可在下面粘贴备份 JSON。"); }
  }
  async function inspect() {
    setBusy(true); setPrepared(null); setMessage("");
    try {
      let state: WorkspaceState;
      try { state = parseWorkspaceBackup(text); }
      catch { setMessage(en ? "This is not a supported Pioneer backup. Check the complete JSON; nothing was imported." : "这不是可读取的 Pioneer 备份，请检查完整 JSON；尚未导入资料。"); return; }
      const cloud = await refreshWorkspace();
      let merged: WorkspaceState;
      try { merged = mergeWorkspaceBackup(cloud.state, state); }
      catch { setMessage(en ? "The combined workspace exceeds its limits. Keep your backup and remove unneeded saved entries before retrying." : "合并后超出工作台容量，请保留备份，整理不再需要的已保存记录后重试。"); return; }
      setPrepared({ state, merged, version: cloud.version });
    } catch (error) {
      setMessage(workspaceError(error, lang));
    } finally { setBusy(false); }
  }
  async function restore() {
    if (!prepared || busy || disabled) return;
    setBusy(true); setMessage("");
    try {
      await updateWorkspace(current => mergeWorkspaceBackup(current, prepared.state), prepared.version);
      setPrepared(null);
      setMessage(en ? "Backup merged and saved to this account. Existing records and your original backup are retained." : "备份已合并并保存到当前账号。已有记录和原备份均保留。");
    } catch (error) { setMessage(workspaceError(error, lang)); }
    finally { setBusy(false); }
  }
  const locked = disabled || busy;
  return <details className="workspace-restore"><summary>{en ? "Import a backup" : "导入备份"}</summary>
    <p>{en ? "Choose an exported Pioneer JSON file or paste the complete backup. Review it before saving. Existing projects and records with the same identifier take priority; nothing is deleted." : "选择已导出的 Pioneer JSON 文件，或粘贴完整备份。检查后再确认保存。账号已有项目和相同标识的记录优先保留，不删除原资料。"}</p>
    <label>{en ? "Backup file" : "备份文件"}<input type="file" accept=".json,application/json" disabled={locked} onChange={event => void readFile(event.target.files?.[0])} /></label>
    <label>{en ? "Backup JSON to import" : "待导入的备份 JSON"}<textarea value={text} rows={6} disabled={locked} onChange={event => edit(event.target.value)} spellCheck={false} /></label>
    <button type="button" disabled={locked || !text.trim()} onClick={() => void inspect()}>{busy ? (en ? "Processing…" : "处理中…") : (en ? "Check backup" : "检查备份")}</button>
    {prepared && <div className="workspace-restore-preview">
      <h3>{en ? "Review the merge" : "确认合并内容"}</h3>
      <p>{en ? `Backup project: ${prepared.state.project?.name ?? "none"}. Project after merging: ${prepared.merged.project?.name ?? "none"}.` : `备份项目：${prepared.state.project?.name ?? "无"}。合并后的项目：${prepared.merged.project?.name ?? "无"}。`}</p>
      <ul>{[["archive", en ? "Evidence" : "证据"], ["tasks", en ? "Actions" : "行动"], ["decisions", en ? "Decisions" : "判断"], ["completions", en ? "Completed guides" : "完成记录"], ["shortlist", en ? "Saved resources" : "收藏资源"]].map(([key, label]) => <li key={key}>{label}：{prepared.state[key as "archive"].length} {en ? "in backup;" : "条备份记录；"} {prepared.merged[key as "archive"].length} {en ? "after merging" : "条合并后记录"}</li>)}</ul>
      <button type="button" disabled={locked} onClick={() => void restore()}>{en ? "Confirm merge into this account" : "确认合并到当前账号"}</button>
      <button type="button" disabled={locked} onClick={() => { setPrepared(null); setMessage(""); }}>{en ? "Cancel import" : "取消导入"}</button>
    </div>}
    {message && <p role="status">{message}</p>}
  </details>;
}
