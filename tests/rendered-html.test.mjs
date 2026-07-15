import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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

test("server-renders the Pioneer resource directory", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Pioneer — 全球创业资源目录<\/title>/i);
  assert.match(html, /世界很大/);
  assert.match(html, /16 条创业资源已于 2026\.07\.15/);
  assert.match(html, /Y Combinator/);
  assert.match(html, /Berkeley SkyDeck Batch 23/);
  assert.match(html, /Launch by STATION F/);
  assert.match(html, /href="https:\/\/www\.ycombinator\.com\/apply\/"/);
  assert.doesNotMatch(html, /示例资源|数据接入后上线/);
});

test("keeps the first content collection complete and source-linked", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const urls = [...page.matchAll(/url: "(https:\/\/[^\"]+)"/g)].map((match) => match[1]);

  assert.equal(urls.length, 16);
  assert.equal(new Set(urls).size, 16);
  assert.match(page, /type: "program"/);
  assert.match(page, /type: "organization"/);
  assert.match(page, /type: "event"/);
  assert.match(page, /type: "startup"/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /2026\.07\.15 核验/);
});
