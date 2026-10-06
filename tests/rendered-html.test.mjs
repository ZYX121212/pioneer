import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/", at = "2026-10-05T04:00:00Z") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const NativeDate = globalThis.Date;
  globalThis.Date = class extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [at])); }
    static now() { return NativeDate.parse(at); }
  };
  try {
    return await worker.fetch(
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
  } finally { globalThis.Date = NativeDate; }
}

test("server-renders Pioneer as a resource directory and founder guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Pioneer — 全球创业资源与创业指南<\/title>/i);
  assert.match(html, /全球创业/);
  assert.match(html, /你现在想解决什么/);
  assert.match(html, /href="\/knowledge"/);
  assert.match(html, /问题验证/);
  assert.match(html, /href="\/knowledge\/find-the-real-problem"/);
  assert.match(html, /查看全部/);
  assert.match(html, /最近一期 · 4 个创业机会核验/);
  assert.match(html, /href="\/weekly"/);
  assert.match(html, /精选资源/);
  assert.match(html, /开放计划/);
  assert.match(html, /找机构/);
  assert.match(html, /创业活动/);
  assert.match(html, /创业项目/);
  assert.match(html, /href="\/programs"/);
  assert.match(html, /href="\/organizations"/);
  assert.match(html, /href="\/events"/);
  assert.match(html, /href="\/startups"/);
  assert.doesNotMatch(html, /创业前的第一张地图|YC Startup Library/);
  assert.match(html, /Y Combinator/);
  assert.match(html, /href="\/resources\/y-combinator"/);
  assert.doesNotMatch(html, /href="https:\/\/www\.ycombinator\.com\/apply\/"/);
  assert.doesNotMatch(html, /示例资源|数据接入后上线/);
});

test("server-renders the English resource directory experience", async () => {
  const response = await render("/en");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /GLOBAL STARTUP OPPORTUNITY NETWORK/);
  assert.match(html, /The world is big/);
  assert.match(html, /design-hero/);
  assert.match(html, /Opportunity should/);
  assert.match(html, /What are you trying to solve/);
  assert.match(html, /Programs/);
  assert.match(html, /Institutions/);
  assert.match(html, /Events/);
  assert.match(html, /Startups/);
  assert.match(html, /href="\/en\/programs"/);
  assert.match(html, /href="\/en\/resources\/y-combinator"/);
  assert.match(html, /Selected resources/);
  assert.match(html, /href="\/"/);
});

