import type { Database } from "../../db/types";
import { normalizePublicUrl, reviewResource, type ReviewResult } from "./resourceReview";

export type SubmissionRow = {
  id: number; resource_type: string; resource_name: string; resource_url: string;
  canonical_url: string; location: string | null; deadline: string | null; stage: string;
  why_useful: string; status: string; review_reason: string | null; review_evidence: string | null;
  published_slug: string | null; review_token: string; share_token: string; reviewed_at: string | null;
};
export type CommunityRow = { id: number; slug: string; submission_id: number; canonical_url: string; resource_type: string; name: string; url: string; location: string | null; deadline: string | null; stage: string; contributor_reason: string; source_title: string; source_excerpt: string; evidence: string; status: string; verified_at: string; created_at: string };

export async function findSubmission(db: Database, token: string): Promise<SubmissionRow | null> {
  return db.prepare("SELECT * FROM resource_submissions WHERE review_token = ?").bind(token).first<SubmissionRow>();
}
export function submissionResult(row: SubmissionRow) {
  return { ok: true, status: row.status, name: row.resource_name, reason: row.review_reason, reviewedAt: row.reviewed_at, evidence: row.review_evidence ? JSON.parse(row.review_evidence) : null, resourcePath: row.published_slug ? (row.published_slug.startsWith("/") ? row.published_slug : `/community/${row.published_slug}`) : null, reviewToken: row.review_token, shareToken: row.share_token };
}

export async function recordReview(db: Database, row: SubmissionRow, result: ReviewResult, actor = "automatic-source-check", auditReason?: string) {
  const slug = `resource-${row.id}`;
  const published = result.status === "approved";
  const evidence = JSON.stringify(result.evidence);
  const statements = [];
  if (published) statements.push(db.prepare(`INSERT INTO community_resources (slug, submission_id, canonical_url, resource_type, name, url, location, deadline, stage, contributor_reason, source_title, source_excerpt, evidence, status, verified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?) ON CONFLICT(canonical_url) DO UPDATE SET status = 'published', verified_at = excluded.verified_at, evidence = excluded.evidence, source_title = excluded.source_title, source_excerpt = excluded.source_excerpt`).bind(slug, row.id, row.canonical_url, row.resource_type, row.resource_name, result.evidence.finalUrl ?? row.resource_url, row.location, row.deadline, row.stage, row.why_useful, result.evidence.title ?? row.resource_name, result.evidence.excerpt ?? "", evidence, result.evidence.checkedAt));
  if (!published) statements.push(db.prepare("UPDATE community_resources SET status = 'withdrawn' WHERE submission_id = ?").bind(row.id));
  statements.push(db.prepare(`UPDATE resource_submissions SET status = ?, review_reason = ?, review_evidence = ?, reviewed_at = ?, reviewer = ?, published_slug = ${published ? "(SELECT slug FROM community_resources WHERE canonical_url = ?)" : "NULL"} WHERE id = ?`).bind(result.status, result.reason, evidence, result.evidence.checkedAt, actor, ...(published ? [row.canonical_url] : []), row.id));
  statements.push(db.prepare("INSERT INTO moderation_actions (submission_id, actor, action, reason) VALUES (?, ?, ?, ?)").bind(row.id, actor, result.status, auditReason ?? result.reason));
  await db.batch(statements);
}

export async function processSubmission(db: Database, row: SubmissionRow, sourceUrls: string[], knownHosts: Set<string>, fetcher: typeof fetch = fetch, now = new Date()) {
  const existing = sourceUrls.find(url => { try { return normalizePublicUrl(url) === row.canonical_url; } catch { return false; } });
  if (existing) {
    await db.prepare("UPDATE resource_submissions SET status = 'duplicate', review_reason = 'duplicate', reviewed_at = ?, reviewer = 'automatic-source-check' WHERE id = ?").bind(now.toISOString(), row.id).run();
    return;
  }
  const community = await db.prepare("SELECT slug FROM community_resources WHERE canonical_url = ? AND status = 'published'").bind(row.canonical_url).first<{ slug: string }>();
  if (community) {
    await db.prepare("UPDATE resource_submissions SET status = 'duplicate', review_reason = 'duplicate', published_slug = ?, reviewed_at = ?, reviewer = 'automatic-source-check' WHERE id = ?").bind(community.slug, now.toISOString(), row.id).run();
    return;
  }
  await recordReview(db, row, await reviewResource({ resourceName: row.resource_name, resourceType: row.resource_type, resourceUrl: row.resource_url, deadline: row.deadline ?? "", whyUseful: row.why_useful }, knownHosts, fetcher, now));
}

export async function listCommunity(db: Database, type?: string): Promise<CommunityRow[]> {
  const query = type ? "SELECT * FROM community_resources WHERE status IN ('published','archived') AND resource_type = ? ORDER BY created_at DESC LIMIT 200" : "SELECT * FROM community_resources WHERE status IN ('published','archived') ORDER BY created_at DESC LIMIT 200";
  const statement = db.prepare(query);
  return (await (type ? statement.bind(type) : statement).all<CommunityRow>()).results;
}
