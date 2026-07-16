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
  assert.match(data, /2026\.07\.15 核验/);
});

test("keeps the founder knowledge collection structured and source-linked", async () => {
  const data = await readFile(new URL("../app/data/knowledge.ts", import.meta.url), "utf8");
  const card = await readFile(new URL("../app/components/KnowledgeCard.tsx", import.meta.url), "utf8");
  const urls = [...data.matchAll(/url: "(https:\/\/[^\"]+)"/g)].map((match) => match[1]);

  assert.equal(urls.length, 12);
  assert.equal(new Set(urls).size, 12);
  assert.match(data, /slug: "find-the-real-problem"/);
  assert.match(data, /第一篇：发现真问题/);
  assert.match(data, /stage: "start"/);
  assert.match(data, /stage: "validate"/);
  assert.match(data, /stage: "team"/);
  assert.match(data, /stage: "company"/);
  assert.match(data, /stage: "funding"/);
  assert.match(card, /target="_blank"/);
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
  assert.match(detail, /这个计划如何产生价值/);
  assert.match(detail, /这项计划适合谁/);
  assert.match(detail, /从判断到申请的路径/);
  assert.match(detail, /收益之外，还要计算成本/);
  assert.match(detail, /申请前行动清单/);
  assert.match(detail, /href="https:\/\/www\.ycombinator\.com\/apply\/"/);
});

test("renders an editorial institution portrait without changing the official source", async () => {
  const response = await render("/resources/station-f");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /机构画像与资源能力/);
  assert.match(html, /创业计划组合/);
  assert.match(html, /投资与资本连接/);
  assert.match(html, /国际市场落地/);
  assert.match(html, /Pioneer 基于公开信息做出的定性画像/);
  assert.match(html, /href="https:\/\/stationf\.co\/"/);
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
  assert.match(html, /参考来源与 Pioneer 的使用方式/);
});
