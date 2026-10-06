"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
export function ResetPasswordPage({ lang, token }: { lang: "zh" | "en"; token: string }) {
  const en = lang === "en", prefix = en ? "/en" : "";
  const [password, setPassword] = useState(""), [busy, setBusy] = useState(false), [done, setDone] = useState(false), [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, newPassword: password }) });
      if (!response.ok) throw new Error();
      setPassword(""); setDone(true);
    } catch { setMessage(en ? "Unable to reset your password. The link may have expired. Request a new link and try again." : "暂时无法重设密码，链接可能已过期。请重新请求重设邮件后再试。"); } finally { setBusy(false); }
  }
  return <main className="product-shell"><section className="product-panel email-account"><h1>{en ? "Reset password" : "重设密码"}</h1>{done ? <p role="status">{en ? "Password updated. Previous sessions have been signed out." : "密码已更新，原登录会话已退出。"}</p> : token ? <form onSubmit={submit}><label><span>{en ? "New password" : "新密码"}</span><input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} /></label><p>{en ? "Use 12–128 characters." : "密码长度为 12–128 个字符。"}</p><button type="submit" disabled={busy}>{busy ? (en ? "Updating…" : "更新中…") : (en ? "Update password" : "更新密码")}</button></form> : <p>{en ? "Open the link in your password reset email." : "请从密码重设邮件中的链接打开此页。"}</p>}{message && <p role="alert">{message}</p>}<p><Link href={`${prefix}/login`}>{en ? "Back to sign in" : "返回登录"}</Link></p></section></main>;
}
