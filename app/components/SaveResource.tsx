"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ARCHIVE_EVENT, initializeWorkspace, toggleResource, workspaceError, workspaceSnapshot, WorkspaceError } from "../lib/founderArchive";
export function SaveResource({ slug, lang = "zh", showLabel = false }: { slug: string; showLabel?: boolean; lang?: "zh" | "en" }) {
  const [saved, setSaved] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const en = lang === "en";
  const [loginHref, setLoginHref] = useState("");
  useEffect(() => { const sync = () => setSaved(workspaceSnapshot().state.shortlist.includes(slug)); void initializeWorkspace().then(sync).catch(() => {}); window.addEventListener(ARCHIVE_EVENT, sync); return () => window.removeEventListener(ARCHIVE_EVENT, sync); }, [slug]);
  async function save() { setBusy(true); setMessage(""); setLoginHref(""); try { await toggleResource(slug); } catch (error) { setMessage(workspaceError(error, lang)); if (error instanceof WorkspaceError && error.status === 401) { setLoginHref(`${en ? "/en/login" : "/login"}?return_to=${encodeURIComponent(window.location.pathname + window.location.search)}`); } } finally { setBusy(false); } }
  const label = busy ? (en ? "Saving…" : "保存中…") : saved ? (en ? "Remove from shortlist" : "移出资源清单") : (en ? "Save to shortlist" : "加入资源清单");
  return <div className="resource-save"><button className="bookmark-save" type="button" onClick={save} disabled={busy} aria-pressed={saved} aria-busy={busy} aria-label={label} title={label}><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h10a1 1 0 0 1 1 1v17l-6-4-6 4V4a1 1 0 0 1 1-1Z"/></svg>{showLabel && <span>{label}</span>}</button>{message && <p role="alert">{message} <Link href={loginHref || (en ? "/en/workspace" : "/workspace")}>{loginHref ? (en ? "Sign in with email" : "使用邮箱登录") : (en ? "Open workspace" : "打开工作台")}</Link></p>}</div>;
}
