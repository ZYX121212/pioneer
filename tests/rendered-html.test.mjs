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

  assert.match(schema, /siteVisitors/);
  assert.match(schema, /visitorId: text\("visitor_id"\)\.primaryKey/);
  assert.match(route, /ON CONFLICT\(visitor_id\) DO UPDATE/);
  assert.match(route, /SELECT COUNT\(\*\) AS count FROM site_visitors/);
  assert.match(counter, /pioneer:anonymous-visitor-id/);
  assert.match(counter, /window\.crypto\.randomUUID\(\)/);
  assert.match(page, /累计独立访客/);
});

test("keeps the resource collection complete and source-linked", async () => {
  const data = await readFile(new URL("../app/data/resources.ts", import.meta.url), "utf8");
  const urls = [...data.matchAll(/url: "(https:\/\/[^\"]+)"/g)].map((match) => match[1]);
  const slugs = [...data.matchAll(/slug: "([^\"]+)"/g)].map((match) => match[1]);

  assert.equal(urls.length, 16);
  assert.equal(new Set(urls).size, 16);
  assert.equal(slugs.length, 16);
  assert.equal(new Set(slugs).size, 16);
  assert.match(data, /type: "program"/);
  assert.match(data, /type: "organization"/);
  assert.match(data, /type: "event"/);
  assert.match(data, /type: "startup"/);
  assert.match(data, /editorialNote:/);
  assert.match(data, /bestFor:/);
  assert.match(data, /considerations:/);
  assert.match(data, /2026\.07\.16 核验/);
});

test("keeps the founder knowledge collection structured and source-linked", async () => {
  const data = await readFile(new URL("../app/data/knowledge.ts", import.meta.url), "utf8");
  const card = await readFile(new URL("../app/components/KnowledgeCard.tsx", import.meta.url), "utf8");
  const urls = [...data.matchAll(/url: "(https:\/\/[^\"]+)"/g)].map((match) => match[1]);

  assert.equal(urls.length, 15);
  assert.equal(new Set(urls).size, 14);
  assert.match(data, /slug: "find-the-real-problem"/);
  assert.match(data, /slug: "first-user-interview"/);
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
  const resourceSlugs = [...resourcesData.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
  const profileSlugs = [...profilesData.matchAll(/^  "([^"]+)": \{$/gm)].map((match) => match[1]);

  assert.equal(resourceSlugs.length, 16);
  assert.equal(profileSlugs.length, 16);
  assert.deepEqual(new Set(profileSlugs), new Set(resourceSlugs));
  assert.match(profilesData, /diligence: string\[\]/);
  assert.match(profilesData, /playbook: Array/);
  assert.match(profilesData, /comparison:/);
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
  assert.match(data, /export const organizationComparison/);
});

test("renders type-specific research depth for events and startup projects", async () => {
  const eventResponse = await render("/resources/slush-2026");
  const event = await eventResponse.text();
  assert.equal(eventResponse.status, 200);
  assert.match(event, /Startup Ticket/);
  assert.match(event, /Slush Platform/);
  assert.match(event, /基金长名单/);

  const startupResponse = await render("/resources/cerenovus");
  const startup = await startupResponse.text();
  assert.equal(startupResponse.status, 200);
  assert.match(startup, /公司知识图谱/);
  assert.match(startup, /组织系统图/);
  assert.match(startup, /管理问题试点/);
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
  assert.match(html, /4 种创业类型/);
  assert.match(html, /2 张可填写工作表/);
  assert.match(html, /href="\/knowledge\/first-user-interview"/);
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
  assert.match(html, /五次访谈不是市场验证/);
  assert.match(html, /href="https:\/\/www\.momtestbook\.com\/"/);
});
