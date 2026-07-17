"use client";

import { useMemo, useState } from "react";
import { getEnglishResource } from "../data/english";
import type { Resource } from "../data/resources";
import { ResourceCard } from "./ResourceCard";

export function DirectoryExplorer({ resources, lang = "zh" }: { resources: Resource[]; lang?: "zh" | "en" }) {
  const [query, setQuery] = useState("");
  const allLabel = lang === "en" ? "All" : "全部";
  const [activeTag, setActiveTag] = useState(allLabel);
  const tags = [allLabel, ...Array.from(new Set(resources.flatMap((resource) => {
    const english = lang === "en" ? getEnglishResource(resource.slug) : undefined;
    return english?.tags ?? resource.tags;
  }))).slice(0, 8)];

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const english = lang === "en" ? getEnglishResource(resource.slug) : undefined;
      const copy = english ?? resource;
      const matchesTag = activeTag === allLabel || copy.tags.includes(activeTag);
      const searchable = [resource.name, copy.location, copy.description, ...copy.tags]
        .join(" ")
        .toLowerCase();
      return matchesTag && (!normalized || searchable.includes(normalized));
    });
  }, [activeTag, allLabel, lang, query, resources]);

  return (
    <div className="directory-explorer">
      <div className="directory-tools">
        <label className="directory-search">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">{lang === "en" ? "Search this directory" : "搜索当前目录"}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={lang === "en" ? "Search name, location or tags..." : "搜索名称、地点或标签……"}
          />
        </label>
        <span className="result-count">{lang === "en" ? `${visible.length} curated entries` : `${visible.length} 条整理内容`}</span>
      </div>
      <div className="filter-buttons directory-tags" aria-label={lang === "en" ? "Filter by tag" : "按标签筛选"}>
        {tags.map((tag) => (
          <button key={tag} type="button" className={activeTag === tag ? "active" : ""} onClick={() => setActiveTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="resource-grid directory-grid">
          {visible.map((resource) => <ResourceCard resource={resource} lang={lang} key={resource.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>{lang === "en" ? "No matching resources found" : "没有找到匹配的内容"}</span>
          <button type="button" onClick={() => { setQuery(""); setActiveTag(allLabel); }}>{lang === "en" ? "Clear filters" : "清除筛选"}</button>
        </div>
      )}
    </div>
  );
}
