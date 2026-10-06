"use client";
import { useSyncExternalStore, useState } from "react";
import { SiteHeader, SiteFooter } from "./SiteChrome";
function subscribeHash(listener: () => void) { window.addEventListener("hashchange", listener); return () => window.removeEventListener("hashchange", listener); }
const getHash = () => window.location.hash;
const serverHash = () => null;
export function UnsubscribePage({ lang }: { lang: "zh" | "en" }) {
  const en = lang === "en";
  const hash = useSyncExternalStore(subscribeHash, getHash, serverHash), ready = hash !== null;
  const value = new URLSearchParams((hash ?? "").slice(1)).get("token"), token = value && /^[a-f0-9]{64}$/.test(value) ? value : null;
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [error, setError] = useState("");
  async function unsubscribe() {
    setBusy(true); setError("");
    try { const response = await fetch("/api/newsletter/unsubscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) }); if (!response.ok) { setError(response.status === 400 ? (en ? "This link is invalid. Sign in to manage your notification preferences." : "链接无效，请登录管理通知偏好。") : (en ? "Unable to save your opt-out. Retry this link." : "退出未能保存，请通过此链接重试。")); return; } setDone(true); window.history.replaceState(null, "", window.location.pathname); }
    catch { setError(en ? "Connection failed. Your opt-out has not been confirmed; retry." : "连接失败，尚未确认退出，请重试。"); }
    finally { setBusy(false); }
  }
  return <main><SiteHeader lang={lang} /><section className="product-shell notification-preferences"><p className="eyebrow">PIONEER UPDATES</p><h1>{en ? "Stop email updates" : "退出邮件通知"}</h1>
    <p>{en ? "Opening this page does not change your preferences. Confirm below to stop all Pioneer email notifications for this link." : "打开此页面不会修改偏好。请在下方确认，退出此链接对应的全部 Pioneer 邮件通知。"}</p>
    {done ? <p role="status">{en ? "All email notification topics are now off." : "已退出全部邮件通知。"}</p> : !ready ? <p role="status">{en ? "Checking your link…" : "正在检查链接…"}</p> : token ? <button className="primary-action" type="button" disabled={busy} onClick={() => void unsubscribe()}>{busy ? (en ? "Saving…" : "保存中…") : (en ? "Confirm unsubscribe" : "确认退出全部邮件通知")}</button> : <p>{en ? "No valid email link was found. Sign in below to manage your preferences." : "没有找到有效的邮件链接，请在下方登录管理偏好。"}</p>}
    <p role="alert">{error}</p><p><a href={`${en ? "/en" : ""}/notifications`}>{en ? "Manage my notification preferences" : "管理我的通知偏好"}</a></p><p><a href={`${en ? "/en" : ""}/feed.xml`}>RSS</a> · <a href={`${en ? "/en" : ""}/weekly/deadlines.ics`}>{en ? "Deadline calendar" : "截止日历"}</a></p>
  </section><SiteFooter lang={lang}/></main>;
}
