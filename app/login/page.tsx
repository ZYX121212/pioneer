import { EmailAccountPage } from "../components/EmailAccountPage";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, title: "邮箱登录 — Pioneer" };
export default async function Page({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) { return <EmailAccountPage lang="zh" returnTo={(await searchParams).return_to} />; }
