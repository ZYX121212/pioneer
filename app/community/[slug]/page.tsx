import { CommunityDetail } from "../../components/CommunityDetail";
export const dynamic = "force-dynamic";
export const metadata = { title: "社区资源与核验依据 — Pioneer" };
export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <CommunityDetail slug={slug} lang="zh" />; }
