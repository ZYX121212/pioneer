import { CommunityDirectory } from "../components/CommunityDirectory";
export const dynamic = "force-dynamic";
export const metadata = { title: "社区创业资源 — Pioneer", alternates: { canonical: "/community", languages: { en: "/en/community" } } };
export default function CommunityPage() { return <CommunityDirectory lang="zh" />; }
