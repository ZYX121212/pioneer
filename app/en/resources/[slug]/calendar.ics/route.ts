import { getResourceBySlug } from "../../../../data/resources";
import { eventCalendarResponse } from "../../../../lib/eventCalendar";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{slug:string}> }) {
  return eventCalendarResponse(request, getResourceBySlug((await params).slug), "en");
}
