"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pioneer:anonymous-visitor-id";

type AudienceStats = {
  visitorCount: number | null;
  pageViewCount: number | null;
};

const AudienceContext = createContext<AudienceStats>({
  visitorCount: null,
  pageViewCount: null,
});

function getAnonymousVisitorId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, visitorId);
  return visitorId;
}

function getAttribution() {
  const parameters = new URLSearchParams(window.location.search);
  let referrer: string | undefined;

  if (document.referrer) {
    try {
      const url = new URL(document.referrer);
      if (url.origin !== window.location.origin) referrer = url.href;
    } catch {
      // Ignore malformed browser referrers.
    }
  }

  return {
    referrer,
    source: parameters.get("utm_source") ?? (referrer ? new URL(referrer).hostname : "direct"),
    medium: parameters.get("utm_medium") ?? undefined,
    campaign: parameters.get("utm_campaign") ?? undefined,
  };
}

async function sendAudienceSignal(payload: { eventName?: string; target?: string } = {}) {
  const response = await fetch("/api/audience", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId: getAnonymousVisitorId(),
      path: window.location.pathname,
      ...(!payload.eventName ? getAttribution() : {}),
      ...payload,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    visitorCount?: number;
    pageViewCount?: number;
  };

  return data;
}

export function trackAudienceEvent(eventName: string, target?: string) {
  if (typeof window === "undefined") return;
  void sendAudienceSignal({ eventName, target }).catch(() => {
    // Analytics should never interrupt the visitor's actual workflow.
  });
}

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<AudienceStats>({
    visitorCount: null,
    pageViewCount: null,
  });

  useEffect(() => {
    async function recordVisit() {
      try {
        const data = await sendAudienceSignal();
        if (!data) return;
        setStats({
          visitorCount: typeof data.visitorCount === "number" ? data.visitorCount : null,
          pageViewCount: typeof data.pageViewCount === "number" ? data.pageViewCount : null,
        });
      } catch {
        // The site remains usable when analytics storage is temporarily unavailable.
      }
    }

    void recordVisit();
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-audience-event]")
        : null;
      if (!target?.dataset.audienceEvent) return;

      trackAudienceEvent(target.dataset.audienceEvent, target.dataset.audienceTarget);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return <AudienceContext.Provider value={stats}>{children}</AudienceContext.Provider>;
}

export function AudienceCount({ fallback = "—" }: { fallback?: string }) {
  const { visitorCount } = useContext(AudienceContext);
  const formattedCount = useMemo(
    () => visitorCount === null ? fallback : new Intl.NumberFormat("zh-CN").format(visitorCount),
    [fallback, visitorCount],
  );

  return <span className="audience-count" aria-live="polite">{formattedCount}</span>;
}

export function PageViewCount({ fallback = "—" }: { fallback?: string }) {
  const { pageViewCount } = useContext(AudienceContext);
  const formattedCount = useMemo(
    () => pageViewCount === null ? fallback : new Intl.NumberFormat("zh-CN").format(pageViewCount),
    [fallback, pageViewCount],
  );

  return <span className="audience-count" aria-live="polite">{formattedCount}</span>;
}
