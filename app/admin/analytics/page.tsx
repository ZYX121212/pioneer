import Link from "next/link";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { isSiteAdmin } from "../../lib/admin";
import AdminAnalytics from "../../components/AdminAnalytics";
export const dynamic = "force-dynamic";
export const metadata = { title: "内部统计 — Pioneer", robots: { index: false, follow: false } };
export default async function AnalyticsPage() {
  await requireChatGPTUser("/admin/analytics");
  if (!await isSiteAdmin()) return <main><h1>此页面仅供管理员使用</h1><Link href="/">返回 Pioneer</Link></main>;
  return <AdminAnalytics />;
}
