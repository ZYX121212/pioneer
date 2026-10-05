import { getD1 } from "../../../../db/d1";
import { json, sameOrigin } from "../../../lib/http";
import { unsubscribeByToken } from "../../../lib/newsletterService";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  let token: string;
  try { const body = await request.text(); if (body.length > 1024) throw new Error(); const payload = JSON.parse(body); if (typeof payload?.token !== "string") throw new Error(); token = payload.token; } catch { return json({ error: "Invalid unsubscribe link" }, 400); }
  try { return await unsubscribeByToken(await getD1(), token) ? json({ ok: true }) : json({ error: "Invalid unsubscribe link" }, 400); } catch (error) { console.error("Unsubscribe failed", error); return json({ error: "Unable to unsubscribe. Please retry." }, 503); }
}
