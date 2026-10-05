import Link from "next/link";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { isSiteAdmin } from "../../lib/admin";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { ReviewDashboard } from "../../components/ReviewDashboard";
export const dynamic = "force-dynamic";
export const metadata = { title: "资源审核 — Pioneer", robots: { index: false, follow: false } };
export default async function ReviewsPage() {
  await requireChatGPTUser("/admin/reviews");
  const allowed = await isSiteAdmin();
  return <main><SiteHeader /><section className="product-shell">{allowed ? <ReviewDashboard /> : <><h1>此页面仅供站点管理员使用</h1><p>登录不会自动获得管理权限。</p><Link href="/">返回 Pioneer</Link></>}</section><SiteFooter /></main>;
}
