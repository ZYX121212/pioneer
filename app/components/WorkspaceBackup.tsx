"use client";

import { useState } from "react";
import { downloadWorkspace } from "../lib/founderArchive";

export function WorkspaceBackup({ lang, label, getData, filename = "pioneer-workspace.json", disabled = false }: { lang: "zh" | "en"; label: string; getData: () => unknown; filename?: string; disabled?: boolean }) {
  const en = lang === "en";
  const [backup, setBackup] = useState(""), [message, setMessage] = useState("");

  function download(text: string) {
    try {
      downloadWorkspace(JSON.parse(text), filename);
      setMessage(en ? "Download requested. If no file appears, copy the complete JSON below and save it as a .json file." : "已请求下载。如果没有出现文件，可复制下面的完整 JSON 并保存为 .json 文件。");
    } catch {
      setMessage(en ? "Download unavailable. Your complete backup is available below for manual copying." : "暂时无法下载。完整备份已显示在下面，可手动复制保存。");
    }
  }

  function prepare() {
    try {
      const text = JSON.stringify(getData(), null, 2);
      if (typeof text !== "string") throw new Error("Backup unavailable");
      setBackup(text);
      setMessage(en ? "Complete backup prepared. Choose download or copy below." : "完整备份已准备好，可选择下载或复制。");
    } catch {
      setMessage(en ? "The backup could not be prepared. Your saved data is unchanged; refresh and retry." : "暂时无法准备备份，已保存资料未改变。请刷新后重试。");
    }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(backup); setMessage(en ? "Complete backup JSON copied." : "已复制完整备份 JSON。"); }
    catch { setMessage(en ? "Automatic copying is unavailable. Select the backup text below and copy it manually." : "暂时无法自动复制，请选择下面的备份文本并手动复制。"); }
  }

  return <>
    <button type="button" disabled={disabled} onClick={prepare}>{label}</button>
    {(backup || message) && <div className="workspace-backup-preview">
      {backup && <>
        <h3>{en ? "Your prepared backup" : "已准备的备份"}</h3>
        <p>{en ? "This copy contains saved data at the time you exported. Keep it private. Unsaved form edits are not included." : "这份副本包含导出时已保存的资料，请妥善保管。尚未保存的表单输入不包含在内。"}</p>
        <label>{en ? "Backup JSON" : "备份 JSON"}<textarea readOnly rows={8} value={backup} /></label>
        <div className="workspace-data-actions"><button type="button" onClick={() => download(backup)}>{en ? "Download backup file" : "下载备份文件"}</button><button type="button" onClick={copy}>{en ? "Copy complete backup" : "复制完整备份"}</button><button type="button" onClick={() => { setBackup(""); setMessage(""); }}>{en ? "Close backup preview" : "关闭备份预览"}</button></div>
      </>}
      {message && <p role="status">{message}</p>}
    </div>}
  </>;
}
