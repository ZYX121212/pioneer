import Link from "next/link";
import { requireAppUser } from "../../lib/appUser";
import { isSiteAdmin } from "../../lib/admin";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import { MailDashboard } from "../../components/MailDashboard";
export const dynamic = "force-dynamic";
export const metadata = { title: "通知发布 — Pioneer", robots: { index: false, follow: false } };
export default async function Page() {
  await requireAppUser("/admin/mail");
  const admin = await isSiteAdmin();
  return <main><SiteHeader /><section className="product-shell">{admin ? <MailDashboard /> : <><h1>此页面仅供站点管理员使用</h1><p>登录不会自动获得发信权限。</p><Link href="/">返回 Pioneer</Link></>}</section><SiteFooter /></main>;
}
