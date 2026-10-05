import Link from "next/link";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { isSiteAdmin } from "../../lib/admin";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import { MailDashboard } from "../../components/MailDashboard";
export const dynamic = "force-dynamic";
export const metadata = { title: "通知发布 — Pioneer", robots: { index: false, follow: false } };
export default async function Page() {
  await requireChatGPTUser("/admin/mail");
  const admin = await isSiteAdmin();
  return <main><SiteHeader /><section className="product-shell">{admin ? <MailDashboard /> : <><h1>此页面仅供站点管理员使用</h1><p>登录不会自动获得发信权限。</p><Link href="/">返回 Pioneer</Link></>}</section><SiteFooter /></main>;
}
