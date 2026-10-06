import Link from "next/link";
import { runtimeMailConfiguration } from "../lib/mailRuntime";
import { getAppUser } from "../lib/appUser";
import { NotificationPreferences } from "./NotificationPreferences";
import { SiteHeader, SiteFooter } from "./SiteChrome";
export async function NotificationsPage({ lang }: { lang: "zh" | "en" }) {
  const user = await getAppUser();
  return <main><SiteHeader lang={lang} languageHref={`${lang === "en" ? "" : "/en"}/notifications`} /><div className="product-shell">{user && !user.emailVerified ? <section className="product-panel"><h1>{lang === "en" ? "Verify your email" : "验证邮箱"}</h1><p>{lang === "en" ? "Your workspace is available. Verify your email before receiving notifications." : "工作台可以正常使用。接收邮件通知前，请先验证邮箱。"}</p><Link href={`${lang === "en" ? "/en" : ""}/login?return_to=${encodeURIComponent(`${lang === "en" ? "/en" : ""}/notifications`)}`}>{lang === "en" ? "Open account" : "打开账号设置"}</Link></section> : <NotificationPreferences lang={lang} signedIn={!!user} deliveryEnabled={(await runtimeMailConfiguration()).enabled} />}</div><SiteFooter lang={lang} /></main>;
}
