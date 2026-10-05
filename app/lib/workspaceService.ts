import type { Database } from "../../db/types";
import { emptyWorkspace, validateWorkspace, type WorkspaceState } from "./workspaceModel";
export type WorkspaceRecord = { state: WorkspaceState; version: number; updatedAt: string | null };
export async function loadWorkspace(db: Database, userId: string): Promise<WorkspaceRecord> {
  const row = await db.prepare("SELECT state, version, updated_at FROM founder_workspaces WHERE user_id = ?").bind(userId).first<{ state: string; version: number; updated_at: string }>();
  return row ? { state: validateWorkspace(JSON.parse(row.state)), version: row.version, updatedAt: row.updated_at } : { state: emptyWorkspace(), version: 0, updatedAt: null };
}
export async function writeWorkspace(db: Database, userId: string, expectedVersion: number, state: WorkspaceState): Promise<WorkspaceRecord | null> {
  const checked = validateWorkspace(state), serialized = JSON.stringify(checked), updatedAt = new Date().toISOString();
  const row = expectedVersion === 0
    ? await db.prepare("INSERT INTO founder_workspaces (user_id, state, version, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING RETURNING version").bind(userId, serialized, updatedAt).first<{ version: number }>()
    : await db.prepare("UPDATE founder_workspaces SET state = ?, version = version + 1, updated_at = ? WHERE user_id = ? AND version = ? RETURNING version").bind(serialized, updatedAt, userId, expectedVersion).first<{ version: number }>();
  return row ? { state: checked, version: row.version, updatedAt } : null;
}
// Keep a version tombstone after clearing personal data: a stale tab cannot resurrect it.
export async function clearWorkspace(db: Database, userId: string, expectedVersion: number) { return writeWorkspace(db, userId, expectedVersion, emptyWorkspace()); }
