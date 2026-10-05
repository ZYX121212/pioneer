"use client";
import { useCallback, useEffect, useState } from "react";
import { communityToResource } from "./communityResource";
import type { CommunityRow } from "./submissionService";
import type { Resource } from "../data/resources";
export function useCommunityResources(lang: "zh" | "en") {
  const [resources, setResources] = useState<Resource[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => { setState("loading"); setRevision(value => value + 1); }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/community", { signal: controller.signal, cache: "no-store" }).then(async response => {
      if (!response.ok) throw new Error("Community resources unavailable");
      const data = await response.json() as { resources: CommunityRow[] };
      if (!Array.isArray(data.resources)) throw new Error("Community resources unavailable");
      if (controller.signal.aborted) return;
      setResources(data.resources.map(row => communityToResource(row, lang))); setState("ready");
    }).catch(() => { if (!controller.signal.aborted) setState("error"); });
    return () => controller.abort();
  }, [lang, revision]);
  return { resources, state, retry };
}
