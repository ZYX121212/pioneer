import { validateWorkspace, type WorkspaceState } from "./workspaceModel";
const legacyKeys = ["pioneer:founder-archive-v1", "pioneer:guide-progress-v1", "pioneer:founder-project-v1", "pioneer:guide-decisions-v1"];
export const backupByteLimit = 1_000_000;
export function parseWorkspaceBackup(text: string): WorkspaceState {
  if (new TextEncoder().encode(text).length > backupByteLimit) throw new Error("backup_too_large");
  const input: unknown = JSON.parse(text);
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("invalid_backup");
  const row = input as Record<string, unknown>;
  if (row.schemaVersion != null && row.schemaVersion !== 1) throw new Error("unsupported_backup_version");
  if (legacyKeys.some(key => Object.hasOwn(row, key))) {
    const read = (key: string, fallback: unknown) => {
      const value = row[key];
      if (value == null) return fallback;
      if (typeof value !== "string") throw new Error("invalid_legacy_backup");
      return JSON.parse(value);
    };
    const oldProject = read(legacyKeys[2], null);
    if (oldProject !== null && (typeof oldProject !== "object" || Array.isArray(oldProject))) throw new Error("invalid_legacy_backup");
    const project = oldProject?.name?.trim() ? oldProject : null;
    return validateWorkspace({ archive: read(legacyKeys[0], []), completions: read(legacyKeys[1], []), project, decisions: read(legacyKeys[3], []), tasks: [], shortlist: [] });
  }
  const candidate = (Object.hasOwn(row, "state") ? row.state : row) as Record<string, unknown>;
  if (!candidate || typeof candidate !== "object" || !["project", "archive", "decisions", "completions", "shortlist", "tasks"].every(key => Object.hasOwn(candidate, key))) throw new Error("invalid_backup");
  // Only validated workspace fields are imported; metadata, version and account identifiers are ignored.
  return validateWorkspace(candidate);
}
export function mergeWorkspaceBackup(current: WorkspaceState, backup: WorkspaceState): WorkspaceState {
  const live = validateWorkspace(current), imported = validateWorkspace(backup);
  return validateWorkspace({
    project: live.project ?? imported.project,
    archive: [...live.archive, ...imported.archive.filter(row => !live.archive.some(existing => existing.id === row.id))],
    decisions: [...live.decisions, ...imported.decisions.filter(row => !live.decisions.some(existing => existing.guide === row.guide))],
    tasks: [...live.tasks, ...imported.tasks.filter(row => !live.tasks.some(existing => existing.id === row.id))],
    completions: [...new Set([...live.completions, ...imported.completions])],
    shortlist: [...new Set([...live.shortlist, ...imported.shortlist])],
  });
}
