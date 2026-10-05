import { WeeklyBrief, weeklyMetadata } from "../../../components/WeeklyBrief";
export const metadata = weeklyMetadata("zh", true);
export default function WeeklyArchive() { return <WeeklyBrief lang="zh" archive />; }
