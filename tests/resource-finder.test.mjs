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
const { communityToResource } = await import(await moduleUrl('lib/communityResource'));
test('published community learning entries remain discoverable under learning, not institutional support', () => {
  const row = { id:991, slug:'community-founder-library', resource_type:'knowledge', name:'Founder library', location:'Singapore', stage:'idea', contributor_reason:'Customer research workbook', source_title:'Official founder library', deadline:null, verified_at:'2026-10-05T04:00:00Z', url:'https://example.org/library' };
  for (const lang of ['zh','en']) {
    const entry = communityToResource(row, lang);
    assert.equal(finder.resourceNeed(entry), 'learn');
    const matches = finder.findResources([entry], { ...filters, need:'learn', region:'singapore', query:'research', stage:'idea' }, lang, now);
    assert.deepEqual(matches.map(r => r.slug), [row.slug]);
    assert.equal(finder.findResources([entry], { ...filters, need:'support' }, lang, now).length, 0);
    assert.equal(entry.detailPath, '/community/' + row.slug);
    assert.equal(entry.verification, 'link-only');
  }
});
test('community learning entries still obey historical deadlines rather than appearing as current learning offers', () => {
  const entry = communityToResource({ id:992, slug:'ended-course', resource_type:'knowledge', name:'Ended course', location:'Singapore', stage:'any', contributor_reason:'An ended learning opportunity', source_title:'Official course', deadline:'2026-08-01', verified_at:'2026-10-05T04:00:00Z', url:'https://example.org/course' });
  assert.equal(finder.findResources([entry], { ...filters, need:'learn' }, 'zh', now).length, 0);
  assert.equal(finder.findResources([entry], { ...filters, need:'learn', freshness:'historical' }, 'zh', now).length, 1);
});

const home = await import(await moduleUrl('lib/homeDiscovery'));
test('homepage map filters documented regions without assigning global or unknown locations', () => {
  const sample = (location) => ({ slug:'unknown', location });
  assert.equal(home.matchesHomeRegion(sample('全球 · 在线'), 'asia'), false);
  assert.equal(home.matchesHomeRegion(sample('未提供'), 'europe'), false);
  assert.equal(home.matchesHomeRegion(sample('United States · Boston'), 'north-america'), true);
  assert.equal(home.matchesHomeRegion(sample('墨西哥 · Mexico City'), 'latin-america'), true);
  assert.equal(home.matchesHomeRegion(sample('法国 · Paris'), 'europe'), true);
  assert.equal(home.matchesHomeRegion(sample('澳大利亚 · Sydney'), 'oceania'), true);
  assert.equal(home.matchesHomeRegion(sample('新加坡 · Singapore'), 'asia'), true);
  assert.equal(home.matchesHomeRegion(sample('未提供'), 'all'), true);
  assert.equal(home.matchesHomeRegion(sample('France'), 'invalid'), false);
});

const card = await import(await moduleUrl('lib/resourceCardSummary'));
test('card decision facts use verified deadlines and documented campus fields in both languages', () => {
  const yc = resources.find(row => row.slug === 'y-combinator');
  const station = resources.find(row => row.slug === 'station-f');
  for (const lang of ['zh','en']) {
    const facts = card.resourceCardSummary(yc, lang, now);
    assert.equal(facts.length, 2);
    assert.match(facts[0].value, /2026\.11\.02/);
    assert.doesNotMatch(facts[0].value, /2027\.11\.02/);
    assert.ok(facts[1].value.length > 5);
    const campus = card.resourceCardSummary(station, lang, now);
    assert.match(campus[0].value, /30\+/);
    assert.match(campus[1].value, /项目|Programs/);
    assert.doesNotMatch(campus[1].value, /Web3/);
  }
});
test('event summaries retain actual dates and use documented audience when no scale is supplied', () => {
  const slush = resources.find(row => row.slug === 'slush-2026');
  for (const lang of ['zh','en']) {
    const facts = card.resourceCardSummary(slush, lang, now);
    assert.match(facts[0].value, /^2026\.11\.18[–-]11\.19$/);
    assert.doesNotMatch(facts[1].value, /15,?000/);
    assert.match(facts[1].label, /核心人群|Audience/);
  }
  const ended = resources.find(row => row.slug === 'bits-and-pretzels-2026');
  assert.equal(card.resourceCardSummary(ended, 'zh', now)[0].label, '历史会期');
  assert.equal(card.resourceCardSummary(ended, 'zh', now)[1].label, '人数上限');
});
test('investor amounts keep historical qualifications and missing project needs are not invented', () => {
  const greylock = resources.find(row => row.slug === 'greylock');
  const lightspeed = resources.find(row => row.slug === 'lightspeed-venture-partners');
  const pally = resources.find(row => row.slug === 'pally');
  assert.match(card.resourceCardSummary(greylock, 'zh', now)[1].value, /历史/);
  assert.equal(card.resourceCardSummary(lightspeed, 'en', now)[1].value, 'No published standard');
  assert.equal(card.resourceCardSummary(pally, 'zh', now)[1].value, '未公开需求');
  assert.equal(card.resourceCardSummary(pally, 'en', now)[0].value, 'Seed / early');
  const course = resources.find(row => row.slug === 'launch-by-station-f');
  assert.deepEqual(card.resourceCardSummary(course, 'en', now).map(row => row.value), ['Fully online', 'Free option']);
});

