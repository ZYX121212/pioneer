"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getEnglishResource } from "../data/english";
import type { Resource } from "../data/resources";
import { ResourceCard } from "./ResourceCard";

export function DirectoryExplorer({ resources, lang = "zh" }: { resources: Resource[]; lang?: "zh" | "en" }) {
  const pageSize = 9;
  const [query, setQuery] = useState("");
  const allLabel = lang === "en" ? "All" : "全部";
  const [activeTag, setActiveTag] = useState(allLabel);
  const [currentPage, setCurrentPage] = useState(1);
  const explorerRef = useRef<HTMLDivElement>(null);
  const availableTags = Array.from(new Set(resources.flatMap((resource) => {
    const english = lang === "en" ? getEnglishResource(resource.slug) : undefined;
    return english?.tags ?? resource.tags;
  })));
  const isOrganizationDirectory = resources[0]?.type === "organization";
  const preferredTags = isOrganizationDirectory
    ? (lang === "en"
      ? ["Investor", "China", "United States", "Early stage", "Multi-stage"]
      : ["投资机构", "中国", "美国", "早期", "全阶段"])
    : [];
  const tags = [
    allLabel,
    ...preferredTags.filter((tag) => availableTags.includes(tag)),
    ...availableTags.filter((tag) => !preferredTags.includes(tag)),
  ].slice(0, 9);

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

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const pageEntries = visible.slice(pageStart, pageStart + pageSize);
  const shownFrom = visible.length ? pageStart + 1 : 0;
  const shownTo = Math.min(pageStart + pageSize, visible.length);

  useEffect(() => {
    const readPageFromUrl = () => {
      const requestedPage = Number.parseInt(new URLSearchParams(window.location.search).get("page") ?? "1", 10);
      setCurrentPage(Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1);
    };

    readPageFromUrl();
    window.addEventListener("popstate", readPageFromUrl);
    return () => window.removeEventListener("popstate", readPageFromUrl);
  }, []);

  const updatePageUrl = (page: number, mode: "push" | "replace" = "push") => {
    const url = new URL(window.location.href);
    if (page === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(page));
    window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const resetPage = () => {
    setCurrentPage(1);
    updatePageUrl(1, "replace");
  };

  const selectPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    updatePageUrl(nextPage);
    window.requestAnimationFrame(() => explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="directory-explorer" ref={explorerRef}>
      <div className="directory-tools">
        <label className="directory-search">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">{lang === "en" ? "Search this directory" : "搜索当前目录"}</span>
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); resetPage(); }}
            placeholder={lang === "en" ? "Search name, location or tags..." : "搜索名称、地点或标签……"}
          />
        </label>
        <span className="result-count">
          {lang === "en"
            ? `${visible.length} entries · showing ${shownFrom}–${shownTo}`
            : `共 ${visible.length} 条 · 当前显示 ${shownFrom}–${shownTo}`}
        </span>
      </div>
      <div className="filter-buttons directory-tags" aria-label={lang === "en" ? "Filter by tag" : "按标签筛选"}>
        {tags.map((tag) => (
          <button key={tag} type="button" className={activeTag === tag ? "active" : ""} onClick={() => { setActiveTag(tag); resetPage(); }}>
            {tag}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="resource-grid directory-grid">
          {pageEntries.map((resource) => <ResourceCard resource={resource} lang={lang} key={resource.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>{lang === "en" ? "No matching resources found" : "没有找到匹配的内容"}</span>
          <button type="button" onClick={() => { setQuery(""); setActiveTag(allLabel); resetPage(); }}>{lang === "en" ? "Clear filters" : "清除筛选"}</button>
        </div>
      )}
      {visible.length > pageSize ? (
        <nav className="directory-pagination" aria-label={lang === "en" ? "Directory pagination" : "目录分页"}>
          <button type="button" onClick={() => selectPage(activePage - 1)} disabled={activePage === 1}>
            <span aria-hidden="true">←</span> {lang === "en" ? "Previous" : "上一页"}
          </button>
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <a
                key={page}
                href={page === 1 ? "?" : `?page=${page}`}
                className={activePage === page ? "active" : ""}
                aria-current={activePage === page ? "page" : undefined}
                aria-label={lang === "en" ? `Page ${page}` : `第 ${page} 页`}
                onClick={(event) => { event.preventDefault(); selectPage(page); }}
              >
                {String(page).padStart(2, "0")}
              </a>
            ))}
          </div>
          <button type="button" onClick={() => selectPage(activePage + 1)} disabled={activePage === totalPages}>
            {lang === "en" ? "Next" : "下一页"} <span aria-hidden="true">→</span>
          </button>
        </nav>
      ) : null}
    </div>
  );
}
