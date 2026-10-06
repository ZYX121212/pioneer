import { emptyWorkspace, validateWorkspace, type WorkspaceState, type ArchiveEntry, type FounderProject, type GuideDecision } from "./workspaceModel";
export type { ArchiveEntry, FounderProject, GuideDecision, WorkspaceState } from "./workspaceModel";
export const ARCHIVE_KEY = "pioneer:founder-archive-v1";
export const COMPLETION_KEY = "pioneer:guide-progress-v1";
export const PROJECT_KEY = "pioneer:founder-project-v1";
export const DECISION_KEY = "pioneer:guide-decisions-v1";
export const ARCHIVE_EVENT = "pioneer:archive-updated";
type Record = { state: WorkspaceState; version: number; updatedAt: string | null };
let cached: Record = { state: emptyWorkspace(), version: 0, updatedAt: null };
let initialized = false;
let loading: Promise<Record> | null = null;
let queue: Promise<unknown> = Promise.resolve();
export class WorkspaceError extends Error { constructor(public code: string, public status: number, message: string) { super(message); } }
function notify() { if (typeof window !== "undefined") window.dispatchEvent(new Event(ARCHIVE_EVENT)); }
async function responseRecord(response: Response): Promise<Record> {
  const data = await response.json();
  if (!response.ok) throw new WorkspaceError(data.code ?? "unavailable", response.status, data.error ?? "Workspace unavailable");
  return { state: validateWorkspace(data.state), version: data.version, updatedAt: data.updatedAt };
}
export async function refreshWorkspace() {
  try { cached = await responseRecord(await fetch("/api/workspace", { cache: "no-store" })); initialized = true; notify(); return cached; }
  catch (error) { if (error instanceof WorkspaceError && error.status === 401) { cached = { state: emptyWorkspace(), version: 0, updatedAt: null }; initialized = false; notify(); } throw error; }
}
export async function initializeWorkspace(): Promise<Record> {
  if (initialized) return cached;
  if (!loading) loading = refreshWorkspace().finally(() => { loading = null; });
  return loading;
}
export function workspaceSnapshot() { return cached; }
export async function updateWorkspace(change: (state: WorkspaceState) => void | WorkspaceState, expectedVersion?: number) {
  const operation = queue.catch(() => {}).then(async () => {
    await initializeWorkspace();
    if (expectedVersion !== undefined && cached.version !== expectedVersion) throw new WorkspaceError("version_conflict", 409, "Workspace changed after backup preview");
    const draft = structuredClone(cached.state), replacement = change(draft);
    const next = validateWorkspace(replacement ?? draft);
    const saved = await responseRecord(await fetch("/api/workspace", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version: cached.version, state: next }) }));
    cached = saved; notify(); return saved;
  });
  queue = operation; return operation;
}
export async function clearWorkspaceData(expectedVersion?: number) {
  const operation = queue.catch(() => {}).then(async () => { await initializeWorkspace(); if (expectedVersion !== undefined && cached.version !== expectedVersion) throw new WorkspaceError("version_conflict", 409, "Workspace changed after confirmation opened"); cached = await responseRecord(await fetch("/api/workspace", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ version: cached.version }) })); notify(); return cached; });
  queue = operation; return operation;
}
export function workspaceError(error: unknown, lang: "zh" | "en" = "zh") {
  if (error instanceof WorkspaceError && error.code === "signin_required") return lang === "en" ? "Sign in to save to your private workspace." : "请先登录，再保存到私密工作台。";
  if (error instanceof WorkspaceError && error.code === "version_conflict") return lang === "en" ? "Another page changed your workspace. Refresh the workspace and retry; your input is retained." : "另一页面已更新档案。请在工作台刷新后重试，当前输入仍保留。";
  return lang === "en" ? "Not saved. Keep your input and retry. If your archive is full, export and remove older evidence in the workspace." : "尚未保存，请保留输入后重试；档案已满时，可先在工作台导出并移除旧证据。";
}
export function readArchive() { return cached.state.archive; }
export function readProject() { return cached.state.project; }
export function readDecisions() { return cached.state.decisions; }
export function readCompletions() { return cached.state.completions; }
export async function saveArchiveEntry(entry: Omit<ArchiveEntry, "id" | "savedAt">) {
  const next = { ...entry, id: crypto.randomUUID(), savedAt: new Date().toISOString() };
  return updateWorkspace(state => { if (state.archive.length >= 40) throw new Error("Archive full"); state.archive.unshift(next); });
}
export async function saveProject(project: Omit<FounderProject, "updatedAt">) { return updateWorkspace(state => { state.project = { ...state.project, ...project, updatedAt: new Date().toISOString() }; }); }
export async function saveGuideDecision(decision: Omit<GuideDecision, "savedAt">) { return updateWorkspace(state => { state.decisions = [{ ...decision, savedAt: new Date().toISOString() }, ...state.decisions.filter(row => row.guide !== decision.guide)]; }); }
export async function toggleCompletion(slug: string) { const saved = await updateWorkspace(state => { state.completions = state.completions.includes(slug) ? state.completions.filter(value => value !== slug) : [...state.completions, slug]; }); return saved.state.completions; }
export async function toggleResource(slug: string) { return updateWorkspace(state => { if (state.shortlist.includes(slug)) state.shortlist = state.shortlist.filter(value => value !== slug); else { if (state.shortlist.length >= 50) throw new Error("Shortlist full"); state.shortlist.push(slug); } }); }
// Legacy browser state is read only through this explicit import/export flow, never automatically uploaded.
export function readLegacyWorkspace(): WorkspaceState {
  const read = (key: string, fallback: unknown) => JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(fallback));
  const project = read(PROJECT_KEY, null);
  return validateWorkspace({ ...emptyWorkspace(), project: project?.name?.trim() ? project : null, archive: read(ARCHIVE_KEY, []), decisions: read(DECISION_KEY, []), completions: read(COMPLETION_KEY, []) });
}
export function hasLegacyWorkspace() { return typeof window !== "undefined" && [ARCHIVE_KEY, COMPLETION_KEY, PROJECT_KEY, DECISION_KEY].some(key => !!window.localStorage.getItem(key)); }
export async function importLegacyWorkspace(replaceProject = false) {
  const legacy = readLegacyWorkspace();
  return updateWorkspace(state => {
    if (!state.project || replaceProject) state.project = legacy.project ?? state.project;
    state.archive = [...state.archive, ...legacy.archive.filter(row => !state.archive.some(existing => existing.id === row.id))];
    state.decisions = [...state.decisions, ...legacy.decisions.filter(row => !state.decisions.some(existing => existing.guide === row.guide))];
    state.completions = [...new Set([...state.completions, ...legacy.completions])];
  });
}
export function downloadWorkspace(state: unknown, filename = "pioneer-workspace.json") { const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.append(link); try { link.click(); } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); } }
