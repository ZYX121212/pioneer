export type FounderStage = "idea" | "validation" | "traction" | "growth";
export type FounderGoal = "customers" | "product" | "funding" | "team" | "learning";
export type ArchiveEntry = { id: string; guide: string; type: string; title: string; summary: string; content: string; savedAt: string };
export type FounderProject = { name: string; oneLine: string; targetUser: string; currentRisk: string; nextAction: string; updatedAt: string; stage?: FounderStage; goals?: FounderGoal[] };
export type GuideDecision = { guide: string; decision: "continue" | "narrow" | "change" | "stop"; reason: string; savedAt: string };
export type FounderTask = { id: string; text: string; due: string; done: boolean; createdAt: string };
export type WorkspaceState = { project: FounderProject | null; archive: ArchiveEntry[]; decisions: GuideDecision[]; completions: string[]; shortlist: string[]; tasks: FounderTask[] };
export const emptyWorkspace = (): WorkspaceState => ({ project: null, archive: [], decisions: [], completions: [], shortlist: [], tasks: [] });
const stages = ["idea", "validation", "traction", "growth"];
const goals = ["customers", "product", "funding", "team", "learning"];
function object(value: unknown): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object"); return value as Record<string, unknown>; }
function text(value: unknown, max: number, required = false): string { if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error("Invalid text field"); return value; }
function array(value: unknown, max: number): unknown[] { if (!Array.isArray(value) || value.length > max) throw new Error("Invalid list size"); return value; }
function date(value: unknown): string { const result = text(value, 40, true); if (!Number.isFinite(Date.parse(result))) throw new Error("Invalid timestamp"); return result; }
function slug(value: unknown): string { const result = text(value, 100, true); if (!/^[a-z0-9][a-z0-9-]*$/.test(result)) throw new Error("Invalid identifier"); return result; }
function unique(values: string[]) { if (new Set(values).size !== values.length) throw new Error("Duplicate entries"); return values; }
export function validateWorkspace(value: unknown): WorkspaceState {
  const input = object(value), state = emptyWorkspace();
  if (input.project != null) {
    const row = object(input.project);
    const stage = row.stage ?? "idea"; if (!stages.includes(String(stage))) throw new Error("Invalid stage");
    const selectedGoals = unique(array(row.goals ?? [], 5).map(value => { if (!goals.includes(String(value))) throw new Error("Invalid goal"); return String(value); }));
    state.project = { name: text(row.name, 120, true), oneLine: text(row.oneLine, 1200), targetUser: text(row.targetUser, 1200), currentRisk: text(row.currentRisk, 1200), nextAction: text(row.nextAction, 1200), stage: stage as FounderStage, goals: selectedGoals as FounderGoal[], updatedAt: date(row.updatedAt) };
  }
  state.archive = array(input.archive ?? [], 40).map(value => { const row = object(value); return { id: slug(row.id), guide: slug(row.guide), type: text(row.type, 100, true), title: text(row.title, 250, true), summary: text(row.summary, 5000), content: text(row.content, 20_000), savedAt: date(row.savedAt) }; });
  unique(state.archive.map(row => row.id));
  state.decisions = array(input.decisions ?? [], 40).map(value => { const row = object(value); if (!["continue", "narrow", "change", "stop"].includes(String(row.decision))) throw new Error("Invalid decision"); return { guide: slug(row.guide), decision: row.decision as GuideDecision["decision"], reason: text(row.reason, 5000, true), savedAt: date(row.savedAt) }; });
  unique(state.decisions.map(row => row.guide));
  state.completions = unique(array(input.completions ?? [], 40).map(slug));
  state.shortlist = unique(array(input.shortlist ?? [], 50).map(slug));
  state.tasks = array(input.tasks ?? [], 100).map(value => { const row = object(value); const due = text(row.due, 10); if (due && (!/^\d{4}-\d{2}-\d{2}$/.test(due) || !Number.isFinite(Date.parse(due)) || new Date(due).toISOString().slice(0, 10) !== due)) throw new Error("Invalid due date"); if (typeof row.done !== "boolean") throw new Error("Invalid task status"); return { id: slug(row.id), text: text(row.text, 500, true), due, done: row.done, createdAt: date(row.createdAt) }; });
  unique(state.tasks.map(row => row.id));
  if (new TextEncoder().encode(JSON.stringify(state)).length > 150_000) throw new Error("Workspace exceeds 150 KB; export and remove older evidence first");
  return state;
}
