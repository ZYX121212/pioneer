import { getD1 } from "../../../db/d1";
import { resources } from "../../data/resources";
import { cleanText, json, requestHash, sameOrigin } from "../../lib/http";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin" }, 403);
  try {
    const payload = await request.json(); const resourceKey = cleanText(payload.resourceKey, 120), reason = cleanText(payload.reason, 32), details = cleanText(payload.details, 1000);
    if (!["broken", "expired", "incorrect", "other"].includes(reason) || details.length < 10) return json({ error: "Explain the correction" }, 400);
    const db = await getD1();
    if (!resources.some(row => row.slug === resourceKey) && !await db.prepare("SELECT id FROM community_resources WHERE slug = ? AND status != 'withdrawn'").bind(resourceKey).first()) return json({ error: "Resource not found" }, 404);
    const hash = await requestHash(request);
    const count = await db.prepare("SELECT count(*) AS count FROM resource_reports WHERE requester_hash = ? AND created_at > datetime('now', '-1 hour')").bind(hash).first<{ count: number }>();
    if ((count?.count ?? 0) >= 5) return json({ error: "Too many reports. Retry later." }, 429);
    await db.prepare("INSERT INTO resource_reports (resource_key, reason, details, requester_hash) VALUES (?, ?, ?, ?)").bind(resourceKey, reason, details, hash).run();
    return json({ ok: true }, 201);
  } catch (error) { console.error("Correction failed", error); return json({ error: "Corrections temporarily unavailable" }, 503); }
}
