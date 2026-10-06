import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const urls = new Map();
async function moduleUrl(path) {
  if (urls.has(path)) return urls.get(path);
  if (path.endsWith('.json')) return 'data:text/javascript;base64,' + Buffer.from('export default ' + await readFile(new URL('../app/' + path, import.meta.url), 'utf8')).toString('base64');
  let js = ts.transpileModule(await readFile(new URL('../app/' + path + '.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const match of [...js.matchAll(/from "([^\"]+)"/g)]) {
    if (!match[1].startsWith('.')) continue;
    const resolved = new URL(match[1], 'https://local/' + path).pathname.slice(1);
    js = js.replace(JSON.stringify(match[1]), JSON.stringify(await moduleUrl(resolved)));
  }
  const url = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64'); urls.set(path, url); return url;
}
const programs = await import(await moduleUrl('lib/programDiscovery'));
const { resources } = await import(await moduleUrl('data/resources'));
const yc = resources.find(r => r.slug === 'y-combinator');
const now = new Date('2026-10-06T04:00:00Z');
test('current application windows are separated from stale, archived and informational programs', () => {
  assert.equal(programs.programStatus(yc, now), 'open');
  assert.equal(programs.programStatus({...yc, verified:'2026.07.16 核验'}, now), 'review');
  assert.equal(programs.programStatus({...yc, status:'历史归档'}, now), 'archived');
  assert.equal(programs.programStatus({...yc, status:'持续开放申请'}, now), 'rolling');
  assert.equal(programs.programStatus({...yc, status:'计划信息', highlights:[]}, now), 'info');
  assert.equal(programs.programStatus({...yc, verification:'link-only'}, now), 'review');
});
test('PT deadlines respect DST and the exact closing time; date-only and ambiguous times are rechecked', () => {
  const sample = {...yc, url:'https://example.com/test-program', verified:'2026.11.02 核验'};
  assert.equal(programs.programStatus(sample, new Date('2026-11-03T03:59:00Z')), 'closing');
  assert.equal(programs.programStatus(sample, new Date('2026-11-03T04:00:00Z')), 'archived');
  const summer = {...sample, verified:'2026.10.15 核验', highlights:[{label:'申请截止',value:'2026.10.20 20:00 PT'}]};
  assert.equal(programs.programStatus(summer, new Date('2026-10-21T02:59:00Z')), 'closing');
  assert.equal(programs.programStatus(summer, new Date('2026-10-21T03:00:00Z')), 'archived');
  const noTime = {...sample, highlights:[{label:'申请截止',value:'2026.11.02'}]};
  assert.equal(programs.programStatus(noTime, new Date('2026-11-02T04:00:00Z')), 'review');
  assert.equal(programs.programStatus({...noTime,highlights:[{label:'申请截止',value:'2026.11.02 20:00 CST'}]}, new Date('2026-11-02T04:00:00Z')), 'review');
});
test('support and participation filters use documented facts, not global or funding language alone', () => {
  assert.equal(programs.programFunding({...yc,highlights:[]}), 'unspecified');
  assert.equal(programs.programFunding({...yc,highlights:[{label:'资金支持',value:'$100,000'}]}), 'cash');
  assert.equal(programs.programFunding({...yc,kind:'云资源计划'}), 'credits');
  assert.equal(programs.programFormat(yc), 'onsite');
  assert.equal(programs.programFormat({...yc,description:'全球计划',highlights:[]}), 'unspecified');
  assert.equal(programs.programFormat({...yc,description:'线上与线下混合参与'}), 'hybrid');
});
