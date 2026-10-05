import { getD1 } from "../../../db/d1";
import { listCommunity } from "../../lib/submissionService";
import { json } from "../../lib/http";
export async function GET(request: Request) {
  try { const type = new URL(request.url).searchParams.get("type") ?? undefined; return json({ resources: await listCommunity(await getD1(), type) }); }
  catch (error) { console.error("Community data unavailable", error); return json({ error: "Community resources temporarily unavailable" }, 503); }
}
