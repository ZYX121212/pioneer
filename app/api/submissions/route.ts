import { getD1 } from "../../../db/d1";
import { resources } from "../../data/resources";
import { json, cleanText, requestHash, sameOrigin } from "../../lib/http";
import { normalizePublicUrl, officialHosts, validDeadline } from "../../lib/resourceReview";
import { findSubmission, processSubmission, submissionResult, type SubmissionRow } from "../../lib/submissionService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = new Set(["program", "organization", "event", "knowledge", "startup"]);
const ALLOWED_RELATIONSHIPS = new Set(["official", "participant", "community", "other"]);
const TOKEN = /^[a-f0-9]{32}$/;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!TOKEN.test(token)) return json({ error: "Invalid receipt" }, 400);
  try {
    const row = await findSubmission(await getD1(), token);
    return row ? json(submissionResult(row)) : json({ error: "Receipt not found" }, 404);
  } catch (error) { console.error("Submission status unavailable", error); return json({ error: "审核记录暂时不可用，请稍后重试。" }, 503); }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 12_000) return json({ error: "Submission is too large" }, 413);
  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 12_000) return json({ error: "Submission is too large" }, 413);
    payload = JSON.parse(body);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error();
  } catch { return json({ error: "Invalid submission" }, 400); }
  if (cleanText(payload.website, 120)) return json({ error: "Submission could not be accepted" }, 400);
  const resourceType = cleanText(payload.resourceType, 32), resourceName = cleanText(payload.resourceName, 120);
  const resourceUrl = cleanText(payload.resourceUrl, 500), location = cleanText(payload.location, 100), deadline = cleanText(payload.deadline, 100);
  const whyUseful = cleanText(payload.whyUseful, 1200), submitterName = cleanText(payload.submitterName, 100);
  const submitterEmail = cleanText(payload.submitterEmail, 254).toLowerCase(), relationship = cleanText(payload.relationship, 32);
  const language = payload.language === "en" ? "en" : "zh", sourcePath = cleanText(payload.sourcePath, 160);
  const stage = ["idea", "validation", "traction", "growth"].includes(String(payload.stage)) ? String(payload.stage) : "any";
  const idempotencyKey = cleanText(payload.idempotencyKey, 32);
  let canonicalUrl: string;
  try { canonicalUrl = normalizePublicUrl(resourceUrl); } catch { return json({ error: language === "en" ? "Use a public HTTPS official website" : "请填写公开的 HTTPS 官方链接" }, 400); }
  if (!ALLOWED_TYPES.has(resourceType) || !ALLOWED_RELATIONSHIPS.has(relationship) || resourceName.length < 2 || whyUseful.length < 20 || !submitterName || !EMAIL_PATTERN.test(submitterEmail) || !validDeadline(deadline) || !TOKEN.test(idempotencyKey)) return json({ error: language === "en" ? "Complete the required fields and use YYYY-MM-DD for dates" : "请完整填写必填信息，日期使用 YYYY-MM-DD" }, 400);
  try {
    const database = await getD1();
    const input = { resource_type: resourceType, resource_name: resourceName, canonical_url: canonicalUrl, location: location || null, deadline: deadline || null, why_useful: whyUseful, submitter_name: submitterName, submitter_email: submitterEmail, relationship, language, stage };
    const matches = (row: SubmissionRow) => Object.entries(input).every(([key, value]) => (row as unknown as Record<string, unknown>)[key] === value);
    const conflict = () => json({ error: language === "en" ? "This retry belongs to a different submission. Start a new submission for changed details." : "这次重试对应另一份提交，请使用新提交保存更改后的内容。" }, 409);
    const existing = await database.prepare("SELECT * FROM resource_submissions WHERE idempotency_key = ?").bind(idempotencyKey).first<SubmissionRow>();
    if (existing) {
      if (!matches(existing)) return conflict();
      if (existing.status === "reviewing") {
        const urls = resources.map(resource => resource.url);
        await processSubmission(database, existing, urls, officialHosts(urls));
        return json(submissionResult((await findSubmission(database, existing.review_token))!));
      }
      return json(submissionResult(existing));
    }
    const hash = await requestHash(request);
    const quota = await database.prepare("SELECT count(*) AS count FROM resource_submissions WHERE requester_hash = ? AND created_at > datetime('now', '-1 hour')").bind(hash).first<{ count: number }>();
    if ((quota?.count ?? 0) >= 5) return json({ error: language === "en" ? "Please wait before submitting again" : "提交过于频繁，请稍后重试" }, 429);
    const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12), reviewToken = crypto.randomUUID().replace(/-/g, "");
    await database.prepare(`INSERT INTO resource_submissions (resource_type, resource_name, resource_url, canonical_url, location, deadline, why_useful, submitter_name, submitter_email, relationship, language, source_path, status, share_token, review_token, idempotency_key, requester_hash, stage, created_at) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'reviewing', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP WHERE (SELECT count(*) FROM resource_submissions WHERE requester_hash = ? AND created_at >= datetime('now', '-1 hour')) < 5 ON CONFLICT(idempotency_key) DO NOTHING`).bind(resourceType, resourceName, resourceUrl, canonicalUrl, location || null, deadline || null, whyUseful, submitterName, submitterEmail, relationship, language, sourcePath.startsWith("/") ? sourcePath : language === "en" ? "/en/submit" : "/submit", shareToken, reviewToken, idempotencyKey, hash, stage, hash).run();
    let row = await database.prepare("SELECT * FROM resource_submissions WHERE idempotency_key = ?").bind(idempotencyKey).first<SubmissionRow>();
    if (!row) return json({ error: language === "en" ? "Please wait before submitting again" : "提交过于频繁，请稍后重试" }, 429);
    if (!matches(row)) return conflict();
    if (row.review_token !== reviewToken) return json(submissionResult(row));
    const sourceUrls = resources.map(resource => resource.url);
    const match = resources.find(resource => normalizePublicUrl(resource.url) === canonicalUrl);
    await processSubmission(database, row, sourceUrls, officialHosts(sourceUrls));
    if (match) await database.prepare("UPDATE resource_submissions SET published_slug = ? WHERE id = ? AND status = 'duplicate'").bind(match.detailPath ?? `/resources/${match.slug}`, row.id).run();
    row = (await findSubmission(database, reviewToken))!;
    return json(submissionResult(row), 201);
  } catch (error) {
    console.error("Resource submission failed", error);
    return json({ error: language === "en" ? "Unable to finish. Your input is retained; retry with the same receipt." : "暂时无法完成，已保留表单内容；请重试。" }, 503);
  }
}
