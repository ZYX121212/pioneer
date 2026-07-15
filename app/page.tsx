"use client";

import { FormEvent, useMemo, useState } from "react";

type Resource = {
  id: number;
  type: "program" | "organization" | "event" | "startup";
  kind: string;
  name: string;
  location: string;
  description: string;
  tags: string[];
  timing: string;
  status: string;
  verified: string;
  source: string;
  url: string;
  color: string;
  monogram: string;
};

const resources: Resource[] = [
  {
    id: 1,
    type: "program",
    kind: "加速计划",
    name: "Y Combinator",
    location: "美国 · San Francisco",
    description: "面向早期科技团队的创业加速批次，可在一次申请中选择未来批次。",
    tags: ["早期项目", "科技", "全球团队"],
    timing: "未来批次可申请",
    status: "接受申请",
    verified: "2026.07.15 核验",
    source: "YC 官方申请页",
    url: "https://www.ycombinator.com/apply/",
    color: "orange",
    monogram: "YC",
  },
  {
    id: 2,
    type: "program",
    kind: "加速计划",
    name: "Techstars Accelerators",
    location: "全球 · 多城市",
    description: "三个月导师制加速计划，帮助团队验证市场、获得增长与融资支持。",
    tags: ["导师网络", "融资", "全球项目"],
    timing: "查看各项目截止日",
    status: "部分项目开放",
    verified: "2026.07.15 核验",
    source: "Techstars 官方目录",
    url: "https://www.techstars.com/accelerators",
    color: "blue",
    monogram: "TS",
  },
  {
    id: 3,
    type: "program",
    kind: "创业计划",
    name: "Antler Residency",
    location: "全球 · 多城市",
    description: "从创始人匹配、想法验证到首轮融资，按不同地区持续开放创业批次。",
    tags: ["个人申请", "早期项目", "国际团队"],
    timing: "多地批次可申请",
    status: "开放申请",
    verified: "2026.07.15 核验",
    source: "Antler 官方申请页",
    url: "https://www.antler.co/apply?urlHash=sNWK",
    color: "violet",
    monogram: "AN",
  },
  {
    id: 4,
    type: "program",
    kind: "大学加速器",
    name: "Berkeley SkyDeck Batch 23",
    location: "美国 · Berkeley",
    description: "面向全球科技初创公司的六个月加速计划，入选团队可获得投资与导师支持。",
    tags: ["全球团队", "六个月", "$210k"],
    timing: "截止 08.21",
    status: "开放申请",
    verified: "2026.07.15 核验",
    source: "SkyDeck 官方计划页",
    url: "https://skydeck.berkeley.edu/program/",
    color: "mint",
    monogram: "BS",
  },
  {
    id: 5,
    type: "program",
    kind: "创始人计划",
    name: "Entrepreneur First London",
    location: "英国 · London",
    description: "面向个人创始人的全职线下计划，前十二周在伦敦，后续阶段前往旧金山。",
    tags: ["个人申请", "全职线下", "早期项目"],
    timing: "截止 08.04",
    status: "开放申请",
    verified: "2026.07.15 核验",
    source: "EF 官方申请页",
    url: "https://apply.joinef.com/",
    color: "yellow",
    monogram: "EF",
  },
  {
    id: 6,
    type: "program",
    kind: "在线创业课程",
    name: "Launch by STATION F",
    location: "法国 · Online",
    description: "从创业基础到商业模式与路演材料，适合想系统验证想法的早期创始人。",
    tags: ["免费课程", "商业基础", "在线"],
    timing: "持续开放",
    status: "在线可学",
    verified: "2026.07.15 核验",
    source: "STATION F 官方课程页",
    url: "https://launch.stationf.co/",
    color: "rose",
    monogram: "SF",
  },
  {
    id: 7,
    type: "organization",
    kind: "创业园区",
    name: "STATION F",
    location: "法国 · Paris",
    description: "汇集三十多个创业计划、投资人与合作伙伴的大型国际创业园区。",
    tags: ["创业园区", "国际团队", "投资网络"],
    timing: "30+ 创业计划",
    status: "机构档案",
    verified: "2026.07.15 核验",
    source: "STATION F 官网",
    url: "https://stationf.co/",
    color: "blue",
    monogram: "SF",
  },
  {
    id: 8,
    type: "organization",
    kind: "创新机构",
    name: "BLOCK71",
    location: "新加坡 · 全球网络",
    description: "连接亚洲与全球市场的创新网络，为创业团队提供社区、项目与落地支持。",
    tags: ["亚洲", "国际落地", "创业社区"],
    timing: "11 个创新节点",
    status: "机构档案",
    verified: "2026.07.15 核验",
    source: "BLOCK71 官网",
    url: "https://block71.co/",
    color: "rose",
    monogram: "71",
  },
  {
    id: 9,
    type: "organization",
    kind: "创始人机构",
    name: "Entrepreneur First",
    location: "英国 · London",
    description: "帮助优秀个人在创意和联合创始人尚未确定时，开始组建高增长科技公司。",
    tags: ["创始人匹配", "深科技", "全球网络"],
    timing: "多地项目",
    status: "机构档案",
    verified: "2026.07.15 核验",
    source: "EF 官网",
    url: "https://www.joinef.com/",
    color: "violet",
    monogram: "EF",
  },
  {
    id: 10,
    type: "organization",
    kind: "大学加速器",
    name: "Berkeley SkyDeck",
    location: "美国 · Berkeley",
    description: "连接加州大学伯克利分校、产业导师与投资网络的全球科技创业平台。",
    tags: ["深科技", "AI", "大学生态"],
    timing: "全球项目",
    status: "机构档案",
    verified: "2026.07.15 核验",
    source: "SkyDeck 官网",
    url: "https://skydeck.berkeley.edu/",
    color: "mint",
    monogram: "BS",
  },
  {
    id: 11,
    type: "event",
    kind: "科技大会",
    name: "TechCrunch Disrupt 2026",
    location: "美国 · San Francisco",
    description: "聚焦初创公司、技术趋势与融资连接的大型创业大会，包含展览与路演环节。",
    tags: ["科技大会", "融资", "线下"],
    timing: "10.13–10.15",
    status: "可注册",
    verified: "2026.07.15 核验",
    source: "TechCrunch 活动页",
    url: "https://techcrunch.com/events/techcrunch-disrupt/",
    color: "blue",
    monogram: "TC",
  },
  {
    id: 12,
    type: "event",
    kind: "创业大会",
    name: "Web Summit Lisbon 2026",
    location: "葡萄牙 · Lisbon",
    description: "连接全球创业者、投资人、科技公司与媒体的国际科技创业大会。",
    tags: ["国际大会", "投资人", "线下"],
    timing: "11.09–11.12",
    status: "可购票",
    verified: "2026.07.15 核验",
    source: "Web Summit 官网",
    url: "https://websummit.com/",
    color: "violet",
    monogram: "WS",
  },
  {
    id: 13,
    type: "event",
    kind: "创业大会",
    name: "Slush 2026",
    location: "芬兰 · Helsinki",
    description: "汇聚全球创始人、投资人与科技生态建设者的年度创业大会。",
    tags: ["科技大会", "融资", "线下"],
    timing: "11.18–11.19",
    status: "可购票",
    verified: "2026.07.15 核验",
    source: "Slush 官网",
    url: "https://slush.org/",
    color: "orange",
    monogram: "SL",
  },
  {
    id: 14,
    type: "startup",
    kind: "YC S26 项目",
    name: "Shepherd",
    location: "美国 · San Francisco",
    description: "为团队工具建立统一记忆层，让不同工作流中的智能代理共享上下文并执行任务。",
    tags: ["AI Agents", "企业软件", "基础设施"],
    timing: "YC Summer 2026",
    status: "活跃项目",
    verified: "2026.07.15 核验",
    source: "YC 公司档案",
    url: "https://www.ycombinator.com/companies/shepherd-3",
    color: "yellow",
    monogram: "SH",
  },
  {
    id: 15,
    type: "startup",
    kind: "YC S26 项目",
    name: "Cerenovus",
    location: "美国 · San Francisco",
    description: "把公司知识整理成可协作的知识图谱，帮助团队与智能代理共享组织记忆。",
    tags: ["AI", "知识管理", "企业软件"],
    timing: "YC Summer 2026",
    status: "活跃项目",
    verified: "2026.07.15 核验",
    source: "YC 公司档案",
    url: "https://www.ycombinator.com/companies/cerenovus",
    color: "mint",
    monogram: "CE",
  },
  {
    id: 16,
    type: "startup",
    kind: "YC S25 项目",
    name: "Pally",
    location: "美国 · San Francisco",
    description: "把消息、关系与行动事项集中在一个工作空间中的统一收件箱和个人关系管理工具。",
    tags: ["Productivity", "CRM", "Consumer"],
    timing: "YC Summer 2025",
    status: "活跃项目",
    verified: "2026.07.15 核验",
    source: "YC 公司档案",
    url: "https://www.ycombinator.com/companies/pally",
    color: "orange",
    monogram: "PA",
  },
];

