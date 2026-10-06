import { resources } from "../../../data/resources";
import { getD1 } from "../../../../db/d1";
import { isSiteAdmin } from "../../../lib/admin";
import { getAppUser } from "../../../lib/appUser";
import { cleanText, json, sameOrigin } from "../../../lib/http";
import { normalizePublicUrl } from "../../../lib/resourceReview";
import { recordReview, resolveResourceReport, type SubmissionRow } from "../../../lib/submissionService";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!await isSiteAdmin()) return json({ error: "Administrator access required" }, 403);
  try { const db = await getD1(); return json({ submissions: (await db.prepare("SELECT * FROM resource_submissions ORDER BY CASE WHEN status IN ('pending','reviewing') THEN 0 ELSE 1 END, created_at DESC LIMIT 100").all()).results, reports: (await db.prepare("SELECT * FROM resource_reports ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, created_at DESC LIMIT 100").all()).results }); }
  catch (error) { console.error("Review queue unavailable", error); return json({ error: "Review queue unavailable" }, 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isSiteAdmin()) return json({ error: "Administrator access required" }, 403);
  try {
    const payload = await request.json(), id = Number(payload.id), action = cleanText(payload.action, 20), note = cleanText(payload.note, 1200);
    if (!Number.isSafeInteger(id) || id < 1 || note.length < 20) return json({ error: "Provide the record and a review note of at least 20 characters" }, 400);
    const db = await getD1(), user = (await getAppUser())!;
    if (action === "resolve-report") {
      const outcome = await resolveResourceReport(db, id, note, user.id);
      if (outcome === "missing") return json({ error: "Report not found" }, 404);
      if (outcome === "already-resolved") return json({ error: "This report has already been resolved. Reload the queue." }, 409);
      return json({ ok: true });
    }
    const row = await db.prepare("SELECT * FROM resource_submissions WHERE id = ?").bind(id).first<SubmissionRow>();
    if (!row) return json({ error: "Submission not found" }, 404);
    if (!["approve", "reject", "withdraw"].includes(action)) return json({ error: "Unknown review action" }, 400);
    if (action === "approve") {
      if (!row.canonical_url) {
        try { row.canonical_url = normalizePublicUrl(row.resource_url); } catch { return json({ error: "Legacy submission needs a valid public HTTPS source; ask the contributor to resubmit" }, 400); }
        await db.prepare("UPDATE resource_submissions SET canonical_url = ? WHERE id = ?").bind(row.canonical_url, row.id).run();
      }
      if (resources.some(resource => { try { return normalizePublicUrl(resource.url) === row.canonical_url; } catch { return false; } })) return json({ error: "This source is already in the curated directory" }, 409);
      if (payload.officialConfirmed !== true) return json({ error: "Confirm official ownership and check the submitted date first" }, 400);
      const sourceUrl = normalizePublicUrl(String(payload.sourceUrl ?? "")), title = cleanText(payload.sourceTitle, 160), excerpt = cleanText(payload.sourceExcerpt, 160);
      if (sourceUrl !== row.canonical_url || title.length < 2 || excerpt.length < 20) return json({ error: "Supply the matching official URL, title and a short evidence excerpt" }, 400);
      const outcome = await recordReview(db, row, { status: "approved", reason: "editor_approved", evidence: { checkedAt: new Date().toISOString(), finalUrl: sourceUrl, title, excerpt, checks: ["editor_verified"] } }, user.id, note);
      if (outcome === "duplicate") return json({ error: "This official source already has a published resource. Reload the queue." }, 409);
    } else await recordReview(db, row, { status: "rejected", reason: `editor_rejected: ${note}`, evidence: { checkedAt: new Date().toISOString(), checks: [action] } }, user.id, note);
    return json({ ok: true });
  } catch (error) { console.error("Moderation failed", error); return json({ error: "Review could not be saved" }, 503); }
}
