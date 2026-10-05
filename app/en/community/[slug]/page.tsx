import { CommunityDetail } from "../../../components/CommunityDetail";
export const dynamic = "force-dynamic";
export const metadata = { title: "Community source evidence — Pioneer" };
export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <CommunityDetail slug={slug} lang="en" />; }
