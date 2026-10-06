import { EmailAccountPage } from "../../components/EmailAccountPage";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, title: "Email sign in — Pioneer" };
export default async function Page({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) { return <EmailAccountPage lang="en" returnTo={(await searchParams).return_to} />; }
