"use client";

import { FormEvent, useMemo, useState } from "react";
import { ResourceCard } from "./components/ResourceCard";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { knowledgeItems } from "./data/knowledge";
import { resources, typeConfig, type ResourceType } from "./data/resources";

type PreviewMode = "featured" | ResourceType | "knowledge";

const categoryStyles: Record<ResourceType, string> = {
  program: "category-blue",
  organization: "category-mint",
  event: "category-orange",
  startup: "category-lilac",
};

const categoryNotes: Record<ResourceType, string> = {
  program: "加速器、比赛、资助与国际落地机会",
  organization: "大学、政府、企业与独立创新机构",
  event: "大会、Demo Day、路演与创始人聚会",
  startup: "发现来自世界各地的新产品与团队",
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [activePreview, setActivePreview] = useState<PreviewMode>("featured");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      if (activePreview === "featured" || activePreview === "knowledge") {
        return resources.filter((resource) => resource.featured);
      }
      return resources.filter((resource) => resource.type === activePreview);
    }
    return resources.filter((resource) => {
      const searchable = [
        resource.name,
        resource.location,
        resource.description,
        resource.kind,
        ...resource.tags,
      ].join(" ").toLowerCase();
      return searchable.includes(normalized);
    });
  }, [activePreview, query]);

  const previewTitles: Record<PreviewMode, string> = {
    featured: "最近值得关注",
    program: "开放计划样例",
    organization: "孵化机构样例",
    event: "创业活动样例",
    startup: "创业项目样例",
    knowledge: "创业指南精选",
  };

  const directoryTarget = activePreview === "knowledge"
    ? { href: "/knowledge", label: "查看完整创业指南" }
    : activePreview === "featured"
      ? { href: "#categories", label: "查看全部资源目录" }
      : { href: typeConfig[activePreview].path, label: `查看全部${typeConfig[activePreview].title}` };

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function applyQuickSearch(term: string) {
    setActivePreview("featured");
    setQuery(term);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="kicker"><span className="pulse" /> GLOBAL STARTUP RESOURCE DIRECTORY</div>
          <h1><span>世界很大，</span><span><em>机会</em>不应难找。</span></h1>
          <p className="hero-intro">
            搜索世界各地的创业活动、孵化器、加速计划、创新机构与创业项目。
            无需注册，先看整理，再决定是否行动。
          </p>

          <form className="search-box" onSubmit={handleSearch} role="search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="resource-search">搜索创业资源</label>
            <input
              id="resource-search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setActivePreview("featured"); }}
              placeholder="搜索国家、城市、行业或机构……"
            />
            <button type="submit"><span className="search-full">搜索整理内容</span><span className="search-short">搜索</span></button>
          </form>

          <div className="popular-searches" aria-label="热门搜索">
            <span>热门：</span>
            {["AI", "国际团队", "个人申请", "科技大会"].map((term) => (
              <button key={term} type="button" onClick={() => applyQuickSearch(term)}>{term}</button>
            ))}
          </div>
        </div>

        <aside className="atlas-card" aria-label="全球创业资源分布预览">
          <div className="atlas-topline"><span>GLOBAL SIGNAL MAP</span><span className="live-indicator">CURATED</span></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="atlas-scan" />
          <div className="globe" aria-hidden="true">
            <span className="globe-line globe-line-one" /><span className="globe-line globe-line-two" />
            <span className="landmass landmass-one" /><span className="landmass landmass-two" /><span className="landmass landmass-three" />
          </div>
          <div className="atlas-core"><strong>{resources.length}</strong><span>站内整理档案</span></div>
          <div className="map-pin pin-singapore"><span>新加坡</span><strong>01</strong></div>
          <div className="map-pin pin-london"><span>伦敦</span><strong>02</strong></div>
          <div className="map-pin pin-berlin"><span>巴黎</span><strong>02</strong></div>
          <div className="map-pin pin-sf"><span>旧金山</span><strong>05</strong></div>
          <div className="atlas-footer"><span>8 个国家与地区</span><span>全部附官方来源</span></div>
        </aside>
      </section>

      <section className="metrics" aria-label="平台数据">
        <div><strong>{resources.length}</strong><span>站内整理档案</span></div>
        <div><strong>4</strong><span>独立资源目录</span></div>
        <div><strong>6</strong><span>首页编辑精选</span></div>
        <div><strong>100%</strong><span>附官方来源</span></div>
        <p>首页负责发现，独立目录负责理解、比较与行动。</p>
      </section>

      <section className="section categories-section" id="categories">
        <div className="section-heading">
          <div><span className="section-index">01 / EXPLORE</span><h2>从你需要的资源开始</h2></div>
          <p>不是堆积链接，而是把每一类创业资源整理成可以理解和比较的信息。</p>
        </div>
        <div className="category-grid">
          {(Object.keys(typeConfig) as ResourceType[]).map((type) => {
            const category = typeConfig[type];
            const count = resources.filter((resource) => resource.type === type).length;
            return (
              <a className={`category-card ${categoryStyles[type]}`} href={category.path} key={type}>
                <span className="category-eyebrow">{category.eyebrow}</span>
                <span className="category-count">{count}</span>
                <span className="category-title">{category.title} <i aria-hidden="true">→</i></span>
                <span className="category-note">{categoryNotes[type]}</span>
              </a>
            );
          })}
        </div>

        <a className="founder-guide-card" href="/knowledge">
          <span className="founder-guide-eyebrow">NEW · FOUNDER GUIDE</span>
          <strong>第一次创业？从一张清晰的地图开始。</strong>
          <p>按创业阶段整理 8 份可信的一手课程与专业指南，从理解创业、验证想法到团队、公司与融资。</p>
          <b>进入创业指南 <i aria-hidden="true">→</i></b>
        </a>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-heading resources-heading">
          <div>
            <span className="section-index">02 / EDITOR&apos;S PICKS</span>
            <h2>{query ? `“${query}”的搜索结果` : previewTitles[activePreview]}</h2>
          </div>
          <span className="updated-note">
            <i /> {query ? `${searchResults.length} 条匹配内容` : activePreview === "knowledge" ? "6 份入门指南" : `${searchResults.length} 条首页样例`}
          </span>
        </div>

        <div className="filter-row" aria-label="首页内容切换">
          <div className="filter-buttons">
            {([
              ["featured", "精选资源"],
              ["program", "开放计划"],
              ["organization", "孵化机构"],
              ["event", "创业活动"],
              ["startup", "创业项目"],
              ["knowledge", "创业指南"],
            ] as Array<[PreviewMode, string]>).map(([mode, label]) => (
              <button
                type="button"
                key={mode}
                className={activePreview === mode && !query ? "active" : ""}
                onClick={() => { setActivePreview(mode); setQuery(""); }}
              >
                {label}
              </button>
            ))}
          </div>
          <a className="result-directory-link" href={directoryTarget.href}>{directoryTarget.label} →</a>
        </div>

        {activePreview === "knowledge" && !query ? (
          <div className="resource-grid">
            {knowledgeItems.slice(0, 6).map((item) => (
              <article className="resource-card home-knowledge-card" key={item.id}>
                <div className="resource-card-top">
                  <span className={`resource-logo logo-${item.color}`}>0{item.id}</span>
                  <div className="resource-status-group">
                    <span className="resource-status"><i />精选指南</span>
                    <span className="resource-kind">{item.kind}</span>
                  </div>
                </div>
                <div className="resource-location">{item.source}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="resource-footer">
                  <div className="resource-source"><strong>{item.level} · {item.duration}</strong><span>{item.scope} · Pioneer 已整理</span></div>
                  <a href="/knowledge#knowledge-library">查看指南 <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        ) : searchResults.length ? (
          <div className="resource-grid">
            {searchResults.map((resource) => <ResourceCard resource={resource} key={resource.id} />)}
          </div>
        ) : (
          <div className="empty-state"><span>没有找到匹配的资源</span><button type="button" onClick={() => setQuery("")}>清除搜索</button></div>
        )}

        <a className="all-resources" href={directoryTarget.href}>{directoryTarget.label} <span aria-hidden="true">→</span></a>
      </section>

      <section className="cities-section" id="cities">
        <div className="cities-copy">
          <span className="section-index light">03 / STARTUP ECOSYSTEMS</span>
          <h2>机构不是一个名字，而是一组真实入口。</h2>
          <p>先理解机构提供什么、服务谁、如何进入，再查看它正在运营的具体计划。</p>
          <a className="cities-link" href="/organizations">查看机构整理 →</a>
        </div>
        <div className="city-list" aria-label="热门创业生态">
          {["新加坡", "伦敦", "巴黎", "伯克利", "旧金山"].map((city, index) => (
            <a href="/organizations" key={city}>
              <span>0{index + 1}</span><strong>{city}</strong>
              <i>{["Singapore", "London", "Paris", "Berkeley", "San Francisco"][index]}</i><b>→</b>
            </a>
          ))}
        </div>
      </section>

      <section className="submit-section" id="submit">
        <span className="submit-kicker">KNOW A GREAT RESOURCE?</span>
        <h2>让有价值的机会与知识，被更多创业者真正理解。</h2>
        <p>可以推荐一个计划、机构、活动或公开知识来源。我们会核验后再发布。</p>
        <button type="button">推荐一个来源 ↗</button>
      </section>

      <SiteFooter />
    </main>
  );
}
