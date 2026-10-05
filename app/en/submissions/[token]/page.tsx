import { SubmissionReceipt } from "../../../components/SubmissionReceipt";
export const dynamic = "force-dynamic";
export const metadata = { title: "Submission status — Pioneer", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Receipt({ params }: { params: Promise<{ token: string }> }) { const { token } = await params; return <SubmissionReceipt token={token} lang="en" />; }
