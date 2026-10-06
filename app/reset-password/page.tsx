import { ResetPasswordPage } from "../components/ResetPasswordPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "重设密码 — Pioneer", robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) { const token = (await searchParams).token; return <ResetPasswordPage lang="zh" token={typeof token === "string" && token.length <= 512 ? token : ""} />; }