const filters = [
  { key: "all", label: "全部资源" },
  { key: "program", label: "开放计划" },
  { key: "organization", label: "孵化机构" },
  { key: "event", label: "创业活动" },
  { key: "startup", label: "创业项目" },
];

const categories = [
  {
    eyebrow: "OPEN PROGRAMS",
    title: "开放计划",
    count: String(resources.filter((resource) => resource.type === "program").length),
    note: "加速器、比赛、资助与国际落地机会",
    className: "category-blue",
    type: "program",
  },
  {
    eyebrow: "ORGANIZATIONS",
    title: "孵化机构",
    count: String(resources.filter((resource) => resource.type === "organization").length),
    note: "大学、政府、企业与独立创新机构",
    className: "category-mint",
    type: "organization",
  },
  {
    eyebrow: "UPCOMING EVENTS",
    title: "创业活动",
    count: String(resources.filter((resource) => resource.type === "event").length),
    note: "大会、Demo Day、路演与创始人聚会",
    className: "category-orange",
    type: "event",
  },
  {
    eyebrow: "STARTUP PROJECTS",
    title: "创业项目",
    count: String(resources.filter((resource) => resource.type === "startup").length),
    note: "发现来自世界各地的新产品与团队",
    className: "category-lilac",
    type: "startup",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const visibleResources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const typeMatches = activeType === "all" || resource.type === activeType;
      const searchable = [
        resource.name,
        resource.location,
        resource.description,
        resource.kind,
        ...resource.tags,
      ]
        .join(" ")
        .toLowerCase();
      return typeMatches && (!normalized || searchable.includes(normalized));
    });
  }, [activeType, query]);

  const displayedResources =
    showAll || activeType !== "all" || query
      ? visibleResources
      : visibleResources.slice(0, 6);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseCategory(type: string) {
    setQuery("");
    setActiveType(type);
    setShowAll(true);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function applyQuickSearch(term: string) {
    setActiveType("all");
    setQuery(term);
    setShowAll(true);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <div className="announcement">
        <span>首批内容上线</span>
        <p>16 条创业资源已于 2026.07.15 通过官方页面核验</p>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Pioneer 首页">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>PIONEER</span>
        </a>

        <nav aria-label="主导航">
          <a href="#categories">发现资源</a>
          <a href="#resources">开放计划</a>
          <a href="#cities">创业城市</a>
          <a href="#about">关于我们</a>
        </nav>

        <a className="submit-link" href="#submit">
          提交资源 <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="kicker">
            <span className="pulse" /> GLOBAL STARTUP RESOURCE DIRECTORY
          </div>
          <h1>
            <span>世界很大，</span>
            <span><em>机会</em>不应难找。</span>
          </h1>
          <p className="hero-intro">
            搜索世界各地的创业活动、孵化器、加速计划、创新机构与创业项目。
            无需注册，直接发现。
          </p>

          <form className="search-box" onSubmit={handleSearch} role="search">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <label className="sr-only" htmlFor="resource-search">
              搜索创业资源
            </label>
            <input
              id="resource-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索国家、城市、行业或机构……"
            />
            <button type="submit">
              <span className="search-full">搜索资源</span>
              <span className="search-short">搜索</span>
            </button>
          </form>

          <div className="popular-searches" aria-label="热门搜索">
            <span>热门：</span>
            {["AI", "新加坡", "国际团队", "科技大会"].map((term) => (
              <button key={term} type="button" onClick={() => applyQuickSearch(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>

        <aside className="atlas-card" aria-label="全球创业资源分布预览">
          <div className="atlas-topline">
            <span>GLOBAL SIGNAL MAP</span>
            <span className="live-indicator">LIVE</span>
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="atlas-scan" />
          <div className="globe" aria-hidden="true">
            <span className="globe-line globe-line-one" />
            <span className="globe-line globe-line-two" />
            <span className="landmass landmass-one" />
            <span className="landmass landmass-two" />
            <span className="landmass landmass-three" />
          </div>
          <div className="atlas-core">
            <strong>{resources.length}</strong>
            <span>已核验创业资源</span>
          </div>
          <div className="map-pin pin-singapore">
            <span>新加坡</span>
            <strong>01</strong>
          </div>
          <div className="map-pin pin-london">
            <span>伦敦</span>
            <strong>02</strong>
          </div>
          <div className="map-pin pin-berlin">
            <span>巴黎</span>
            <strong>02</strong>
          </div>
          <div className="map-pin pin-sf">
            <span>旧金山</span>
            <strong>05</strong>
          </div>
          <div className="atlas-footer">
            <span>8 个国家与地区</span>
            <span>9 个机会可立即行动</span>
          </div>
        </aside>
      </section>

      <section className="metrics" aria-label="平台数据">
        <div>
          <strong>{resources.length}</strong>
          <span>已整理资源</span>
        </div>
        <div>
          <strong>8</strong>
          <span>国家与地区</span>
        </div>
        <div>
          <strong>9</strong>
          <span>可立即行动</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>附官方来源</span>
        </div>
        <p>持续发现、整理并核验全球创业生态中的有效资源。</p>
      </section>

      <section className="section categories-section" id="categories">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / EXPLORE</span>
            <h2>从你需要的资源开始</h2>
          </div>
          <p>不是堆积链接，而是把每一类创业资源整理成可以理解和比较的信息。</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              type="button"
              className={`category-card ${category.className}`}
              key={category.title}
              onClick={() => chooseCategory(category.type)}
            >
              <span className="category-eyebrow">{category.eyebrow}</span>
              <span className="category-count">{category.count}</span>
              <span className="category-title">
                {category.title} <i aria-hidden="true">↗</i>
              </span>
              <span className="category-note">{category.note}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-heading resources-heading">
          <div>
            <span className="section-index">02 / FRESH RESOURCES</span>
            <h2>最近值得关注</h2>
          </div>
          <span className="updated-note">
            <i /> 每日更新 · 信息附官方来源
          </span>
        </div>

        <div className="filter-row" aria-label="资源分类筛选">
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.key}
                className={activeType === filter.key ? "active" : ""}
                onClick={() => { setActiveType(filter.key); setShowAll(true); }}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="result-count" aria-live="polite">
            {query ? `“${query}” · ` : ""}{visibleResources.length} 条已核验资源
          </span>
        </div>

        {visibleResources.length ? (
          <div className="resource-grid">
            {displayedResources.map((resource) => (
              <article className="resource-card" key={resource.id}>
                <div className="resource-card-top">
                  <span className={`resource-logo logo-${resource.color}`}>
                    {resource.monogram}
                  </span>
                  <div className="resource-status-group">
                    <span className="resource-status"><i />{resource.status}</span>
                    <span className="resource-kind">{resource.kind}</span>
                  </div>
                </div>
                <div className="resource-location">{resource.location}</div>
                <h3>{resource.name}</h3>
                <p>{resource.description}</p>
                <div className="tag-list">
                  {resource.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="resource-footer">
                  <div className="resource-source">
                    <strong>{resource.timing}</strong>
                    <span>{resource.verified} · {resource.source}</span>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`前往 ${resource.name} 官方页面`}
                  >
                    查看 <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>没有找到匹配的资源</span>
            <button type="button" onClick={() => setQuery("")}>
              清除搜索
            </button>
          </div>
        )}

        {activeType === "all" && !query && !showAll ? (
          <button className="all-resources" type="button" onClick={() => setShowAll(true)}>
            浏览全部 {resources.length} 条资源 <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button className="all-resources" type="button" onClick={() => { setActiveType("all"); setQuery(""); setShowAll(false); }}>
            返回精选资源 <span aria-hidden="true">↑</span>
          </button>
        )}
      </section>

      <section className="cities-section" id="cities">
        <div className="cities-copy">
          <span className="section-index light">03 / STARTUP CITIES</span>
          <h2>
            从一座城市，
            <br />
            进入一个创业生态。
          </h2>
          <p>按城市查看当地的机构、活动、开放计划与代表性创业项目。</p>
          <button type="button">探索全球城市 →</button>
        </div>
        <div className="city-list" aria-label="热门创业城市">
          {["新加坡", "伦敦", "柏林", "深圳", "旧金山"].map((city, index) => (
            <button type="button" key={city}>
              <span>0{index + 1}</span>
              <strong>{city}</strong>
              <i>{["Singapore", "London", "Berlin", "Shenzhen", "San Francisco"][index]}</i>
              <b>↗</b>
            </button>
          ))}
        </div>
      </section>

      <section className="submit-section" id="submit">
        <span className="submit-kicker">KNOW A GREAT RESOURCE?</span>
        <h2>让有价值的资源，被更多创业者看见。</h2>
        <p>无需注册即可提交。我们会核验来源、整理信息，再公开发布。</p>
        <button type="button">提交一个资源 ↗</button>
      </section>

      <footer id="about">
        <div className="footer-brand">
          <span className="brand-mark">P</span>
          <div>
            <strong>PIONEER</strong>
            <p>GLOBAL STARTUP RESOURCE DIRECTORY</p>
          </div>
        </div>
        <div className="footer-links">
          <a href="#categories">资源目录</a>
          <a href="#cities">创业城市</a>
          <a href="#submit">提交资源</a>
          <a href="#top">返回顶部 ↑</a>
        </div>
        <p className="copyright">© 2026 Pioneer. 内容最近核验：2026.07.15</p>
      </footer>
    </main>
  );
}
