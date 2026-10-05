"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
type Snapshot = { email: string; language: "zh" | "en"; weekly: boolean; cases: boolean; status: string; version: number; updatedAt: string | null; deliveryEnabled: boolean };
export function NotificationPreferences({ lang, signedIn, deliveryEnabled = false }: { lang: "zh" | "en"; signedIn: boolean; deliveryEnabled?: boolean }) {
  const en = lang === "en", path = `${en ? "/en" : ""}/notifications`;
  const [saved, setSaved] = useState<Snapshot | null>(null), [language, setLanguage] = useState<"zh" | "en">(lang), [weekly, setWeekly] = useState(false), [cases, setCases] = useState(false);
  const enabled = saved?.deliveryEnabled ?? deliveryEnabled;
  const [busy, setBusy] = useState(signedIn), [message, setMessage] = useState(""), [failed, setFailed] = useState(false);
  const refresh = useCallback(async () => {
    setBusy(true); setMessage(""); setFailed(false);
    try { const response = await fetch("/api/newsletter", { cache: "no-store" }); if (!response.ok) throw new Error(); const row: Snapshot = await response.json(); setSaved(row); setLanguage(row.language); setWeekly(row.weekly); setCases(row.cases); }
    catch { setFailed(true); setMessage(en ? "Unable to load your preferences. Retry before changing them." : "偏好暂时无法读取，请重试后再修改。"); }
    finally { setBusy(false); }
  }, [en]);
  useEffect(() => {
    if (!signedIn) return;
    const controller = new AbortController();
    fetch("/api/newsletter", { cache: "no-store", signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error();
      const row: Snapshot = await response.json();
      if (!controller.signal.aborted) { setSaved(row); setLanguage(row.language); setWeekly(row.weekly); setCases(row.cases); }
    }).catch(() => { if (!controller.signal.aborted) { setFailed(true); setMessage(en ? "Unable to load your preferences. Retry before changing them." : "偏好暂时无法读取，请重试后再修改。"); } }).finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [signedIn, en]);
  async function update(unsubscribe: boolean) {
    if (!saved || busy) return;
    setBusy(true); setMessage(""); setFailed(false);
    try {
      const response = await fetch("/api/newsletter", { method: unsubscribe ? "DELETE" : "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ version: saved.version, language, weekly, cases }) });
      const row = await response.json();
      if (!response.ok) { setFailed(true); setMessage(row.code === "version_conflict" ? (en ? "Another page changed your preferences. Your draft is kept. Refresh before saving again." : "其他页面已修改偏好，当前输入仍保留。请刷新后再保存。") : row.code === "signin_required" ? (en ? "Your session ended. Sign in again; your draft is kept." : "登录已结束，请重新登录。当前输入仍保留。") : (en ? "Your changes were not saved. Keep your draft and retry." : "修改未保存，当前输入仍保留，请重试。")); return; }
      setSaved(row); setLanguage(row.language); setWeekly(row.weekly); setCases(row.cases);
      setMessage(row.status === "unsubscribed" ? (en ? "All email notification preferences are now off." : "已退出全部邮件通知。") : (row.deliveryEnabled ? (en ? "Preferences saved. You can receive published updates for these topics." : "偏好已保存，可以接收这些主题的已发布通知。") : (en ? "Preferences saved. Email delivery is paused until the sending service is enabled." : "偏好已保存。发信服务启用前不会发送邮件。")));
    } catch { setFailed(true); setMessage(en ? "Connection failed. Your draft is kept; retry to save." : "连接失败，当前输入仍保留，请重试保存。"); }
    finally { setBusy(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void update(false); }
  return <section className="notification-preferences" aria-labelledby="notification-title">
    <p className="eyebrow">PIONEER UPDATES</p><h1 id="notification-title">{en ? "Your notification preferences" : "你的通知偏好"}</h1>
    <p>{enabled ? (en ? "Email delivery is enabled for published updates. Choose topics below; RSS and the deadline calendar are also available." : "已启用已发布通知的邮件发送，请在下方选择主题；RSS 和截止日历也可使用。") : en ? "Choose useful founder updates and stop them whenever you need. Email delivery is currently paused; RSS and the deadline calendar remain available." : "选择对你有用的创业更新，也能随时退出。邮件发送当前暂停，RSS 和截止日历仍可使用。"}</p>
    {!signedIn ? <div className="workspace-signin"><p>{en ? "Sign in to manage the verified email of your account. If you registered earlier, use the account with that same email." : "登录后管理账号邮箱。如果之前登记过，请使用相同邮箱的账号。"}</p><a className="primary-action" href={`/signin-with-chatgpt?return_to=${encodeURIComponent(path)}`} target="_top">{en ? "Sign in with ChatGPT" : "使用 ChatGPT 登录"}</a></div> : <>
      {saved && <p className="notification-account">{en ? "Account email" : "账号邮箱"}：{saved.email}<br />{saved.status === "interest" ? (en ? "An earlier interest registration was found. Choose topics below to confirm your preferences." : "已找到之前的意向登记，请在下方选择主题并确认偏好。") : saved.status === "unsubscribed" ? (en ? "All notifications are off." : "全部通知已退出。") : saved.status === "registered" ? (enabled ? (en ? "Your selected topics are saved." : "已保存你选择的主题。") : (en ? "Your topics are saved; email delivery is paused." : "已保存你的主题，邮件发送暂停中。")) : (en ? "No topics selected yet." : "还未选择通知主题。")}</p>}
      <form onSubmit={submit}><fieldset disabled={busy || !saved}><legend>{en ? "Topics" : "通知主题"}</legend>
        <label className="notification-choice"><input type="checkbox" checked={weekly} onChange={event => setWeekly(event.target.checked)} />{en ? "Weekly opportunities: official programs, founder events and actionable deadlines" : "本周机会：官方创业计划、活动与可行动截止日期"}</label>
        <label className="notification-choice"><input type="checkbox" checked={cases} onChange={event => setCases(event.target.checked)} />{en ? "Founder learning: failure cases, evidence and practical guides" : "创业学习：失败案例、判断证据与实践指南"}</label>
        <label className="notification-language">{en ? "Email language" : "邮件语言"}<select value={language} onChange={event => setLanguage(event.target.value as "zh" | "en")}><option value="zh">中文</option><option value="en">English</option></select></label>
        <p>{en ? "Saving your chosen topics consents to Pioneer email updates when published and delivery is enabled. You can turn all topics off here or use an unsubscribe link in an email." : "保存所选主题表示同意在发布通知且发信启用时接收 Pioneer 更新。可以在这里关闭全部主题，或通过邮件中的链接退出。"}</p>
        <button type="submit" className="primary-action">{busy ? (en ? "Saving…" : "保存中…") : (en ? "Save preferences" : "保存偏好")}</button>
        <button type="button" className="secondary-action" onClick={() => void update(true)} disabled={saved?.status === "unsubscribed"}>{en ? "Stop all email updates" : "退出全部邮件通知"}</button>
      </fieldset></form>
      <div aria-live="polite" role={failed ? "alert" : "status"}>{message || (busy && !saved ? (en ? "Loading your preferences…" : "正在读取偏好…") : "")}</div>
      <button type="button" className="secondary-action" disabled={busy} onClick={() => { if (!saved || window.confirm(en ? "Reload saved preferences? Unsaved choices will be replaced." : "重新读取已保存偏好？当前未保存的选择将被替换。")) void refresh(); }}>{en ? "Refresh saved preferences" : "刷新已保存偏好"}</button>
      <p><a href={`/signin-with-chatgpt?return_to=${encodeURIComponent(path)}`} target="_top">{en ? "Sign in again" : "重新登录"}</a></p>
    </>}
    <div className="notification-alternatives"><h2>{en ? "Updates you can use now" : "现在就能使用的更新"}</h2><p><a href={`${en ? "/en" : ""}/feed.xml`}>RSS</a> · <a href={`${en ? "/en" : ""}/weekly/deadlines.ics`}>{en ? "Deadline calendar" : "截止日历"}</a> · <a href={`${en ? "/en" : ""}/workspace`}>{en ? "My founder workspace" : "我的创业工作台"}</a></p></div>
  </section>;
}
