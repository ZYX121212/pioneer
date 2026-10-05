import { NotificationsPage } from "../components/NotificationsPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "通知偏好 — Pioneer", robots: { index: false, follow: false } };
export default function Page() { return <NotificationsPage lang="zh" />; }
