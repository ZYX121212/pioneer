"use client";

import { locationLabel } from "./lib/globeDiscovery";
import { homeRegions, matchesHomeRegion } from "./lib/homeDiscovery";
import { HomeFeatures, HomeIcon, HomeMetrics, HomeSignalPanel } from "./components/HomeVisuals";

import { resourcePreview } from "./lib/resourceFreshness";
import { useCommunityResources } from "./lib/useCommunityResources";
import { WeeklySpotlight } from "./components/WeeklySpotlight";
import { FormEvent, useMemo, useState } from "react";
import { trackAudienceEvent } from "./components/AudienceCounter";
import { ResourceCard } from "./components/ResourceCard";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { pioneerGuide } from "./data/knowledge";
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
  organization: "投资机构、孵化器、创业园区与大学平台",
  event: "大会、Demo Day、路演与创始人聚会",
  startup: "发现来自世界各地的新产品与团队",
};


export default function Home() {
  const community = useCommunityResources("zh");
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("all");
  const [activePreview, setActivePreview] = useState<PreviewMode>("featured");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized && activeRegion === "all") {
      return resourcePreview(resources, activePreview);
    }
    return [...resources, ...community.resources].filter((resource) => {
      const searchable = [
        resource.name,
        resource.location,
        resource.description,
        resource.kind,
        ...resource.tags,
      ].join(" ").toLowerCase();
      return searchable.includes(normalized) && matchesHomeRegion(resource, activeRegion);
    });
  }, [activePreview, query, activeRegion, community.resources]);

  const previewTitles: Record<PreviewMode, string> = {
    featured: "最近值得关注",
    program: "开放计划样例",
    organization: "创业机构样例",
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
    trackAudienceEvent("search:submit", query.trim() || "empty");
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function applyQuickSearch(term: string) {
    setActivePreview("featured");
    setActiveRegion("all");
    setQuery(term);
    trackAudienceEvent("search:quick", term);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="pioneer-home">
      <SiteHeader home />

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="kicker"><span className="pulse" /> GLOBAL STARTUP RESOURCE DIRECTORY</div>
          <h1><span>全球创业</span><span><em>资源</em>与指南。</span></h1>
          <p className="hero-intro">
            搜索世界各地的创业活动、孵化器、加速计划、创新机构与创业项目。
            公开资料无需注册，收藏与工作台需要登录。
          </p>

          <form className="search-box" onSubmit={handleSearch} role="search">
            <span className="search-icon"><HomeIcon kind="search" /></span>
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
              <button key={term} type="button" aria-pressed={query === term} onClick={() => applyQuickSearch(term)}>{term}</button>
            ))}
          </div>
          <HomeFeatures lang="zh" />
        </div>

        <HomeSignalPanel lang="zh" activeRegion={activeRegion} entries={[...resources, ...community.resources]} onRegion={(region) => { setActiveRegion(region); setQuery(""); setActivePreview("featured"); trackAudienceEvent("search:region", region); }} />
      </section>

      <HomeMetrics lang="zh" />

      <WeeklySpotlight lang="zh" />

      <section className="section categories-section" id="categories">
        <div className="section-heading">
          <div><span className="section-index">01 / EXPLORE</span><h2>从你需要的资源开始</h2></div>
          <p>按计划、机构、活动和项目分类，附适合人群、日期与官方来源。</p>
        </div>
        <div className="category-grid">
          {(Object.keys(typeConfig) as ResourceType[]).map((type) => {
            const category = typeConfig[type];
            const count = resources.filter((resource) => resource.type === type).length;
            return (
              <a
                className={`category-card ${categoryStyles[type]}`}
                href={category.path}
                key={type}
                data-audience-event="directory:open"
                data-audience-target={type}
              >
                <span className="category-eyebrow">{category.eyebrow}</span>
                <span className="category-count">{count}</span>
                <span className="category-title">{category.title} <i aria-hidden="true">→</i></span>
                <span className="category-note">{categoryNotes[type]}</span>
              </a>
            );
          })}
        </div>

        <a
          className="founder-guide-card"
          href={`/knowledge/${pioneerGuide.slug}`}
          data-audience-event="guide:open"
          data-audience-target={pioneerGuide.slug}
        >
          <span className="founder-guide-eyebrow">NEW · FOUNDER GUIDE</span>
          <strong>用户问题验证</strong>
          <p>Pioneer 首篇创业决策指南：不用先做产品，三天完成问题陈述、核心假设和第一轮验证。</p>
          <b>开始第一篇指南 <i aria-hidden="true">→</i></b>
        </a>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-heading resources-heading">
          <div>
            <span className="section-index">02 / EDITOR&apos;S PICKS</span>
            <h2>{query ? `“${query}”的搜索结果` : previewTitles[activePreview]}</h2>
          </div>
          <span className="updated-note">
            <i /> {query || activeRegion !== "all" ? `${searchResults.length} 条匹配内容` : activePreview === "knowledge" ? "4 篇 Pioneer 原创指南" : `${searchResults.length} 条首页样例`}
          </span>
        </div>

        {activeRegion !== "all" && (<div className="home-region-filter" role="status">{locationLabel(activeRegion, "zh") ?? homeRegions.find(region => region.id === activeRegion)?.zh} · 按档案所在地筛选<button type="button" onClick={() => setActiveRegion("all")}> 清除地区筛选</button></div>)}

        <div className="filter-row" aria-label="首页内容切换">
          <div className="filter-buttons">
            {([
              ["featured", "精选资源"],
              ["program", "开放计划"],
              ["organization", "创业机构"],
              ["event", "创业活动"],
              ["startup", "创业项目"],
              ["knowledge", "创业指南"],
            ] as Array<[PreviewMode, string]>).map(([mode, label]) => (
              <button
                type="button"
                key={mode}
                className={activePreview === mode && !query ? "active" : ""}
                onClick={() => { setActivePreview(mode); setQuery(""); setActiveRegion("all"); }}
              >
                {label}
              </button>
            ))}
          </div>
          <a
            className="result-directory-link"
            href={directoryTarget.href}
            data-audience-event="directory:open"
            data-audience-target={directoryTarget.label}
          >
            {directoryTarget.label} →
          </a>
        </div>

        {(query.trim() || activeRegion !== "all") && community.state === "loading" && <p role="status">正在加载社区资源，下方先显示站内整理的匹配档案。</p>}
        {(query.trim() || activeRegion !== "all") && community.state === "error" && <p role="alert">社区资源暂时无法加载，当前结果仅覆盖站内整理档案。<button type="button" onClick={community.retry}>重试加载社区资源</button></p>}
        {activePreview === "knowledge" && !query ? (
          <article className="home-guide-feature">
            <div className="home-guide-number"><span>PIONEER GUIDE</span><strong>{pioneerGuide.number}</strong></div>
            <div className="home-guide-copy">
              <span>{pioneerGuide.stage} · {pioneerGuide.duration}</span>
              <h3>{pioneerGuide.title}</h3>
              <p>{pioneerGuide.description}</p>
              <a
                href={`/knowledge/${pioneerGuide.slug}`}
                data-audience-event="guide:open"
                data-audience-target={pioneerGuide.slug}
              >
                阅读完整指南 <b aria-hidden="true">→</b>
              </a>
            </div>
            <div className="home-guide-outcomes">
              <span>看完你会带走</span>
              {pioneerGuide.outcome.map((item) => <strong key={item}>{item}</strong>)}
            </div>
          </article>
        ) : searchResults.length ? (
          <div className="resource-grid">
            {searchResults.map((resource) => <ResourceCard resource={resource} key={resource.id} />)}
          </div>
        ) : (
          <div className="empty-state"><span>没有找到匹配的资源</span><button type="button" onClick={() => { setQuery(""); setActiveRegion("all"); }}>清除搜索</button></div>
        )}

        <a
          className="all-resources"
          href={directoryTarget.href}
          data-audience-event="directory:open"
          data-audience-target={directoryTarget.label}
        >
          {directoryTarget.label} <span aria-hidden="true">→</span>
        </a>
      </section>

      <section className="cities-section" id="cities">
        <div className="cities-copy">
          <span className="section-index light">03 / STARTUP ECOSYSTEMS</span>
          <h2>创业机构与申请方式</h2>
          <p>查看机构提供的服务、申请条件、旗下项目和官方链接。</p>
          <a
            className="cities-link"
            href="/organizations"
            data-audience-event="directory:open"
            data-audience-target="organizations"
          >
            查看机构整理 →
          </a>
        </div>
        <div className="city-list" aria-label="热门创业生态">
          {["新加坡", "伦敦", "巴黎", "伯克利", "旧金山"].map((city, index) => (
            <a
              href="/organizations"
              key={city}
              data-audience-event="ecosystem:open"
              data-audience-target={city}
            >
              <span>0{index + 1}</span><strong>{city}</strong>
              <i>{["Singapore", "London", "Paris", "Berkeley", "San Francisco"][index]}</i><b>→</b>
            </a>
          ))}
        </div>
      </section>

      <section className="submit-section" id="submit">
        <span className="submit-kicker">KNOW A GREAT RESOURCE?</span>
        <h2>提交创业资源</h2>
        <p>可以推荐一个计划、机构、活动或公开知识来源。我们会核验后再发布。</p>
        <a href="/submit" data-audience-event="submit-resource:intent" data-audience-target="home-submit">推荐一个来源 ↗</a>
      </section>

      <SiteFooter />
    </main>
  );
}
