"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Resource } from "../data/resources";
import { findResources, resourceNeeds, finderRegions } from "../lib/resourceFinder";
import { trackAudienceEvent } from "./AudienceCounter";
import { ResourceCard } from "./ResourceCard";

export function DirectoryExplorer({ resources, lang = "zh" }: { resources: Resource[]; lang?: "zh" | "en" }) {
  const pageSize = 9;
  const [query, setQuery] = useState("");
  const [need, setNeed] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [region, setRegion] = useState("all"), [stage, setStage] = useState("all"), [freshness, setFreshness] = useState("non-historical");

  const explorerRef = useRef<HTMLDivElement>(null);
  const visible = useMemo(() => findResources(resources, { query, need, region, stage, freshness }, lang), [resources, query, need, region, stage, freshness, lang]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const pageEntries = visible.slice(pageStart, pageStart + pageSize);
  const shownFrom = visible.length ? pageStart + 1 : 0;
  const shownTo = Math.min(pageStart + pageSize, visible.length);

  useEffect(() => {
    const readPageFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedPage = Number.parseInt(params.get("page") ?? "1", 10);
      setQuery(params.get("q")?.slice(0, 200) ?? "");
      setNeed(resourceNeeds.some(item => item.id === params.get("need")) ? params.get("need")! : "all");
      setRegion(params.get("region") ?? "all");
      setStage(["idea", "validation", "traction", "growth"].includes(params.get("stage") ?? "") ? params.get("stage")! : "all");
      setFreshness(["reviewed", "needs-review", "historical", "all"].includes(params.get("freshness") ?? "") ? params.get("freshness")! : "non-historical");
      setCurrentPage(Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1);
    };

    readPageFromUrl();
    window.addEventListener("popstate", readPageFromUrl);
    return () => window.removeEventListener("popstate", readPageFromUrl);
  }, []);

  const updatePageUrl = (page: number, mode: "push" | "replace" = "push", changes: Partial<{ query: string; need: string; region: string; stage: string; freshness: string }> = {}) => {
    const url = new URL(window.location.href);
    const filters = { query, need, region, stage, freshness, ...changes };
    for (const [key, value, fallback] of [["q", filters.query, ""], ["need", filters.need, "all"], ["region", filters.region, "all"], ["stage", filters.stage, "all"], ["freshness", filters.freshness, "non-historical"]]) {
      if (value === fallback) url.searchParams.delete(key); else url.searchParams.set(key, value);
    }
    if (page === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(page));
    window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value, fallback] of [["q", query, ""], ["need", need, "all"], ["region", region, "all"], ["stage", stage, "all"], ["freshness", freshness, "non-historical"]]) {
      if (value !== fallback) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    return `?${params}`;
  };
  const resetPage = (changes = {}) => {
    setCurrentPage(1);
    updatePageUrl(1, "replace", changes);
  };

  const selectPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    updatePageUrl(nextPage);
    window.requestAnimationFrame(() => explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="directory-explorer" ref={explorerRef}>
      <form className="directory-tools" onSubmit={event => { event.preventDefault(); trackAudienceEvent("search:submit", query.slice(0, 80)); }}>
        <label className="directory-search">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">{lang === "en" ? "Search this directory" : "搜索当前目录"}</span>
          <input
            aria-label={lang === "en" ? "Search this directory" : "搜索当前目录"}
            value={query}
            onChange={(event) => { setQuery(event.target.value); resetPage({ query: event.target.value }); }}
            placeholder={lang === "en" ? "Try AI, Singapore or Y Combinator" : "搜索名称、行业或地区，如 AI、新加坡"}
          />
        </label>
        <span className="result-count" role="status" aria-live="polite">
          {lang === "en"
            ? `${visible.length} entries · showing ${shownFrom}–${shownTo}`
            : `共 ${visible.length} 条 · 当前显示 ${shownFrom}–${shownTo}`}
        </span>
      </form>
      <div className="finder-needs" aria-label={lang === "en" ? "What do you need?" : "按需求筛选"}>
        {resourceNeeds.map(item => <button type="button" key={item.id} aria-pressed={need === item.id} onClick={() => { setNeed(item.id); resetPage({ need: item.id }); }}>{item[lang]}</button>)}
      </div>
      <details className="finder-options"><summary>{lang === "en" ? "Location, stage & availability" : "地区、阶段与资源时效"}{[region !== "all", stage !== "all", freshness !== "non-historical"].filter(Boolean).length > 0 && <span> · {lang === "en" ? "Filters applied" : "已设筛选"}</span>}</summary>
      <div className="product-filters directory-additional-filters">
        <label>{lang === "en" ? "Location" : "地区"}<select value={region} onChange={event => { setRegion(event.target.value); resetPage({ region: event.target.value }); }}><option value="all">{lang === "en" ? "All locations" : "全部地区"}</option>{finderRegions.map(row => <option key={row.id} value={row.id}>{row[lang]}</option>)}<option value="other">{lang === "en" ? "Other locations" : "其他地区"}</option></select></label>
        <label>{lang === "en" ? "Founder stage" : "创业阶段"}<select value={stage} onChange={event => { setStage(event.target.value); resetPage({ stage: event.target.value }); }}>{(lang === "en" ? [["all", "All stages"], ["idea", "Idea"], ["validation", "Validation"], ["traction", "Traction"], ["growth", "Growth"]] : [["all", "全部阶段"], ["idea", "想法"], ["validation", "验证"], ["traction", "早期增长"], ["growth", "规模增长"]]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>{lang === "en" ? "Availability" : "资源时效"}<select value={freshness} onChange={event => { setFreshness(event.target.value); resetPage({ freshness: event.target.value }); }}>{(lang === "en" ? [["non-historical", "Exclude historical windows"], ["reviewed", "Recently reviewed"], ["needs-review", "Needs rechecking"], ["historical", "Historical archive"], ["all", "All briefs"]] : [["non-historical", "排除历史窗口"], ["reviewed", "近期核验"], ["needs-review", "需重新核验"], ["historical", "历史归档"], ["all", "全部档案"]]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <p className="directory-filter-note">{lang === "en" ? "Locations describe institutions or venues, not applicant eligibility. Stage filters include unspecified entries. Recheck the official source before acting." : "地区按机构或活动所在地筛选，不代表申请资格。阶段筛选包含未明确限制的条目；行动前请核对官方来源。"}</p>
      </details>
      {visible.length > 0 && (query || need !== "all" || region !== "all" || stage !== "all" || freshness !== "non-historical") && <button className="finder-reset" onClick={() => { setQuery(""); setNeed("all"); setRegion("all"); setStage("all"); setFreshness("non-historical"); resetPage({ query: "", need: "all", region: "all", stage: "all", freshness: "non-historical" }); }}>{lang === "en" ? "Clear filters" : "清除筛选"}</button>}
      {visible.length ? (
        <div className="resource-grid directory-grid">
          {pageEntries.map((resource) => <ResourceCard resource={resource} lang={lang} key={resource.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>{lang === "en" ? "No matching resources found" : "没有找到匹配的内容"}</span>
          <button type="button" onClick={() => { setQuery(""); setNeed("all"); setRegion("all"); setStage("all"); setFreshness("non-historical"); resetPage({ query: "", need: "all", region: "all", stage: "all", freshness: "non-historical" }); }}>{lang === "en" ? "Clear filters" : "清除筛选"}</button>
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
                href={pageHref(page)}
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
