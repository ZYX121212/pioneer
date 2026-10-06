"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
export function EmailAccountForm({ lang, returnTo, deliveryEnabled, account }: { lang: "zh" | "en"; returnTo: string; deliveryEnabled: boolean; account: { name: string; email: string; verified: boolean; provider: "email" | "chatgpt" } | null }) {
  const en = lang === "en", prefix = en ? "/en" : "";
  const [mode, setMode] = useState<"signin" | "signup" | "reset" | "change">("signin"), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [name, setName] = useState(""), [currentPassword, setCurrentPassword] = useState("");
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  async function request(path: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/auth/${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) {
      if (response.status === 429) throw new Error(en ? "Too many attempts. Please try again later." : "尝试次数过多，请稍后重试。");
      if (path === "sign-in/email") throw new Error(en ? "Unable to sign in. Check your email and password." : "无法登录，请检查邮箱和密码。");
      throw new Error(en ? "The request was not completed. If registration was interrupted, try signing in before registering again." : "请求未完成。如果注册过程中断，请先尝试登录，再决定是否重新注册。");
    }
    return response;
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (mode === "reset") { await request("request-password-reset", { email: email.trim(), redirectTo: `${window.location.origin}${prefix}/reset-password` }); setMessage(en ? "If this email has an account, a password reset email will be sent." : "如果此邮箱已注册，将收到密码重设邮件。"); }
      else if (mode === "change") { await request("change-password", { currentPassword, newPassword: password, revokeOtherSessions: true }); setCurrentPassword(""); setPassword(""); setMessage(en ? "Password updated. Other sessions have been signed out." : "密码已更新，其他登录会话已退出。"); }
      else { await request(mode === "signup" ? "sign-up/email" : "sign-in/email", { email: email.trim(), password, ...(mode === "signup" ? { name: name.trim() || email.trim().split("@")[0] } : {}) }); window.location.assign(returnTo); }
    } catch (error) { setMessage(error instanceof Error ? error.message : (en ? "Connection interrupted. Please try again." : "连接中断，请重试。")); } finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true); setMessage("");
    try { await request("sign-out", {}); window.location.assign(`${prefix}/login`); }
    catch { setMessage(en ? "Unable to sign out. Please try again." : "暂时无法退出，请重试。"); setBusy(false); }
  }
  async function verify() {
    setBusy(true); setMessage("");
    try { await request("send-verification-email", { email: account!.email, callbackURL: `${window.location.origin}${prefix}/login` }); setMessage(en ? "Verification email requested. Check your inbox." : "已请求验证邮件，请检查邮箱。"); }
    catch { setMessage(en ? "Unable to request verification. Please try again." : "暂时无法请求验证邮件，请重试。"); } finally { setBusy(false); }
  }
  return <section className="product-panel email-account"><h1>{account ? (en ? "Your account" : "你的账号") : (en ? "Sign in with email" : "邮箱登录")}</h1>
    {account ? <><p>{account.name} · {account.email}</p><p>{en ? "You can continue working on your private project, evidence and actions." : "可以继续管理私密项目、证据与行动。"}</p><Link className="product-button" href={returnTo}>{en ? "Continue" : "继续使用"}</Link>
      {account.provider === "email" ? <><p>{account.verified ? (en ? "Email verified." : "邮箱已验证。") : (en ? "Verify your email before enabling email notifications." : "验证邮箱后可启用邮件通知。")}</p>{!account.verified && (deliveryEnabled ? <button type="button" disabled={busy} onClick={() => void verify()}>{en ? "Send verification email" : "发送验证邮件"}</button> : <p>{en ? "Email verification and password recovery are not yet enabled." : "邮箱验证与密码找回暂未启用。"}</p>)}<button type="button" disabled={busy} onClick={() => { setMode(mode === "change" ? "signin" : "change"); setMessage(""); }}>{en ? "Change password" : "修改密码"}</button><button type="button" disabled={busy} onClick={() => void signOut()}>{en ? "Sign out" : "退出登录"}</button></> : <a href={`/signout-with-chatgpt?return_to=${encodeURIComponent(`${prefix}/login`)}`} target="_top">{en ? "Sign out" : "退出登录"}</a>}</> : <><p>{en ? "Use an email and password to save your project, evidence and actions across devices. A ChatGPT account is optional." : "使用邮箱和密码，在不同设备保存项目、证据与行动。无需 ChatGPT 账号。"}</p><div className="account-modes"><button type="button" disabled={busy} aria-pressed={mode === "signin"} onClick={() => { setMode("signin"); setMessage(""); }}>{en ? "Sign in" : "登录"}</button><button type="button" disabled={busy} aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setMessage(""); }}>{en ? "Create account" : "注册"}</button>{deliveryEnabled && <button type="button" disabled={busy} aria-pressed={mode === "reset"} onClick={() => { setMode("reset"); setMessage(""); }}>{en ? "Forgot password" : "忘记密码"}</button>}</div></>}
    {(!account || mode === "change") && <form onSubmit={submit}><fieldset disabled={busy}>
      {mode === "signup" && <label><span>{en ? "Name (optional)" : "称呼（可选）"}</span><input autoComplete="nickname" maxLength={100} value={name} onChange={event => setName(event.target.value)} /></label>}
      {mode !== "change" && <label><span>{en ? "Email" : "邮箱"}</span><input type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>}
      {mode === "change" && <label><span>{en ? "Current password" : "当前密码"}</span><input type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} /></label>}
      {mode !== "reset" && <label><span>{en ? (mode === "change" ? "New password" : "Password") : (mode === "change" ? "新密码" : "密码")}</span><input type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={mode === "signin" ? undefined : 12} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} /></label>}
      {mode !== "reset" && mode !== "signin" && <p>{en ? "Use 12–128 characters. Avoid reusing a password from another service." : "密码长度为 12–128 个字符，请避免复用其他网站的密码。"}</p>}
      {!deliveryEnabled && !account && mode === "signup" && <p>{en ? "Password recovery is not yet enabled. Keep your password securely." : "密码找回暂未启用，请妥善保存密码。"}</p>}
      <button type="submit" className="product-button">{busy ? (en ? "Please wait…" : "处理中…") : en ? ({ signin: "Sign in", signup: "Create account", reset: "Send reset email", change: "Update password" })[mode] : ({ signin: "登录", signup: "创建账号", reset: "发送重设邮件", change: "更新密码" })[mode]}</button>
    </fieldset></form>}
    {message && <p role="status" aria-live="polite">{message}</p>}
    {!account && <p><a href={`/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`} target="_top">{en ? "Or continue with ChatGPT" : "也可使用 ChatGPT 登录"}</a></p>}
    <p>{en ? "Email and ChatGPT accounts have separate workspaces. Matching email addresses do not merge saved data." : "邮箱账号与 ChatGPT 账号分别保存工作台资料，相同邮箱不会自动合并数据。"}</p>
  </section>;
}
