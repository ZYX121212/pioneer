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
  color: string;
  monogram: string;
};

const resources: Resource[] = [
  {
    id: 1,
    type: "program",
    kind: "加速计划",
    name: "Antler Residency",
    location: "新加坡 · Singapore",
    description: "面向早期创始人的全球创业计划，从组建团队到首轮融资。",
    tags: ["早期项目", "跨行业", "国际团队"],
    timing: "滚动申请",
    color: "blue",
    monogram: "AN",
  },
  {
    id: 2,
    type: "organization",
    kind: "孵化机构",
    name: "Berkeley SkyDeck",
    location: "美国 · Berkeley",
    description: "连接大学研究、产业导师与投资网络的科技创业加速平台。",
    tags: ["深科技", "AI", "大学生态"],
    timing: "已核验 · 2天前",
    color: "mint",
    monogram: "BS",
  },
  {
    id: 3,
    type: "event",
    kind: "创业活动",
    name: "Slush 2026",
    location: "芬兰 · Helsinki",
    description: "汇聚全球创始人、投资人与科技生态建设者的年度大会。",
    tags: ["科技大会", "融资", "线下"],
    timing: "11月18日",
    color: "orange",
    monogram: "SL",
  },
  {
    id: 4,
    type: "program",
    kind: "创业计划",
    name: "EIT Jumpstarter",
    location: "欧洲 · Hybrid",
    description: "帮助科研与创新团队把早期技术转化为可验证的商业项目。",
    tags: ["气候科技", "健康", "科研转化"],
    timing: "开放申请",
    color: "violet",
    monogram: "EJ",
  },
  {
    id: 5,
    type: "startup",
    kind: "创业项目",
    name: "Moonsift",
    location: "英国 · London",
    description: "用更自然的方式收藏、比较和分享来自不同网站的产品。",
    tags: ["Consumer", "Commerce", "SaaS"],
    timing: "项目档案",
    color: "yellow",
    monogram: "MO",
  },
  {
    id: 6,
    type: "organization",
    kind: "创新机构",
    name: "BLOCK71",
    location: "新加坡 · Global",
    description: "由大学与产业共同支持，连接亚洲创业者和全球创新节点。",
    tags: ["亚洲", "国际落地", "社区"],
    timing: "已核验 · 5天前",
    color: "rose",
    monogram: "71",
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
    count: "328",
    note: "加速器、比赛、资助与国际落地机会",
    className: "category-blue",
    type: "program",
  },
  {
    eyebrow: "ORGANIZATIONS",
    title: "孵化机构",
    count: "460",
    note: "大学、政府、企业与独立创新机构",
    className: "category-mint",
    type: "organization",
  },
  {
    eyebrow: "UPCOMING EVENTS",
    title: "创业活动",
    count: "192",
    note: "大会、Demo Day、路演与创始人聚会",
    className: "category-orange",
    type: "event",
  },
  {
    eyebrow: "STARTUP PROJECTS",
    title: "创业项目",
    count: "300",
    note: "发现来自世界各地的新产品与团队",
    className: "category-lilac",
    type: "startup",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");

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

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseCategory(type: string) {
    setActiveType(type);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <div className="announcement">
        <span>原型预览</span>
        页面内容为设计示例，正式资源将在数据接入后上线
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
            世界很大，
            <br />
            <em>机会</em>不应难找。
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
            <button type="submit">搜索资源</button>
          </form>

          <div className="popular-searches" aria-label="热门搜索">
            <span>热门：</span>
            {["AI 加速器", "新加坡", "国际团队", "Demo Day"].map((term) => (
              <button key={term} type="button" onClick={() => setQuery(term)}>
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
          <div className="atlas-core">
            <strong>1,280</strong>
            <span>全球创业资源</span>
          </div>
          <div className="map-pin pin-singapore">
            <span>新加坡</span>
            <strong>38</strong>
          </div>
          <div className="map-pin pin-london">
            <span>伦敦</span>
            <strong>56</strong>
          </div>
          <div className="map-pin pin-berlin">
            <span>柏林</span>
            <strong>31</strong>
          </div>
          <div className="map-pin pin-sf">
            <span>旧金山</span>
            <strong>92</strong>
          </div>
          <div className="atlas-footer">
            <span>42 个国家与地区</span>
            <span>328 个机会正在开放</span>
          </div>
        </aside>
      </section>

      <section className="metrics" aria-label="平台数据">
        <div>
          <strong>1,280</strong>
          <span>已整理资源</span>
        </div>
        <div>
          <strong>42</strong>
          <span>国家与地区</span>
        </div>
        <div>
          <strong>328</strong>
          <span>正在开放</span>
        </div>
        <div>
          <strong>76%</strong>
          <span>一周内已核验</span>
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
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.key}
              className={activeType === filter.key ? "active" : ""}
              onClick={() => setActiveType(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {visibleResources.length ? (
          <div className="resource-grid">
            {visibleResources.map((resource) => (
              <article className="resource-card" key={resource.id}>
                <div className="resource-card-top">
                  <span className={`resource-logo logo-${resource.color}`}>
                    {resource.monogram}
                  </span>
                  <span className="resource-kind">{resource.kind}</span>
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
                  <span>{resource.timing}</span>
                  <button type="button" aria-label={`查看 ${resource.name} 详情`}>
                    ↗
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>没有找到匹配的示例资源</span>
            <button type="button" onClick={() => setQuery("")}>
              清除搜索
            </button>
          </div>
        )}

        <button className="all-resources" type="button" onClick={() => setActiveType("all")}>
          浏览全部资源 <span aria-hidden="true">→</span>
        </button>
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
        <p className="copyright">© 2026 Pioneer. 让创业资源更容易被发现。</p>
      </footer>
    </main>
  );
}
