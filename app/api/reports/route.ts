import { getD1 } from "../../../db/d1";
import { resources } from "../../data/resources";
import { cleanText, json, requestHash, sameOrigin } from "../../lib/http";
import { saveResourceReport } from "../../lib/reportService";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin" }, 403);
  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 12_000) return json({ error: "Correction is too large" }, 413);
    payload = JSON.parse(body);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error();
  } catch { return json({ error: "Invalid correction" }, 400); }
  try {
    const key = payload.idempotencyKey === undefined ? crypto.randomUUID().replaceAll("-", "") : cleanText(payload.idempotencyKey, 64);
    if (!/^[a-f0-9]{32}$/.test(key)) return json({ error: "Invalid correction retry key" }, 400);
    const resourceKey = cleanText(payload.resourceKey, 120), reason = cleanText(payload.reason, 32), details = cleanText(payload.details, 1000);
    if (!["broken", "expired", "incorrect", "other"].includes(reason) || details.length < 10) return json({ error: "Explain the correction" }, 400);
    const db = await getD1();
    if (!resources.some(row => row.slug === resourceKey) && !await db.prepare("SELECT id FROM community_resources WHERE slug = ? AND status != 'withdrawn'").bind(resourceKey).first()) return json({ error: "Resource not found" }, 404);
    const outcome = await saveResourceReport(db, { key, resourceKey, reason, details, requester: await requestHash(request) });
    if (outcome === "limited") return json({ error: "Too many reports. Retry later." }, 429);
    if (outcome === "conflict") return json({ error: "This retry belongs to a different correction" }, 409);
    return json({ ok: true }, outcome === "saved" ? 201 : 200);
  } catch (error) { console.error("Correction failed", error); return json({ error: "Corrections temporarily unavailable" }, 503); }
}
