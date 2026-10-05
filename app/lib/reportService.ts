import type { Database } from "../../db/types";
type ReportDraft = { key: string; resourceKey: string; reason: string; details: string; requester: string };
type ReportRow = { resource_key: string; reason: string; details: string };
export async function saveResourceReport(db: Database, draft: ReportDraft): Promise<"saved" | "replayed" | "conflict" | "limited"> {
  const replay = (row: ReportRow) => row.resource_key === draft.resourceKey && row.reason === draft.reason && row.details === draft.details ? "replayed" as const : "conflict" as const;
  const existing = await db.prepare("SELECT resource_key, reason, details FROM resource_reports WHERE idempotency_key = ?").bind(draft.key).first<ReportRow>();
  if (existing) return replay(existing);
  const inserted = await db.prepare("INSERT INTO resource_reports (idempotency_key, resource_key, reason, details, requester_hash) SELECT ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM resource_reports WHERE requester_hash = ? AND created_at >= datetime('now', '-1 hour')) < 5 ON CONFLICT(idempotency_key) DO NOTHING RETURNING id").bind(draft.key, draft.resourceKey, draft.reason, draft.details, draft.requester, draft.requester).first();
  if (inserted) return "saved";
  const concurrent = await db.prepare("SELECT resource_key, reason, details FROM resource_reports WHERE idempotency_key = ?").bind(draft.key).first<ReportRow>();
  return concurrent ? replay(concurrent) : "limited";
}