const globe = await import(await moduleUrl('lib/globeDiscovery'));
test('globe country and city filters use location, both languages and parent country', () => {
 const sample = location => ({slug:'unknown',location});
 for(const location of ['中国 · 上海', 'China · Shanghai']) assert.equal(globe.matchesGlobePlace(sample(location),'city:CHN:Shanghai'),true);
 assert.equal(globe.matchesGlobePlace(sample('中国 · 北京'),'city:CHN:Shanghai'),false);
 assert.equal(globe.matchesGlobePlace(sample('United States · San Francisco'),'country:USA'),true);
 assert.equal(globe.matchesGlobePlace(sample('Indonesia · Jakarta'),'country:IND'),false);
 assert.equal(globe.matchesGlobePlace(sample('Singapore'),'country:SGP'),true);
 assert.equal(globe.matchesGlobePlace(sample('日本 · Tokyo'),'city:JPN:Tokyo'),true);
 assert.equal(globe.matchesGlobePlace(sample('全球 · Online'),'country:CHN'),false);
 assert.equal(globe.matchesGlobePlace(sample('United States · Shanghai'),'city:CHN:Shanghai'),false);
 assert.ok(resources.filter(r=>home.matchesHomeRegion(r,'city:CHN:Shanghai')).some(r=>r.slug==='agibot'));
 assert.ok(resources.filter(r=>home.matchesHomeRegion(r,'city:CHN:Beijing')).some(r=>r.slug==='moonshot-ai'));
});

test('China navigation includes Taiwan, Hong Kong and Macao and preserves city discovery', () => {
 const sample = location => ({slug:'unknown',location});
 for(const location of ['台湾 · 台北','Taiwan · Taipei','香港','Hong Kong','澳门','Macau','臺灣 · 臺北']) {
  assert.equal(home.matchesHomeRegion(sample(location),'country:CHN'),true,location);
  assert.equal(home.matchesHomeRegion(sample(location),'asia'),true,location);
 }
 assert.equal(home.matchesHomeRegion(sample('Taiwan · Taipei'),'region:CHN:710000'),true);
 assert.equal(home.matchesHomeRegion(sample('臺灣 · 臺北'),'city:CHN:Taipei'),true);
 assert.equal(home.matchesHomeRegion(sample('Macau'),'city:CHN:Macao'),true);
 assert.equal(home.matchesHomeRegion(sample('日本 · Tokyo'),'region:CHN:710000'),false);
 assert.equal(globe.globeCountries.some(p=>p.id==='country:TWN'),false);
 assert.equal(globe.chinaRegions.length,34);
 for(const code of [710000,810000,820000]) assert.ok(globe.chinaRegions.some(p=>p.id===`region:CHN:${code}`));
});

const eventCal = await import(await moduleUrl('lib/eventCalendar'));
test('event calendar uses inclusive venue dates, exclusive end and explicit opt-in alarms', () => {
  const tc = resources.find(r=>r.slug==='techcrunch-disrupt-2026');
  const normal=eventCal.eventCalendar(tc,'en',undefined,now);
  assert.match(normal,/DTSTART;VALUE=DATE:20261013/);
  assert.match(normal,/DTEND;VALUE=DATE:20261016/);
  assert.doesNotMatch(normal,/BEGIN:VALARM/);
  assert.match(eventCal.eventCalendar(tc,'zh',7,now),/TRIGGER:-P7D/);
  for(const line of eventCal.eventCalendar(tc,'zh',1,now).split('\r\n')) assert.ok(Buffer.byteLength(line)<=75);
  assert.ok(eventCal.eventCalendar(tc,'en',undefined,new Date('2026-10-16T06:59:00Z')));
  assert.equal(eventCal.eventCalendar(tc,'en',undefined,new Date('2026-10-16T07:00:00Z')),undefined);
});
test('calendar refuses historical, stale, non-event and malformed dates and rejects invalid reminder input', () => {
  const tc=resources.find(r=>r.slug==='techcrunch-disrupt-2026');
  for(const changed of [{...tc,status:'历史归档'}, {...tc,verified:'2026.07.01 核验'}, {...tc,type:'program'}, {...tc,eventWindow:{...tc.eventWindow,lastDay:'2026-02-30'}}]) assert.equal(eventCal.eventCalendar(changed,'zh',undefined,now),undefined);
  assert.equal(eventCal.eventCalendarDates({...tc,eventWindow:{...tc.eventWindow,lastDay:'2026-02-30'}}),undefined);
  assert.equal(eventCal.eventCalendarResponse(new Request('https://pioneer.test/calendar.ics?alarm=bad'),tc,'en').status,400);
  assert.equal(eventCal.eventCalendarResponse(new Request('https://pioneer.test/calendar.ics'),undefined,'en').status,404);
});
