import { WeeklyBrief, weeklyMetadata } from "../../components/WeeklyBrief";

export const dynamic = "force-dynamic";
export const metadata = weeklyMetadata("en");
export default function EnglishWeeklyPage() { return <WeeklyBrief lang="en" />; }
