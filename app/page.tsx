"use client";

import { FormEvent, useMemo, useState } from "react";
import { KnowledgeCard } from "./components/KnowledgeCard";
import { ResourceCard } from "./components/ResourceCard";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { knowledgeItems, learningPath } from "./data/knowledge";
import { resources, typeConfig, type ResourceType } from "./data/resources";

const categoryStyles: Record<ResourceType, string> = {
  program: "category-blue",
  organization: "category-mint",
  event: "category-orange",
  startup: "category-lilac",
};

export default function Home() {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return resources.filter((resource) => resource.featured);
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
  }, [query]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function applyQuickSearch(term: string) {
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
            搜索全球创业计划、孵化机构、活动与项目，也从可信的公开课程和专业指南中，
            理解创业的第一步。
          </p>

          <form className="search-box" onSubmit={handleSearch} role="search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="resource-search">搜索创业资源</label>
            <input id="resource-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索国家、城市、行业或机构……" />
            <button type="submit"><span className="search-full">搜索整理内容</span><span className="search-short">搜索</span></button>
          </form>

          <div className="popular-searches" aria-label="热门搜索">
            <span>热门：</span>
            {["AI", "国际团队", "个人申请", "科技大会"].map((term) => (
              <button key={term} type="button" onClick={() => applyQuickSearch(term)}>{term}</button>
            ))}
          </div>
          <a className="knowledge-entry-link" href="/knowledge">
            <span>第一次创业？</span>
            从 60 分钟入门路径开始 <b aria-hidden="true">→</b>
          </a>
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
        <div><strong>{knowledgeItems.length}</strong><span>精选知识来源</span></div>
        <div><strong>100%</strong><span>附官方来源</span></div>
        <p>把全球创业机会与可信知识放在同一张地图上。</p>
      </section>

      <section className="section categories-section" id="categories">
        <div className="section-heading">
          <div><span className="section-index">01 / EXPLORE</span><h2>先选择你要解决的问题</h2></div>
          <p>每个目录都有选择指南、站内总结和统一的信息结构，不需要在不同官网之间反复比较。</p>
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
                <span className="category-note">{category.intro}</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="knowledge-section knowledge-preview" id="knowledge">
        <div className="knowledge-heading">
          <div>
            <span className="section-index light">02 / FOUNDER LIBRARY</span>
            <h2>发现机会，<br />也知道怎么开始。</h2>
          </div>
          <div className="knowledge-heading-copy">
            <span>创业指南 · PIONEER LIBRARY</span>
            <p>按创业阶段整理公开课程、专业指南与行动线索。每份内容都标注原始来源、学习成本和适用地区。</p>
          </div>
        </div>

        <div className="learning-path-shell">
          <aside className="learning-path-intro">
            <span>START HERE · 60 MIN</span>
            <strong>创业前的<br />第一张地图</strong>
            <p>适合第一次接触创业的人。先建立完整认知，再决定需要深入的方向。</p>
            <a href="/knowledge">进入完整指南 <span aria-hidden="true">→</span></a>
          </aside>
          <div className="learning-path" aria-label="创业入门学习路径">
            {learningPath.map((step) => (
              <a href="/knowledge#knowledge-library" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.note}</small>
                </div>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </div>

        <div className="knowledge-preview-topline">
          <div>
            <span>CURATED KNOWLEDGE</span>
            <h3>先从这些一手来源开始</h3>
          </div>
          <a href="/knowledge">浏览全部 {knowledgeItems.length} 份内容 <span aria-hidden="true">→</span></a>
        </div>
        <div className="knowledge-grid">
          {knowledgeItems.slice(0, 4).map((item) => <KnowledgeCard item={item} key={item.id} />)}
        </div>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-heading resources-heading">
          <div>
            <span className="section-index">03 / EDITOR&apos;S PICKS</span>
            <h2>{query ? `“${query}”的搜索结果` : "首页只放真正值得先看的"}</h2>
          </div>
          <span className="updated-note"><i /> {query ? `${searchResults.length} 条匹配内容` : "6 条编辑精选 · 点击进入站内整理"}</span>
        </div>

        {searchResults.length ? (
          <div className="resource-grid">
            {searchResults.map((resource) => <ResourceCard resource={resource} key={resource.id} />)}
          </div>
        ) : (
          <div className="empty-state"><span>没有找到匹配的资源</span><button type="button" onClick={() => setQuery("")}>清除搜索</button></div>
        )}

        <div className="directory-links" aria-label="进入完整目录">
          {(Object.keys(typeConfig) as ResourceType[]).map((type) => (
            <a href={typeConfig[type].path} key={type}>全部{typeConfig[type].title} <span>→</span></a>
          ))}
        </div>
      </section>

      <section className="cities-section" id="cities">
        <div className="cities-copy">
          <span className="section-index light">04 / STARTUP ECOSYSTEMS</span>
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
