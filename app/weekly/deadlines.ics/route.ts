import { buildWeeklyCalendar, weeklyIssue } from "../../data/weekly";
export const dynamic = "force-dynamic";
export function GET() {
  return new Response(buildWeeklyCalendar("zh"), { headers: {
    "Content-Type": "text/calendar; charset=utf-8",
    "Content-Disposition": `attachment; filename="pioneer-weekly-${weeklyIssue.id}.ics"`,
    "Cache-Control": "no-store",
  } });
}
