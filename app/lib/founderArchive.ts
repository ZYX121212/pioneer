export const ARCHIVE_KEY = "pioneer:founder-archive-v1";
export const COMPLETION_KEY = "pioneer:guide-progress-v1";
export const PROJECT_KEY = "pioneer:founder-project-v1";
export const DECISION_KEY = "pioneer:guide-decisions-v1";
export const ARCHIVE_EVENT = "pioneer:archive-updated";

export type ArchiveEntry = {
  id: string;
  guide: string;
  type: string;
  title: string;
  summary: string;
  content: string;
  savedAt: string;
};

export type FounderProject = {
  name: string;
  oneLine: string;
  targetUser: string;
  currentRisk: string;
  nextAction: string;
  updatedAt: string;
};

export type GuideDecision = {
  guide: string;
  decision: "continue" | "narrow" | "change" | "stop";
  reason: string;
  savedAt: string;
};

export function readArchive(): ArchiveEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(ARCHIVE_KEY) || "[]") as ArchiveEntry[];
  } catch {
    return [];
  }
}

export function saveArchiveEntry(entry: Omit<ArchiveEntry, "id" | "savedAt">) {
  const next: ArchiveEntry = {
    ...entry,
    id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    savedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify([next, ...readArchive()].slice(0, 40)));
  window.dispatchEvent(new Event(ARCHIVE_EVENT));
}

export function readProject(): FounderProject | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(PROJECT_KEY) || "null") as FounderProject | null;
  } catch {
    return null;
  }
}

export function saveProject(project: Omit<FounderProject, "updatedAt">) {
  window.localStorage.setItem(PROJECT_KEY, JSON.stringify({ ...project, updatedAt: new Date().toISOString() }));
  window.dispatchEvent(new Event(ARCHIVE_EVENT));
}

export function readDecisions(): GuideDecision[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(DECISION_KEY) || "[]") as GuideDecision[];
  } catch {
    return [];
  }
}

export function saveGuideDecision(decision: Omit<GuideDecision, "savedAt">) {
  const current = readDecisions().filter((item) => item.guide !== decision.guide);
  const next = { ...decision, savedAt: new Date().toISOString() };
  window.localStorage.setItem(DECISION_KEY, JSON.stringify([next, ...current]));
  window.dispatchEvent(new Event(ARCHIVE_EVENT));
}

export function readCompletions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(COMPLETION_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function toggleCompletion(slug: string) {
  const current = readCompletions();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  window.localStorage.setItem(COMPLETION_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(ARCHIVE_EVENT));
  return next;
}
