export const ARCHIVE_KEY = "pioneer:founder-archive-v1";
export const COMPLETION_KEY = "pioneer:guide-progress-v1";
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
