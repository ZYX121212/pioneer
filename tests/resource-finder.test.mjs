import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const urls = new Map();
async function moduleUrl(path) {
  if (urls.has(path)) return urls.get(path);
  let js = ts.transpileModule(await readFile(new URL('../app/' + path + '.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const match of [...js.matchAll(/from "([^\"]+)"/g)]) {
    if (!match[1].startsWith('.')) continue;
    const resolved = new URL(match[1], 'https://local/' + path).pathname.slice(1);
    js = js.replace(JSON.stringify(match[1]), JSON.stringify(await moduleUrl(resolved)));
  }
  const url = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64'); urls.set(path, url); return url;
}
const finder = await import(await moduleUrl('lib/resourceFinder'));
const { resources } = await import(await moduleUrl('data/resources'));
const now = new Date('2026-10-06T04:00:00Z');
const filters = { ...finder.defaultFinderFilters };
test('need groups distinguish investors, support, courses and reference companies', () => {
  for (const [slug, need] of [['y-combinator','funding'], ['hongshan-capital','funding'], ['station-f','support'], ['slush-2026','events'], ['launch-by-station-f','learn'], ['pally','learn']]) {
    assert.equal(finder.resourceNeed(resources.find(r => r.slug === slug)), need);
  }
});
test('search combines every token and works across Chinese and English copies', () => {
  for (const lang of ['zh', 'en']) {
    const rows = finder.findResources(resources, { ...filters, query:'Y Combinator', need:'funding' }, lang, now);
    assert.ok(rows.some(r => r.slug === 'y-combinator'));
    assert.equal(finder.findResources(resources, { ...filters, query:'Y Combinator impossibleword' }, lang, now).length, 0);
  }
});
test('freshness and need are intersected; historical editions need explicit archive selection', () => {
  const live = finder.findResources(resources, { ...filters, need:'events' }, 'zh', now);
  assert.ok(live.length > 0);
  assert.ok(!live.some(r => r.slug === 'techbbq-2026'));
  const archive = finder.findResources(resources, { ...filters, need:'events', freshness:'historical' }, 'zh', now);
  assert.ok(archive.some(r => r.slug === 'techbbq-2026'));
  assert.equal(finder.findResources(resources, { ...filters, query:'TechBBQ' }, 'zh', now).length, 0);
});
test('region and stage never bypass query or need constraints; unrestricted stages remain included', () => {
  const yc = resources.find(r => r.slug === 'y-combinator');
  assert.equal(finder.findResources([yc], { ...filters, query:'Y Combinator', region:yc.location, stage:'idea' }, 'zh', now).length, 1);
  assert.equal(finder.findResources([yc], { ...filters, region:'nonexistent' }, 'zh', now).length, 0);
  assert.equal(finder.findResources([yc], { ...filters, need:'events' }, 'zh', now).length, 0);
});
test('country filters use documented locations and preserve old exact-location links', () => {
  const us = finder.findResources(resources, { ...filters, region:'us' }, 'en', now);
  assert.ok(us.some(r => r.slug === 'y-combinator'));
  assert.ok(!us.some(r => r.slug === 'station-f'));
  const sg = finder.findResources(resources, { ...filters, region:'singapore', need:'support' }, 'zh', now);
  assert.ok(sg.some(r => r.slug === 'block71'));
});
