import { NotificationsPage } from "../../components/NotificationsPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "Notification preferences — Pioneer", robots: { index: false, follow: false } };
export default function Page() { return <NotificationsPage lang="en" />; }
