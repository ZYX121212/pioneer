import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Pioneer as a resource directory and founder guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Pioneer — 全球创业资源与创业指南<\/title>/i);
  assert.match(html, /世界很大/);
  assert.match(html, /从你需要的资源开始/);
  assert.match(html, /href="\/knowledge"/);
  assert.match(html, /你的想法是真问题，还是自我感动/);
  assert.match(html, /href="\/knowledge\/find-the-real-problem"/);
  assert.match(html, /查看全部资源目录/);
  assert.match(html, /本周值得行动的 4 个创业机会/);
  assert.match(html, /href="\/weekly"/);
  assert.match(html, /精选资源/);
  assert.match(html, /开放计划/);
  assert.match(html, /孵化机构/);
  assert.match(html, /创业活动/);
  assert.match(html, /创业项目/);
  assert.match(html, /href="\/programs"/);
  assert.match(html, /href="\/organizations"/);
  assert.match(html, /href="\/events"/);
  assert.match(html, /href="\/startups"/);
  assert.doesNotMatch(html, /创业前的第一张地图|YC Startup Library/);
  assert.match(html, /Y Combinator/);
  assert.match(html, /Berkeley SkyDeck Batch 23/);
  assert.match(html, /href="\/resources\/y-combinator"/);
  assert.doesNotMatch(html, /href="https:\/\/www\.ycombinator\.com\/apply\/"/);
  assert.doesNotMatch(html, /示例资源|数据接入后上线/);
});

test("server-renders the English resource directory experience", async () => {
  const response = await render("/en");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Global Startup Resources &amp; Founder Briefs/);
  assert.match(html, /The world is large/);
  assert.match(html, /hero hero-en/);
  assert.match(html, /Opportunity<\/em> should be<\/span><span>easier to read/);
  assert.match(html, /Start With The Resource You Need/);
  assert.match(html, /Programs/);
  assert.match(html, /Institutions/);
  assert.match(html, /Events/);
  assert.match(html, /Startups/);
  assert.match(html, /href="\/en\/programs"/);
  assert.match(html, /href="\/en\/resources\/y-combinator"/);
  assert.match(html, /Research brief/);
  assert.match(html, /href="\/"/);
});

test("server-renders English directories and resource briefs", async () => {
  const directoryResponse = await render("/en/organizations");
  const directory = await directoryResponse.text();
  assert.equal(directoryResponse.status, 200);
  assert.match(directory, /Startup Institutions/);
  assert.match(directory, /More Than A Link List/);
  assert.match(directory, /Institution profile/);
  assert.match(directory, /href="\/en\/resources\/station-f"/);

  const detailResponse = await render("/en/resources/station-f");
  const detail = await detailResponse.text();
  assert.equal(detailResponse.status, 200);
  assert.match(detail, /What It Actually Is/);
  assert.match(detail, /Who Should Pay Attention/);
  assert.match(detail, /Before You Click Apply/);
  assert.match(detail, /Open official page/);
  assert.match(detail, /href="https:\/\/stationf\.co\/"/);
});

test("switches homepage samples in place while keeping directory links separate", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /useState<PreviewMode>\("featured"\)/);
  assert.match(page, /setActivePreview\(mode\)/);
  assert.match(page, /resource\.type === activePreview/);
  assert.match(page, /activePreview === "knowledge"/);
  assert.match(page, /href=\{directoryTarget\.href\}/);
});

