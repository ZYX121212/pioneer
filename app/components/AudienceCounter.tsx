"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pioneer:anonymous-visitor-id";
const AudienceContext = createContext<number | null>(null);

function getAnonymousVisitorId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, visitorId);
  return visitorId;
}

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function recordVisit() {
      try {
        const response = await fetch("/api/audience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: getAnonymousVisitorId() }),
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json()) as { visitorCount?: number };
        if (typeof data.visitorCount === "number") setVisitorCount(data.visitorCount);
      } catch {
        // The site remains usable when analytics storage is temporarily unavailable.
      }
    }

    void recordVisit();
    return () => controller.abort();
  }, []);

  return <AudienceContext.Provider value={visitorCount}>{children}</AudienceContext.Provider>;
}

export function AudienceCount({ fallback = "—" }: { fallback?: string }) {
  const visitorCount = useContext(AudienceContext);
  const formattedCount = useMemo(
    () => visitorCount === null ? fallback : new Intl.NumberFormat("zh-CN").format(visitorCount),
    [fallback, visitorCount],
  );

  return <span className="audience-count" aria-live="polite">{formattedCount}</span>;
}
