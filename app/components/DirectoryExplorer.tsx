"use client";

import { useMemo, useState } from "react";
import type { Resource } from "../data/resources";
import { ResourceCard } from "./ResourceCard";

export function DirectoryExplorer({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");
  const tags = ["全部", ...Array.from(new Set(resources.flatMap((resource) => resource.tags))).slice(0, 8)];

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesTag = activeTag === "全部" || resource.tags.includes(activeTag);
      const searchable = [resource.name, resource.location, resource.description, ...resource.tags]
        .join(" ")
        .toLowerCase();
      return matchesTag && (!normalized || searchable.includes(normalized));
    });
  }, [activeTag, query, resources]);

  return (
    <div className="directory-explorer">
      <div className="directory-tools">
        <label className="directory-search">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">搜索当前目录</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称、地点或标签……" />
        </label>
        <span className="result-count">{visible.length} 条整理内容</span>
      </div>
      <div className="filter-buttons directory-tags" aria-label="按标签筛选">
        {tags.map((tag) => (
          <button key={tag} type="button" className={activeTag === tag ? "active" : ""} onClick={() => setActiveTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="resource-grid directory-grid">
          {visible.map((resource) => <ResourceCard resource={resource} key={resource.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>没有找到匹配的内容</span>
          <button type="button" onClick={() => { setQuery(""); setActiveTag("全部"); }}>清除筛选</button>
        </div>
      )}
    </div>
  );
}