test("tracks anonymous unique visitors and exposes the audience count in the interface", async () => {
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/audience/route.ts", import.meta.url), "utf8");
  const counter = await readFile(new URL("../app/components/AudienceCounter.tsx", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const analytics = await readFile(new URL("../app/admin/analytics/page.tsx", import.meta.url), "utf8");
  const newsletter = await readFile(new URL("../app/api/newsletter/route.ts", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../app/sitemap.xml/route.ts", import.meta.url), "utf8");
  const robots = await readFile(new URL("../app/robots.txt/route.ts", import.meta.url), "utf8");

  assert.match(schema, /siteVisitors/);
  assert.match(schema, /sitePageViews/);
  assert.match(schema, /siteEvents/);
  assert.match(schema, /newsletterSubscribers/);
  assert.match(schema, /source: text\("source"\)/);
  assert.match(schema, /visitorId: text\("visitor_id"\)\.primaryKey/);
  assert.match(route, /ON CONFLICT\(visitor_id\) DO UPDATE/);
  assert.match(route, /SELECT COUNT\(\*\) AS count FROM site_visitors/);
  assert.match(route, /INSERT INTO site_page_views/);
  assert.match(route, /INSERT INTO site_events/);
  assert.match(route, /topSources/);
  assert.match(route, /newsletter_subscribers/);
  assert.match(counter, /pioneer:anonymous-visitor-id/);
  assert.match(counter, /window\.crypto\.randomUUID\(\)/);
  assert.match(counter, /data-audience-event/);
  assert.match(counter, /utm_source/);
  assert.match(page, /累计独立访客/);
  assert.match(page, /累计浏览次数/);
  assert.match(page, /trackAudienceEvent\("search:submit"/);
  assert.match(analytics, /创业者反馈仪表盘/);
  assert.match(analytics, /热门访问路径/);
  assert.match(analytics, /关键行为/);
  assert.match(analytics, /访问来源/);
  assert.match(analytics, /累计订阅/);
  assert.match(newsletter, /INSERT INTO newsletter_subscribers/);
  assert.match(sitemap, /sitemaps\.org\/schemas\/sitemap/);
  assert.match(robots, /sitemap\.xml/);
});

test("renders the weekly opportunity signup and share action sitewide", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /每周一次，把真正值得关注的创业机会发给你/);
  assert.match(html, /订阅每周机会/);
  assert.match(html, /分享 Pioneer/);

  const englishResponse = await render("/en");
  const english = await englishResponse.text();
  assert.match(english, /One useful startup opportunity briefing, every week/);
  assert.match(english, /Get the weekly brief/);
});

test("publishes search discovery files for public pages", async () => {
  const verification = await readFile(new URL("../public/google357e53b311b2261b.html", import.meta.url), "utf8");
  assert.equal(verification.trim(), "google-site-verification: google357e53b311b2261b.html");

  const sitemapResponse = await render("/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /application\/xml/);
  assert.match(sitemap, /<loc>https:\/\/pioneer-global-resources\.hiayun\.chatgpt\.site\/programs<\/loc>/);
  assert.match(sitemap, /\/resources\/y-combinator<\/loc>/);
  assert.match(sitemap, /\/en\/resources\/y-combinator<\/loc>/);
  assert.match(sitemap, /\/weekly<\/loc>/);

  const robotsResponse = await render("/robots.txt");
  const robots = await robotsResponse.text();
  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Disallow: \/admin\//);
  assert.match(robots, /Sitemap: .*\/sitemap\.xml/);
});

test("renders the first weekly opportunity brief with actionable official links", async () => {
  const response = await render("/weekly");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /本周值得行动的/);
  assert.match(html, /WAIC 2026 世界人工智能大会/);
  assert.match(html, /Y Combinator/);
  assert.match(html, /Entrepreneur First London/);
  assert.match(html, /Berkeley SkyDeck Batch 23/);
  assert.match(html, /今天完成这三步/);
  assert.match(html, /打开官方页面/);
  assert.match(html, /data-audience-event="weekly:official"/);
  assert.match(html, /分享本期/);
  assert.match(html, /href="\/weekly\/deadlines\.ics"/);
  assert.match(html, /href="\/feed\.xml"/);
  assert.match(html, /weekly-og\.png/);
  assert.match(html, /application\/ld\+json/);
});

test("publishes the weekly brief as a calendar and RSS feed", async () => {
  const calendarResponse = await render("/weekly/deadlines.ics");
  const calendar = await calendarResponse.text();
  assert.equal(calendarResponse.status, 200);
  assert.match(calendarResponse.headers.get("content-type") ?? "", /text\/calendar/);
  assert.match(calendar, /BEGIN:VCALENDAR/);
  assert.match(calendar, /Y Combinator Fall 2026/);
  assert.match(calendar, /20260821/);

  const feedResponse = await render("/feed.xml");
  const feed = await feedResponse.text();
  assert.equal(feedResponse.status, 200);
  assert.match(feedResponse.headers.get("content-type") ?? "", /application\/rss\+xml/);
  assert.match(feed, /Pioneer 本周创业机会/);
  assert.match(feed, /本周值得行动的 4 个创业机会/);
});

test("accepts bilingual resource recommendations into the review workflow", async () => {
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const api = await readFile(new URL("../app/api/submissions/route.ts", import.meta.url), "utf8");
  assert.match(schema, /resourceSubmissions/);
  assert.match(api, /INSERT INTO resource_submissions/);
  assert.match(api, /pending/);
  assert.match(api, /shareToken/);

  const chineseResponse = await render("/submit");
  const chinese = await chineseResponse.text();
  assert.equal(chineseResponse.status, 200);
  assert.match(chinese, /让真正有用的机会/);
  assert.match(chinese, /提交给 Pioneer 审核/);
  assert.match(chinese, /name="resourceUrl"/);

  const englishResponse = await render("/en/submit");
  const english = await englishResponse.text();
  assert.equal(englishResponse.status, 200);
  assert.match(english, /Help useful opportunities/);
  assert.match(english, /Submit for Pioneer review/);
});

test("turns resource submissions into measurable community referrals", async () => {
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const counter = await readFile(new URL("../app/components/AudienceCounter.tsx", import.meta.url), "utf8");
  const analyticsApi = await readFile(new URL("../app/api/audience/route.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../app/components/ResourceSubmissionForm.tsx", import.meta.url), "utf8");
  assert.match(schema, /shareToken/);
  assert.match(counter, /resource_submission/);
  assert.match(counter, /parameters\.get\("ref"\)/);
  assert.match(analyticsApi, /topReferrals/);
  assert.match(analyticsApi, /submissions\.share_token = views\.campaign/);
  assert.match(form, /专属来源链接/);
  assert.match(form, /submission:share/);
});

test("keeps the resource collection complete and source-linked", async () => {
  const data = await readFile(new URL("../app/data/resources.ts", import.meta.url), "utf8");
  const urls = [...data.matchAll(/url: "(https:\/\/[^\"]+)"/g)].map((match) => match[1]);
  const slugs = [...data.matchAll(/slug: "([^\"]+)"/g)].map((match) => match[1]);

  assert.ok(urls.length >= 53);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(slugs.length, urls.length);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.match(data, /type: "program"/);
  assert.match(data, /type: "organization"/);
  assert.match(data, /type: "event"/);
  assert.match(data, /type: "startup"/);
  assert.match(data, /editorialNote:/);
  assert.match(data, /bestFor:/);
  assert.match(data, /considerations:/);
  assert.match(data, /2026\.07\.16 核验/);
  assert.match(data, /detailPath: "\/waic-2026"/);
});

test("keeps the founder knowledge collection structured and source-linked", async () => {
  const data = await readFile(new URL("../app/data/knowledge.ts", import.meta.url), "utf8");
  const card = await readFile(new URL("../app/components/KnowledgeCard.tsx", import.meta.url), "utf8");
  const urls = [...data.matchAll(/url: "(https:\/\/[^\"]+)"/g)].map((match) => match[1]);

  assert.equal(urls.length, 29);
  assert.equal(new Set(urls).size, 25);
  assert.match(data, /slug: "find-the-real-problem"/);
  assert.match(data, /slug: "first-user-interview"/);
  assert.match(data, /slug: "define-your-mvp"/);
  assert.match(data, /slug: "find-your-first-ten-users"/);
  assert.match(data, /slug: "test-your-cofounder"/);
  assert.match(data, /slug: "decide-whether-to-fundraise"/);
  assert.match(data, /第一篇：发现真问题/);
  assert.match(data, /stage: "start"/);
  assert.match(data, /stage: "validate"/);
  assert.match(data, /stage: "team"/);
  assert.match(data, /stage: "company"/);
  assert.match(data, /stage: "funding"/);
  assert.match(card, /target="_blank"/);
});

test("keeps every resource backed by an individually authored research profile", async () => {
  const resourcesData = await readFile(new URL("../app/data/resources.ts", import.meta.url), "utf8");
  const profilesData = await readFile(new URL("../app/data/resourceProfiles.ts", import.meta.url), "utf8");
  const investmentProfilesData = await readFile(new URL("../app/data/investmentProfiles.ts", import.meta.url), "utf8");
  const startupProfilesData = await readFile(new URL("../app/data/startupProfiles.ts", import.meta.url), "utf8");
  const resourceSlugs = [...resourcesData.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
  const profileSlugs = [...profilesData.matchAll(/^  "([^"]+)": \{$/gm)].map((match) => match[1]);
  const investmentProfileSlugs = [...investmentProfilesData.matchAll(/^  (?:"([^"]+)"|([a-z]+)): \{$/gm)].map((match) => match[1] ?? match[2]);
  const startupProfileSlugs = [...startupProfilesData.matchAll(/^  (?:"([^"]+)"|([a-z]+)): \{$/gm)]
    .map((match) => match[1] ?? match[2])
    .filter((slug) => slug !== "snapshot" && slug !== "business");

  assert.ok(resourceSlugs.length >= 53);
  assert.equal(profileSlugs.length, 26);
  assert.equal(investmentProfileSlugs.length, 24);
  assert.ok(startupProfileSlugs.length >= 12);
  assert.deepEqual(new Set([...profileSlugs, ...investmentProfileSlugs, ...startupProfileSlugs]), new Set(resourceSlugs));
  assert.match(profilesData, /diligence: string\[\]/);
  assert.match(profilesData, /playbook: Array/);
  assert.match(profilesData, /comparison:/);
  assert.match(investmentProfilesData, /founderFit: string\[\]/);
  assert.match(investmentProfilesData, /questions: string\[\]/);
  assert.match(startupProfilesData, /lessons: Array/);
  assert.match(startupProfilesData, /risks: Array/);
});

test("renders China and US investor profiles inside the institution directory", async () => {
  const directoryResponse = await render("/organizations");
  const directory = await directoryResponse.text();
  assert.equal(directoryResponse.status, 200);
  assert.match(directory, /创业机构/);
  assert.match(directory, /投资机构/);
  assert.match(directory, /红杉中国 HongShan/);
  assert.equal((directory.match(/class="resource-card"/g) ?? []).length, 9);
  assert.match(directory, /共 28 条 · 当前显示 1–9/);
  assert.match(directory, /aria-label="第 4 页"/);

  const detailResponse = await render("/resources/linear-capital");
  const detail = await detailResponse.text();
  assert.equal(detailResponse.status, 200);
  assert.match(detail, /投资机构画像/);
  assert.match(detail, /它可能会被什么吸引/);
  assert.match(detail, /怎样更有效地接触它/);
  assert.match(detail, /\$1M–\$10M/);
});

test("paginates every directory while preserving search and filter behavior", async () => {
  const explorer = await readFile(new URL("../app/components/DirectoryExplorer.tsx", import.meta.url), "utf8");

  assert.match(explorer, /const pageSize = 9/);
  assert.match(explorer, /visible\.slice\(pageStart, pageStart \+ pageSize\)/);
  assert.match(explorer, /URLSearchParams\(window\.location\.search\)/);
  assert.match(explorer, /window\.addEventListener\("popstate"/);
  assert.match(explorer, /url\.searchParams\.set\("page", String\(page\)\)/);
  assert.match(explorer, /setQuery\(event\.target\.value\); resetPage\(\)/);
  assert.match(explorer, /setActiveTag\(tag\); resetPage\(\)/);

  const englishResponse = await render("/en/organizations");
  const english = await englishResponse.text();
  assert.equal(englishResponse.status, 200);
  assert.match(english, /28 entries · showing 1–9/);
  assert.match(english, /Directory pagination/);
});

test("renders a directory and an internal editorial detail before the official source", async () => {
  const directoryResponse = await render("/programs");
  const directory = await directoryResponse.text();
  assert.equal(directoryResponse.status, 200);
  assert.match(directory, /先判断是否适合，再决定是否行动/);
  assert.match(directory, /经过整理，不只是链接/);

  const detailResponse = await render("/resources/y-combinator");
  const detail = await detailResponse.text();
  assert.equal(detailResponse.status, 200);
  assert.match(detail, /Pioneer 最终判断/);
  assert.match(detail, /先判断它究竟是什么/);
  assert.match(detail, /能力画像：强在哪里，弱在哪里/);
  assert.match(detail, /你实际能够获得什么/);
  assert.match(detail, /不是只有一个入口/);
  assert.match(detail, /把隐性成本放到桌面上/);
  assert.match(detail, /行动前必须问清的问题/);
  assert.match(detail, /href="https:\/\/www\.ycombinator\.com\/apply\/"/);
});

test("renders an editorial institution portrait without changing the official source", async () => {
  const response = await render("/resources/station-f");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /机构身份与运作逻辑/);
  assert.match(html, /资源结构：有资源，不等于你能获得/);
  assert.match(html, /项目组合、生态角色与进入方式/);
  assert.match(html, /最后判断：是否值得进入/);
  assert.match(html, /多项目创业园区/);
  assert.match(html, /提供什么/);
  assert.match(html, /如何获得/);
  assert.match(html, /主要边界/);
  assert.match(html, /四家机构横向比较/);
  assert.match(html, /成果证据与代表案例/);
  assert.match(html, /申请与筛选机制/);
  assert.match(html, /费用、股权与真实成本/);
  assert.match(html, /替代机构与替代路径/);
  assert.match(html, /申请匹配度自测/);
  assert.match(html, /Future 40 约为园区前 4%/);
  assert.match(html, /href="https:\/\/stationf\.co\/"/);
});

test("keeps every featured institution backed by a structured intelligence profile", async () => {
  const data = await readFile(new URL("../app/data/organizationProfiles.ts", import.meta.url), "utf8");

  for (const slug of ["station-f", "block71", "entrepreneur-first", "berkeley-skydeck"]) {
    assert.match(data, new RegExp(`^  "?${slug}"?: \\{$`, "m"));
  }

  assert.match(data, /dna: \[/);
  assert.match(data, /resources: \[/);
  assert.match(data, /portfolio: \[/);
  assert.match(data, /ecosystem: \[/);
  assert.match(data, /scenarios: \[/);
  assert.match(data, /redFlags: \[/);
  assert.match(data, /dossier: \{/);
  assert.match(data, /evidence: \[/);
  assert.match(data, /selection: \{/);
  assert.match(data, /economics: \[/);
  assert.match(data, /alternatives: \[/);
  assert.match(data, /selfCheck: \[/);
  assert.match(data, /export const organizationComparison/);
});

test("renders type-specific research depth for events and startup projects", async () => {
  const eventDirectoryResponse = await render("/events");
  const eventDirectory = await eventDirectoryResponse.text();
  assert.equal(eventDirectoryResponse.status, 200);
  assert.match(eventDirectory, /WAIC 2026 世界人工智能大会/);
  assert.match(eventDirectory, /href="\/waic-2026"/);

  const eventResponse = await render("/resources/slush-2026");
  const event = await eventResponse.text();
  assert.equal(eventResponse.status, 200);
  assert.match(event, /Startup Ticket/);
  assert.match(event, /Slush Platform/);
  assert.match(event, /基金长名单/);

  const waicResponse = await render("/waic-2026");
  const waic = await waicResponse.text();
  assert.equal(waicResponse.status, 200);
  assert.match(waic, /三地四馆/);
  assert.match(waic, /href="#waic-overview"/);
  assert.match(waic, /detail-layout waic-detail-layout/);
  assert.match(waic, /detail-main waic-detail-main/);
  assert.match(waic, /waic-fact-panel/);
  assert.match(waic, /detail-sidebar waic-detail-sidebar/);
  assert.match(waic, /四馆与地图/);
  assert.match(waic, /先看城市关系，再决定一天怎么走/);
  assert.match(waic, /场馆入口、交通与接驳指南/);
  assert.match(waic, /搜索重点展商或方向/);
  assert.match(waic, /打开官方完整展商目录/);
  assert.match(waic, /MiniMax M3 多模态模型/);
  assert.match(waic, /waic-radar-more/);
  assert.match(waic, /创业者路线/);
  assert.match(waic, /WAIC 周边活动日历/);
  assert.match(waic, /37(?:<!-- -->)? 场周边活动/);
  assert.match(waic, /24 个城市地标/);
  assert.match(waic, /WAIC ACADEMIC/);
  assert.match(waic, /Future Tech 与 OPC/);
  assert.match(waic, /AI 时代创业者闭门交流会/);
  assert.match(waic, /KEY FACTS/);
  assert.match(waic, /SOURCE &amp; ACTION/);
  assert.match(waic, /前往官方页面/);
  assert.match(waic, /中国 · 上海 · 三地四馆/);
  assert.match(waic, /7 月 16 日/);
  assert.match(waic, /7 月 20 日/);
  assert.match(waic, /Demo Day @ Physical AI Camp/);
  assert.match(waic, /GO SUMMIT × WAIC 上海/);
  assert.match(waic, /第二届 AI 研究者派对之夏/);
  assert.match(waic, /Creator Night/);
  assert.match(waic, /信息最后核验：2026.07.17/);
  assert.match(waic, /原始参考来源/);

  const startupResponse = await render("/resources/cerenovus");
  const startup = await startupResponse.text();
  assert.equal(startupResponse.status, 200);
  assert.match(startup, /公司知识图谱/);
  assert.match(startup, /组织系统图/);
  assert.match(startup, /管理问题试点/);

  const startupDirectoryResponse = await render("/startups");
  const startupDirectory = await startupDirectoryResponse.text();
  assert.equal(startupDirectoryResponse.status, 200);
  assert.match(startupDirectory, /共 \d+ 条 · 当前显示 1–9/);
  assert.match(startupDirectory, /DeepSeek 深度求索/);
  assert.match(startupDirectory, /aria-label="第 2 页"/);

  const researchedStartupResponse = await render("/resources/anthropic");
  const researchedStartup = await researchedStartupResponse.text();
  assert.equal(researchedStartupResponse.status, 200);
  assert.match(researchedStartup, /创业项目研究章节/);
  assert.match(researchedStartup, /先用一分钟理解它/);
  assert.match(researchedStartup, /它走到了哪一步/);
  assert.match(researchedStartup, /谁在使用，谁在付钱/);
  assert.match(researchedStartup, /产品不是一个功能，而是一套系统/);
  assert.match(researchedStartup, /哪些信息是证据，哪些只是故事/);
  assert.match(researchedStartup, /它必须战胜什么/);
  assert.match(researchedStartup, /每一项风险都要对应观察指标/);
  assert.match(researchedStartup, /创业者真正可以借鉴什么/);
  assert.match(researchedStartup, /最终判断，以及下一步看什么/);
  assert.match(researchedStartup, /href="#startup-verdict"/);

  const englishStartupResponse = await render("/en/resources/elevenlabs");
  const englishStartup = await englishStartupResponse.text();
  assert.equal(englishStartupResponse.status, 200);
  assert.match(englishStartup, /Voice AI \/ creative platform/);
  assert.match(englishStartup, /Open official page/);
});

test("renders the founder learning path and knowledge filters", async () => {
  const response = await render("/knowledge");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /不是多读几篇/);
  assert.match(html, /而是做对下一个决定/);
  assert.match(html, /首篇指南/);
  assert.match(html, /你的想法是真问题，还是一个你喜欢的解决方案/);
  assert.match(html, /你现在/);
  assert.match(html, /卡在哪里/);
  assert.match(html, /继续查阅原始资料/);
  assert.match(html, /篇已上线/);
  assert.match(html, /knowledge-layer-main-summary/);
  assert.match(html, /knowledge-layer-guide-grid/);
  assert.match(html, /跨类型决策案例/);
  assert.match(html, /6 张可保存工作表/);
  assert.match(html, /href="\/knowledge\/first-user-interview"/);
  assert.match(html, /href="\/knowledge\/define-your-mvp"/);
  assert.match(html, /href="\/knowledge\/find-your-first-ten-users"/);
  assert.match(html, /href="\/knowledge\/test-your-cofounder"/);
  assert.match(html, /href="\/knowledge\/decide-whether-to-fundraise"/);
  assert.match(html, /你现在，最接近哪一种处境/);
  assert.match(html, /建立你的创业项目档案/);
  assert.match(html, /创业项目档案/);
  assert.match(html, /最近阶段判断/);
  assert.match(html, /团队与股权/);
  assert.match(html, /SAFE 融资文件与说明/);
  assert.match(html, /美国公司/);
});

test("renders the first Pioneer decision guide", async () => {
  const response = await render("/knowledge/find-the-real-problem");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /创业不是从“产品”开始/);
  assert.match(html, /把想法改写成观察/);
  assert.match(html, /证据有强弱/);
  assert.match(html, /三天验证/);
  assert.match(html, /真实存在的问题，也不一定值得成立一家公司/);
  assert.match(html, /10–30 名兼职员工/);
  assert.match(html, /不要默认选择访谈/);
  assert.match(html, /同一个框架，在不同创业类型中如何变化/);
  assert.match(html, /问题陈述生成器/);
  assert.match(html, /阶段判断/);
  assert.match(html, /AI 产品/);
  assert.match(html, /参考来源与 Pioneer 的使用方式/);
});

test("renders the second Pioneer interview guide and its working tool", async () => {
  const response = await render("/knowledge/first-user-interview");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /PIONEER GUIDE 02/);
  assert.match(html, /一次访谈，只解决一个主要学习目标/);
  assert.match(html, /四种常见招募方式与邀请模板/);
  assert.match(html, /30 分钟流程/);
  assert.match(html, /把意见题、未来题和诱导题/);
  assert.match(html, /无效版本/);
  assert.match(html, /单次访谈记录表/);
  assert.match(html, /保存阶段判断/);
  assert.match(html, /五次访谈不是市场验证/);
  assert.match(html, /href="https:\/\/www\.momtestbook\.com\/"/);
});

test("renders the MVP decision guide and local evidence tool", async () => {
  const response = await render("/knowledge/define-your-mvp");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /PIONEER GUIDE 03/);
  assert.match(html, /第一版的边界，应该由最大的不确定性决定/);
  assert.match(html, /不要交付十个残缺功能/);
  assert.match(html, /两周不是开发期限/);
  assert.match(html, /MVP 边界卡/);
  assert.match(html, /保存到证据档案/);
  assert.match(html, /调整假设/);
  assert.match(html, /Practical Design: MVP Spec/);
});

test("renders the first ten users guide and action pipeline", async () => {
  const response = await render("/knowledge/find-your-first-ten-users");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /PIONEER GUIDE 04/);
  assert.match(html, /第一批用户不是整个市场/);
  assert.match(html, /先写出 30 个具体名字/);
  assert.match(html, /不要看有多少人看见/);
  assert.match(html, /首批用户行动卡/);
  assert.match(html, /Do Things that Don.t Scale/);
});

test("renders the cofounder validation guide and working agreement tool", async () => {
  const response = await render("/knowledge/test-your-cofounder");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /PIONEER GUIDE 05/);
  assert.match(html, /你缺的是共同创业者/);
  assert.match(html, /用四周真实共事/);
  assert.match(html, /股权不是奖励过去点子/);
  assert.match(html, /联合创始人验证卡/);
  assert.match(html, /不构成公司、证券、税务/);
  assert.match(html, /How to Split Equity Among Co-Founders/);
});

test("renders the fundraising decision guide and milestone budget tool", async () => {
  const response = await render("/knowledge/decide-whether-to-fundraise");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /PIONEER GUIDE 06/);
  assert.match(html, /不是所有好生意/);
  assert.match(html, /一轮融资应该购买一次风险下降/);
  assert.match(html, /金额来自里程碑预算/);
  assert.match(html, /融资必要性判断卡/);
  assert.match(html, /不构成证券、投资、法律/);
  assert.match(html, /A Guide to Seed Fundraising/);
});