test("server-renders English directories and resource briefs", async () => {
  const directoryResponse = await render("/en/organizations");
  const directory = await directoryResponse.text();
  assert.equal(directoryResponse.status, 200);
  assert.match(directory, /Startup Institutions/);
  assert.match(directory, /Resource list/);
  assert.match(directory, /Current window needs rechecking/);
  assert.match(directory, /href="\/en\/resources\/station-f"/);

  const detailResponse = await render("/en/resources/station-f");
  const detail = await detailResponse.text();
  assert.equal(detailResponse.status, 200);
  assert.match(detail, /What it actually is/);
  assert.match(detail, /Who it&#x27;s for|Who it’s for|Who it.s for/);
  assert.match(detail, /Check these conditions|Considerations/);
  assert.match(detail, /Visit official website/);
  assert.match(detail, /href="https:\/\/stationf\.co\/"/);
});

test("switches homepage samples in place while keeping directory links separate", async () => {
  const page = await readFile(new URL("../app/components/HomeExperience.tsx", import.meta.url), "utf8");

  assert.match(page, /useState<Mode>\('featured'\)/);
  assert.match(page, /setMode\(id\)/);
  assert.match(page, /href=\{directory\}/);

});

test("tracks anonymous unique visitors and exposes the audience count in the interface", async () => {
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/audience/route.ts", import.meta.url), "utf8");
  const counter = await readFile(new URL("../app/components/AudienceCounter.tsx", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/components/HomeExperience.tsx", import.meta.url), "utf8");
  const analytics = await readFile(new URL("../app/components/AdminAnalytics.tsx", import.meta.url), "utf8");
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
  const homeVisuals = await readFile(new URL("../app/components/HomeVisuals.tsx", import.meta.url), "utf8");
  assert.match(homeVisuals, /累计独立访客/);
  assert.match(homeVisuals, /累计浏览次数/);
  assert.match(page, /trackAudienceEvent\('search:submit'/);
  assert.match(analytics, /创业者反馈仪表盘/);
  assert.match(analytics, /热门访问路径/);
  assert.match(analytics, /关键行为/);
  assert.match(analytics, /访问来源/);
  assert.match(analytics, /已确认通知主题/);
  assert.match(newsletter, /registerNewsletterInterest/);
  assert.match(sitemap, /sitemaps\.org\/schemas\/sitemap/);
  assert.match(robots, /sitemap\.xml/);
});

test("renders the weekly opportunity signup and share action sitewide", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /从官方来源，找到值得行动的创业机会/);
  assert.match(html, /登记邮件通知/);
  assert.match(html, /分享 Pioneer/);

  const englishResponse = await render("/en");
  const english = await englishResponse.text();
  assert.match(english, /Find founder opportunities through official sources/);
  assert.match(english, /Register for email updates/);
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

test("renders bilingual issue 003 with checked windows and archival navigation", async () => {
  for (const prefix of ["", "/en"]) {
    const response = await render(`${prefix}/weekly`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /WEEKLY SIGNAL · (?:<!-- -->)?003/);
    assert.match(html, /2026.10.05—10.11/);
    for (const name of [/Winter 2027/, /Techstars New York City/, /Slush 365/, /Slush 2026/]) assert.match(html, name);
    assert.doesNotMatch(html, /Entrepreneur First London|Berkeley SkyDeck Batch 23|AWS Activate|TechBBQ 2026|weekly-og\.png/);
    assert.match(html, /data-audience-event="weekly:official"/);
    assert.match(html, new RegExp(`href="${prefix}/weekly/deadlines\\.ics"`));
    assert.match(html, new RegExp(`href="${prefix}/weekly/archive/002"`));
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /2026-10-05/);
  }
});

test("archives issue 002 without active calendar or official action tracking", async () => {
  for (const prefix of ["", "/en"]) {
    const response = await render(`${prefix}/weekly/archive/002`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /2026.07.30—08.05/);
    assert.match(html, /Entrepreneur First London/);
    assert.match(html, /TechBBQ 2026/);
    assert.doesNotMatch(html.split('<section class="growth-footer"')[0], /DAYS LEFT|剩余 \d+ 天|weekly:calendar|deadlines\.ics/);
    assert.match(html, /历史归档|Historical archive/);
    const archive003 = await render(`${prefix}/weekly/archive/003`);
    const body = await archive003.text();
    assert.equal(archive003.status, 200);
    assert.doesNotMatch(body.split('<section class="growth-footer"')[0], /weekly:official|deadlines\.ics/);
  }
});

test("publishes bilingual current calendars and issue-specific RSS permalinks", async () => {
  for (const prefix of ["", "/en"]) {
    const response = await render(`${prefix}/weekly/deadlines.ics`);
    const body = (await response.text()).replace(/\r\n /g, "");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/calendar/);
    assert.match(response.headers.get("content-disposition") ?? "", /003/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(body, /DTSTART:20261103T040000Z/);
    assert.match(body, /DTSTART;VALUE=DATE:20261118/);
    assert.match(body, /DTSTART;VALUE=DATE:20261014/);
    assert.match(body, /DTEND;VALUE=DATE:20261120/);
    assert.equal((body.match(/BEGIN:VEVENT/g) ?? []).length, 4);
    assert.doesNotMatch(body, /20260804|20260821|20260826|TechBBQ|Entrepreneur First/);
    const feedResponse = await render(`${prefix}/feed.xml`);
    const feed = await feedResponse.text();
    assert.equal(feedResponse.status, 200);
    assert.match(feedResponse.headers.get("content-type") ?? "", /application\/rss\+xml/);
    assert.match(feed, /pioneer-weekly-003/);
    assert.match(feed, /pioneer-weekly-002/);
    assert.match(feed, new RegExp(`${prefix}/weekly/archive/003`));
    assert.match(feed, /Sun, 04 Oct 2026 16:00:00 GMT/);
  }
});

test("keeps every public editorial section available in Chinese and English", async () => {
  const routePairs = [
    ["/weekly", "/en/weekly"],
    ["/waic-2026", "/en/waic-2026"],
    ["/knowledge", "/en/knowledge"],
    ["/knowledge/find-the-real-problem", "/en/knowledge/find-the-real-problem"],
    ["/knowledge/first-user-interview", "/en/knowledge/first-user-interview"],
    ["/knowledge/define-your-mvp", "/en/knowledge/define-your-mvp"],
    ["/knowledge/find-your-first-ten-users", "/en/knowledge/find-your-first-ten-users"],
    ["/knowledge/test-your-pricing", "/en/knowledge/test-your-pricing"],
    ["/knowledge/close-your-first-sales", "/en/knowledge/close-your-first-sales"],
    ["/knowledge/test-your-cofounder", "/en/knowledge/test-your-cofounder"],
    ["/knowledge/set-up-company-and-equity", "/en/knowledge/set-up-company-and-equity"],
    ["/knowledge/decide-whether-to-fundraise", "/en/knowledge/decide-whether-to-fundraise"],
    ["/knowledge/measure-retention-and-pmf", "/en/knowledge/measure-retention-and-pmf"],
    ["/knowledge/build-your-startup-metrics", "/en/knowledge/build-your-startup-metrics"],
    ["/knowledge/hire-your-first-employee", "/en/knowledge/hire-your-first-employee"],
    ["/knowledge/prepare-your-fundraising-process", "/en/knowledge/prepare-your-fundraising-process"],
  ];

  for (const [chinesePath, englishPath] of routePairs) {
    const chineseResponse = await render(chinesePath);
    const englishResponse = await render(englishPath);
    assert.equal(chineseResponse.status, 200, chinesePath);
    assert.equal(englishResponse.status, 200, englishPath);
    const chinese = await chineseResponse.text();
    const english = await englishResponse.text();
    assert.match(chinese, new RegExp(`href="${englishPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(english, new RegExp(`href="${chinesePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }

  const waic = await render("/en/waic-2026");
  const waicHtml = await waic.text();
  assert.match(waicHtml, /THREE AREAS · FOUR VENUES/);
  assert.match(waicHtml, /EXHIBITOR RADAR/);
  assert.match(waicHtml, /WAIC side-event calendar/);
  assert.ok((waicHtml.match(/Original information \/ registration/g) ?? []).length >= 37);
  const waicEnglishData = await readFile(new URL("../app/data/waicEnglish.ts", import.meta.url), "utf8");
  assert.equal((waicEnglishData.match(/^\s+e\(/gm) ?? []).length, 37);
});

test("provides English copy for every directory resource and English weekly syndication", async () => {
  const resourcesSource = await readFile(new URL("../app/data/resources.ts", import.meta.url), "utf8");
  const englishSource = await readFile(new URL("../app/data/english.ts", import.meta.url), "utf8");
  const resourceSlugs = [...resourcesSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const englishBody = englishSource.slice(englishSource.indexOf("export const englishResources"), englishSource.indexOf("export function getEnglishResource"));
  const englishSlugs = [...englishBody.matchAll(/^\s{2}(?:"([^"]+)"|([A-Za-z][\w-]*)):\s*\{/gm)].map((match) => match[1] || match[2]);
  assert.deepEqual(resourceSlugs.filter((slug) => !englishSlugs.includes(slug)), []);

  const feedResponse = await render("/en/feed.xml");
  const calendarResponse = await render("/en/weekly/deadlines.ics");
  assert.equal(feedResponse.status, 200);
  assert.equal(calendarResponse.status, 200);
  assert.match(await feedResponse.text(), /Pioneer Weekly Founder Opportunities/);
  assert.match(await calendarResponse.text(), /Y Combinator/);
});

test("accepts bilingual resource recommendations into the review workflow", async () => {
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const api = await readFile(new URL("../app/api/submissions/route.ts", import.meta.url), "utf8");
  assert.match(schema, /resourceSubmissions/);
  assert.match(api, /INSERT INTO resource_submissions/);
  assert.match(api, /processSubmission/);
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

  assert.equal(urls.length, 42);
  assert.equal(new Set(urls).size, 37);
  assert.match(data, /slug: "find-the-real-problem"/);
  assert.match(data, /slug: "first-user-interview"/);
  assert.match(data, /slug: "define-your-mvp"/);
  assert.match(data, /slug: "find-your-first-ten-users"/);
  assert.match(data, /test-your-pricing/);
  assert.match(data, /close-your-first-sales/);
  assert.match(data, /slug: "test-your-cofounder"/);
  assert.match(data, /set-up-company-and-equity/);
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
  const profileSlugs = [...profilesData.matchAll(/^  "([^"]+)":/gm)].map((match) => match[1]);
  const investmentProfileSlugs = [...investmentProfilesData.matchAll(/^  (?:"([^"]+)"|([a-z]+)): \{$/gm)].map((match) => match[1] ?? match[2]);
  const startupProfileSlugs = [...startupProfilesData.matchAll(/^  (?:"([^"]+)"|([a-z]+)): \{$/gm)]
    .map((match) => match[1] ?? match[2])
    .filter((slug) => slug !== "snapshot" && slug !== "business");

  assert.ok(resourceSlugs.length >= 53);
  assert.equal(profileSlugs.length, 50);
  assert.equal(investmentProfileSlugs.length, 26);
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
  assert.match(directory, /共 31 条 · 当前显示 1–9/);
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
  assert.match(explorer, /setQuery\(event\.target\.value\); resetPage\(\{ query/);
  assert.match(explorer, /setNeed\(item\.id\); resetPage\(\{ need/);

  const englishResponse = await render("/en/organizations");
  const english = await englishResponse.text();
  assert.equal(englishResponse.status, 200);
  assert.match(english, /31 entries · showing 1–9/);
  assert.match(english, /Directory pagination/);
});

test("renders a directory and an internal editorial detail before the official source", async () => {
  const directoryResponse = await render("/programs");
  const directory = await directoryResponse.text();
  assert.equal(directoryResponse.status, 200);
  assert.match(directory, /申请与参加条件/);
  assert.match(directory, /资源列表/);
  assert.match(directory, /Open Programs/);
  assert.match(directory, /找到真正适合你的创业计划/);
  assert.equal((directory.match(/class="program-card"/g) ?? []).length, 6);
  assert.match(directory, /aria-label="资金支持"/);
  assert.match(directory, /aria-label="参与方式"/);
  assert.match(directory, /\/programs\/founder-mountains.webp/);
  assert.match(directory, /PIONEER TAKE/);
  assert.match(directory, /加入资源清单/);
  const englishPrograms = await (await render("/en/programs")).text();
  assert.match(englishPrograms, /Find the right program for your next chapter/);
  assert.equal((englishPrograms.match(/class="program-card"/g) ?? []).length, 6);

  const detailResponse = await render("/resources/y-combinator");
  const detail = await detailResponse.text();
  assert.equal(detailResponse.status, 200);
  assert.match(detail, /编辑备注/);
  assert.match(detail, /基本信息/);
  assert.match(detail, /支持内容与限制/);
  assert.match(detail, /提供内容/);
  assert.match(detail, /申请方式/);
  assert.match(detail, /费用与投入/);
  assert.match(detail, /申请前确认事项/);
  assert.match(detail, /href="https:\/\/www\.ycombinator\.com\/apply\/"/);
});

test("renders an editorial institution portrait without changing the official source", async () => {
  const response = await render("/resources/station-f");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /基本信息/);
  assert.match(html, /旗下项目/);
  assert.match(html, /支持内容/);
  assert.match(html, /申请条件与流程/);
  assert.match(html, /费用、投资与股权/);
  assert.match(html, /数据与案例/);
  assert.match(html, /多项目创业园区/);
  assert.match(html, /项目名称/);
  assert.match(html, /适合阶段/);
  assert.match(html, /提供内容/);
  assert.match(html, /获得方式/);
  assert.match(html, /注意事项/);
  assert.match(html, /申请主体/);
  assert.match(html, /申请流程/);
  assert.match(html, /已知信息/);
  assert.match(html, /其他可选机构/);
  assert.match(html, /编辑总结/);
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
  assert.doesNotMatch(eventDirectory, /href="\/waic-2026"/);
  assert.match(eventDirectory, /历史归档/);

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
  assert.match(waic, /SOURCE &amp; ARCHIVE/);
  assert.match(waic, /前往官方页面/);
  assert.match(waic, /中国 · 上海 · 三地四馆/);
  assert.match(waic, /7 月 16 日/);
  assert.match(waic, /7 月 20 日/);
  assert.match(waic, /Demo Day @ Physical AI Camp/);
  assert.match(waic, /GO SUMMIT × WAIC 上海/);
  assert.match(waic, /第二届 AI 研究者派对之夏/);
  assert.match(waic, /Creator Night/);
  assert.match(waic, /归档状态核验：2026.07.30/);
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
  assert.match(researchedStartup, /项目简介/);
  assert.match(researchedStartup, /创始团队与发展历程/);
  assert.match(researchedStartup, /Dario Amodei/);
  assert.match(researchedStartup, /Daniela Amodei/);
  assert.match(researchedStartup, /融资与重要发展节点/);
  assert.match(researchedStartup, /相关报道与原始信息/);
  assert.match(researchedStartup, /从研究路线开始的 A 轮/);
  assert.match(researchedStartup, /用户与客户/);
  assert.match(researchedStartup, /产品与核心功能/);
  assert.match(researchedStartup, /商业模式/);
  assert.match(researchedStartup, /公司进展与相关报道/);
  assert.match(researchedStartup, /市场与竞争/);
  assert.match(researchedStartup, /风险与挑战/);
  assert.match(researchedStartup, /创业启示/);
  assert.match(researchedStartup, /总结与后续观察/);
  assert.match(researchedStartup, /href="#startup-verdict"/);
  assert.match(researchedStartup, /ONE-SENTENCE PRODUCT/);
  assert.match(researchedStartup, /使用前的问题/);
  assert.match(researchedStartup, /产品怎么介入/);
  assert.match(researchedStartup, /用户得到什么/);
  assert.match(researchedStartup, /产品形态/);
  assert.match(researchedStartup, /怎么赚钱/);
  assert.match(researchedStartup, /为什么有人愿意付钱/);

  const productShowcaseResponse = await render("/resources/xiaoyu-robotics");
  const productShowcase = await productShowcaseResponse.text();
  assert.equal(productShowcaseResponse.status, 200);
  assert.match(productShowcase, /小雨未来机器人/);
  assert.match(productShowcase, /PRODUCT AT A GLANCE/);
  assert.match(productShowcase, /产品形态/);
  assert.match(productShowcase, /具体做什么/);
  assert.match(productShowcase, /怎么赚钱/);
  assert.match(productShowcase, /创始团队公开资料正在补充/);
  assert.match(productShowcase, /资料不足时明确留白/);
  assert.match(productShowcase, /相关报道与原始信息/);
  assert.match(productShowcase, /\/startups\/xiaoyu-robotics\/product-hero\.webp/);
  assert.match(productShowcase, /\/startups\/xiaoyu-robotics\/operations-dashboard\.webp/);
  assert.match(productShowcase, /图片来源：(?:<!-- -->)?小雨智造官方产品手册/);

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
  assert.match(html, /创业指南/);
  assert.match(html, /与实践工作表/);
  assert.match(html, /首篇指南/);
  assert.match(html, /你的想法是真问题，还是一个你喜欢的解决方案/);
  assert.match(html, /你现在/);
  assert.match(html, /卡在哪里/);
  assert.match(html, /继续查阅原始资料/);
  assert.match(html, /篇已上线/);
  assert.match(html, /knowledge-layer-main-summary/);
  assert.match(html, /knowledge-layer-guide-grid/);
  assert.match(html, /找到最早失效的假设/);
  assert.match(html, /通过失败案例，提早识别创业风险/);
  assert.match(html, /登记案例通知/);
  assert.match(html, /可保存的实践工作表/);
  assert.match(html, /href="\/knowledge\/first-user-interview"/);
  assert.match(html, /href="\/knowledge\/define-your-mvp"/);
  assert.match(html, /href="\/knowledge\/find-your-first-ten-users"/);
  assert.match(html, /href="\/knowledge\/test-your-cofounder"/);
  assert.match(html, /href="\/knowledge\/decide-whether-to-fundraise"/);
  assert.match(html, /href="\/knowledge\/learn-from-startup-failures"/);
  assert.match(html, /你现在，最接近哪一种处境/);
  assert.match(html, /建立你的创业项目档案/);
  assert.match(html, /创业项目档案/);
  assert.match(html, /最近阶段判断/);
  assert.match(html, /团队与股权/);
  assert.match(html, /SAFE 融资文件与说明/);
  assert.match(html, /美国公司/);
});

test("renders the startup failure review guide in Chinese and English", async () => {
  const response = await render("/knowledge/learn-from-startup-failures");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /创业项目为什么会失败/);
  assert.match(html, /Quibi · 使用情境没有成立/);
  assert.match(html, /Cydoc · 技术价值没有自动成为可持续业务/);
  assert.match(html, /Net30 · 喜爱的产品仍可能死于销售周期/);
  assert.match(html, /读完后，立即为自己的项目做一次事前验尸/);

  const englishResponse = await render("/en/knowledge/learn-from-startup-failures");
  const english = await englishResponse.text();
  assert.equal(englishResponse.status, 200);
  assert.match(english, /Why do startups fail/);
  assert.match(english, /Three cases, three different early signals/);
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
  assert.match(html, /明确第一版的交付结果/);
  assert.match(html, /两周验证计划/);
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
  assert.match(html, /第一批用户的筛选条件/);
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
  assert.match(html, /股权、角色与长期投入/);
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


test("expired verification removes actionable claims and all calendar events", async () => {
  for (const prefix of ["", "/en"]) {
    const response = await render(`${prefix}/weekly`, "2026-10-12T00:00:00+08:00");
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /历史记录|Historical record/);
    assert.doesNotMatch(html, /weekly:official|weekly:calendar|worth acting on this week|本周值得行动的/);
    const calendarResponse = await render(`${prefix}/weekly/deadlines.ics`, "2026-10-12T00:00:00+08:00");
    assert.doesNotMatch(await calendarResponse.text(), /BEGIN:VEVENT/);
  }
});

test("expired old resources carry archival status in both languages", async () => {
  for (const prefix of ["", "/en"]) {
    for (const slug of ["entrepreneur-first-london", "berkeley-skydeck-batch-23", "techbbq-2026"]) {
      const response = await render(`${prefix}/resources/${slug}`);
      const html = await response.text();
      assert.equal(response.status, 200);
      assert.match(html, /历史归档|archived/);
      const status = slug === "techbbq-2026" ? html.match(/class="event-state"[^>]*>([^<]+)/)?.[1] : html.match(/class="resource-status"[^>]*><i[^>]*><\/i>([^<]+)/)?.[1];
      assert.match(status ?? "", /历史归档|archived/);
    }
  }
});

test("offers bilingual private workspace sign-in with top-level navigation", async () => {
  for (const prefix of ["", "/en"]) {
    const response = await render(`${prefix}/workspace`); assert.equal(response.status, 200);
    const html = await response.text(); assert.match(html, /login\?return_to=/); assert.match(html, /target="_top"/); assert.match(html, /noindex/);
    assert.doesNotMatch(html, /workspace-browser-test/);
  }
});

test("English guide worksheets expose real evidence and decision inputs", async () => {
  const response = await render('/en/knowledge/test-your-pricing'); assert.equal(response.status, 200);
  const html = await response.text(); assert.match(html, /Save evidence and decision/); assert.match(html, /Supporting evidence, including counter-evidence/); assert.match(html, /<textarea/); assert.match(html, /Open workspace/);
});

test('notification management and unsubscribe pages provide bilingual login, truthful delivery state and safe links', async () => {
  for (const [path, title, login] of [['/notifications', '你的通知偏好', '使用邮箱登录'], ['/en/notifications', 'Your notification preferences', 'Sign in with email']]) {
    const response = await render(path); assert.equal(response.status, 200); const html = await response.text();
    assert.ok(html.includes(title)); assert.ok(html.includes(login)); assert.ok(html.includes('target="_top"')); assert.match(html, /noindex/); assert.ok(html.includes(path.startsWith('/en') ? 'Email delivery is currently paused' : '邮件发送当前暂停'));
    assert.ok(html.includes(path.startsWith('/en') ? '/en/feed.xml' : '/feed.xml')); assert.ok(html.includes(path.startsWith('/en') ? '/en/weekly/deadlines.ics' : '/weekly/deadlines.ics'));
  }
  for (const path of ['/unsubscribe', '/en/unsubscribe']) {
    const response = await render(path); assert.equal(response.status, 200); const html = await response.text(); assert.match(html, /no-referrer/); assert.match(html, /noindex/); assert.ok(html.includes(path.startsWith('/en') ? 'Opening this page does not change your preferences' : '打开此页面不会修改偏好'));
  }
});

test('mail publishing stays private and its setup and queue semantics are truthful', async () => {
 const page = await readFile(new URL('../app/admin/mail/page.tsx',import.meta.url),'utf8');assert.match(page,/requireAppUser/);assert.match(page,/isSiteAdmin/);
 const response = await render('/admin/mail'); assert.ok([302,303,307].includes(response.status));assert.match(response.headers.get('location')??'',/login/);
 const dashboard = await readFile(new URL('../app/components/MailDashboard.tsx',import.meta.url),'utf8');assert.match(dashboard,/加入队列不代表已发出/);assert.match(dashboard,/服务商已接收，投递未确认/);assert.match(dashboard,/window.confirm/);
});

test("ended event briefs expose archive sources in both languages and leave default home discovery", async () => {
  for (const slug of ["ifa-berlin-2026", "bits-and-pretzels-2026", "sifted-summit-2026", "inbound-2026", "dreamforce-2026"]) {
    const zh = await (await render(`/resources/${slug}`)).text();
    const en = await (await render(`/en/resources/${slug}`)).text();
    assert.match(zh, /历史归档/);
    assert.match(zh, /本届活动或行动窗口已结束/);
    assert.match(zh, /查看历史官方来源/);
    assert.match(en, /Historical · archived/);
    assert.match(en, /This edition or action window has ended/);
    assert.match(en, /View historical official source/);
    assert.match(en, /Review the Past Window/);
    assert.doesNotMatch(en, /Before You Click Apply/);
  }
  for (const path of ["/", "/en"]) {
    const home = await (await render(path)).text();
    // The ecosystem map intentionally includes archives. Check the default
    // discovery list, rather than treating map archive links as current offers.
    const listStart = home.indexOf('id="resources"');
    assert.ok(listStart >= 0);
    const discovery = home.slice(listStart, home.indexOf('</section>', listStart));
    assert.doesNotMatch(discovery, /href="(?:\/en)?\/resources\/(?:bits-and-pretzels-2026|inbound-2026|dreamforce-2026)"/);
    assert.doesNotMatch(discovery, /href="(?:\/en)?\/waic-2026"/);
  }
  const upcoming = await (await render('/en/resources/switch-singapore-2026')).text();
  assert.match(upcoming, /Current window needs rechecking/);
  assert.doesNotMatch(upcoming, /This edition or action window has ended/);
});


test("renders bilingual email sign-in and optional ChatGPT access with safe return paths", async () => {
  for (const [path, label] of [["/login", "邮箱登录"], ["/en/login", "Sign in with email"]]) {
    const response = await render(`${path}?return_to=https://untrusted.example`);
    assert.equal(response.status, 200); const html = await response.text();
    assert.ok(html.includes(label)); assert.match(html, /type="email"/); assert.match(html, /type="password"/);
    assert.match(html, /signin-with-chatgpt\?return_to=%2F/); assert.doesNotMatch(html, /return_to=https/);
  }
});

test('event decision pages separate official facts, closed application paths and editorial recommendations bilingually', async () => {
  for (const [prefix,labels] of [['',['PIONEER VERDICT','适合谁','费用与投入','2026 申请已关闭','本届展位截止已过','官方资料与核验边界']],['/en',['PIONEER VERDICT','Who should consider it','Costs and trade-offs','2026 applications closed','Published exhibit cutoff passed','Sources and review boundaries']]]) {
    const html=await (await render(`${prefix}/resources/techcrunch-disrupt-2026`,'2026-10-06T04:00:00Z')).text();
    for(const label of labels) assert.ok(html.includes(label),label);
    assert.match(html,/event-role-list/); assert.match(html,/event-budget/);
    assert.match(html,new RegExp(`href="${prefix}/resources/techcrunch-disrupt-2026/calendar.ics"`));
    assert.doesNotMatch(html,/250\+|1,200\+|100\+.*countries|9\/10/);
    const response=await render(`${prefix}/resources/techcrunch-disrupt-2026/calendar.ics?alarm=7`,'2026-10-06T04:00:00Z');
    assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/text\/calendar/);assert.match(await response.text(),/TRIGGER:-P7D/);
    const ended=await (await render(`${prefix}/resources/techcrunch-disrupt-2026`,'2026-10-16T08:00:00Z')).text();
    assert.doesNotMatch(ended,new RegExp(`href="${prefix}/resources/techcrunch-disrupt-2026/calendar.ics"`));
    assert.equal((await render(`${prefix}/resources/techcrunch-disrupt-2026/calendar.ics`,'2026-10-16T08:00:00Z')).status,410);
  }
});


test("all institution routes use the shared bilingual design with official access and analysis controls", async () => {
  const data = await readFile(new URL("../app/data/resources.ts", import.meta.url), "utf8");
  const slugs = [...data.matchAll(/slug: "([^\"]+)"[\s\S]*?type: "([^\"]+)"/g)].filter(x => x[2] === "organization").map(x => x[1]);
  assert.equal(slugs.length, 31);
  for (const slug of slugs) for (const prefix of ["", "/en"]) {
    const response = await render(`${prefix}/resources/${slug}`);
    assert.equal(response.status, 200, `${prefix}/${slug}`);
    const html = await response.text();
    for (const section of ["overview", "highlights", "analysis", "location", "sources", "similar"]) assert.ok(html.includes(`id="institution-${section}"`), `${slug}: ${section}`);
    assert.match(html, /role="tablist"/);
    assert.match(html, /aria-controls="institution-analysis-panel"/);
    assert.match(html, /institution-primary/);
    assert.match(html, /aria-pressed="false"/);
    assert.doesNotMatch(html, /8\.7 \/ 10|Watch campus video|contact@stationf/);
    assert.equal(html.includes("institution-full-research"), prefix === "");
  }
});
