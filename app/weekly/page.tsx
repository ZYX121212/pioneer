import { WeeklyBrief, weeklyMetadata } from "../components/WeeklyBrief";

export const dynamic = "force-dynamic";
export const metadata = weeklyMetadata("zh");
export default function WeeklyPage() { return <WeeklyBrief lang="zh" />; }
