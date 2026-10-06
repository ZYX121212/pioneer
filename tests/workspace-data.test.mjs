import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const modelUrl = `data:text/javascript;base64,${Buffer.from(await compile('../app/lib/workspaceModel.ts')).toString('base64')}`;
const model = await import(modelUrl);
const service = await import(`data:text/javascript;base64,${Buffer.from((await compile('../app/lib/workspaceService.ts')).replace('"./workspaceModel"', JSON.stringify(modelUrl))).toString('base64')}`);
async function database() {
  const sqlite = new DatabaseSync(':memory:');
  for (const name of (await readdir(new URL('../drizzle/', import.meta.url))).filter(name => name.endsWith('.sql')).sort()) sqlite.exec(await readFile(new URL(`../drizzle/${name}`, import.meta.url), 'utf8'));
  const wrap = (sql, args = []) => ({ bind(...values) { return wrap(sql, values); }, async first() { return sqlite.prepare(sql).get(...args) ?? null; } });
  return { sqlite, db: { prepare: wrap } };
}
const project = { name: 'Founder test', oneLine: 'Test a useful customer problem', targetUser: 'Recent buyers', currentRisk: 'Payment', nextAction: 'Interview three buyers', updatedAt: '2026-10-05T12:00:00Z', stage: 'validation', goals: ['customers'] };
test('workspace retains project, evidence, decisions, actions and shortlist across separate reads', async () => {
  const { db, sqlite } = await database();
  const state = model.emptyWorkspace(); state.project = project; state.archive = [{ id: 'evidence-1', guide: 'first-user-interview', title: 'Buyer interview', type: 'Interview', summary: 'Buyer uses spreadsheets', content: 'An actual observed alternative', savedAt: project.updatedAt }]; state.decisions = [{ guide: 'first-user-interview', decision: 'narrow', reason: 'Only recent buyers face this need', savedAt: project.updatedAt }]; state.completions = ['first-user-interview']; state.shortlist = ['y-combinator']; state.tasks = [{ id: 'action-1', text: 'Interview 3 buyers', due: '2026-10-10', done: false, createdAt: project.updatedAt }];
  assert.equal((await service.loadWorkspace(db, 'alice')).version, 0);
  const saved = await service.writeWorkspace(db, 'alice', 0, state); assert.equal(saved.version, 1);
  assert.deepEqual((await service.loadWorkspace(db, 'alice')).state, state);
  assert.deepEqual((await service.loadWorkspace(db, 'bob')).state, model.emptyWorkspace());
  sqlite.close();
});
test('concurrent creates and stale device writes cannot overwrite another update', async () => {
  const { db, sqlite } = await database(); const a = model.emptyWorkspace(); a.project = project; const b = model.emptyWorkspace(); b.project = { ...project, name: 'Other draft' };
  assert.ok(await service.writeWorkspace(db, 'alice', 0, a)); assert.equal(await service.writeWorkspace(db, 'alice', 0, b), null);
  assert.ok(await service.writeWorkspace(db, 'alice', 1, b)); assert.equal(await service.writeWorkspace(db, 'alice', 1, a), null);
  assert.equal((await service.loadWorkspace(db, 'alice')).state.project.name, 'Other draft'); sqlite.close();
});
test('clearing personal state persists and a stale tab cannot resurrect cleared content', async () => {
  const { db, sqlite } = await database(); const state = model.emptyWorkspace(); state.project = project;
  await service.writeWorkspace(db, 'alice', 0, state); const cleared = await service.clearWorkspace(db, 'alice', 1); assert.equal(cleared.version, 2); assert.deepEqual(cleared.state, model.emptyWorkspace());
  assert.equal(await service.writeWorkspace(db, 'alice', 1, state), null); assert.equal(await service.writeWorkspace(db, 'alice', 0, state), null);
  assert.deepEqual((await service.loadWorkspace(db, 'alice')).state, model.emptyWorkspace()); sqlite.close();
});
test('workspace validates bounds, dates, distinct identifiers and required decision evidence', () => {
  assert.throws(() => model.validateWorkspace({ project: { ...project, stage: 'pretend' } }));
  assert.throws(() => model.validateWorkspace({ tasks: [{ id: 'a', text: 'test', done: false, due: '2026-02-30', createdAt: project.updatedAt }] }));
  assert.throws(() => model.validateWorkspace({ shortlist: ['y-combinator', 'y-combinator'] }));
  assert.throws(() => model.validateWorkspace({ decisions: [{ guide: 'first-user-interview', decision: 'continue', reason: '', savedAt: project.updatedAt }] }));
  assert.throws(() => model.validateWorkspace({ archive: Array.from({ length: 41 }, (_, i) => ({ id: `e-${i}`, guide: 'first-user-interview', title: 'x', type: 'y', summary: '', content: '', savedAt: project.updatedAt })) }));
  assert.throws(() => model.validateWorkspace({ archive: Array.from({ length: 10 }, (_, i) => ({ id: `e-${i}`, guide: 'first-user-interview', title: 'x', type: 'y', summary: '', content: 'z'.repeat(20_000), savedAt: project.updatedAt })) }));
});

async function clientModule() {
  const source = (await compile('../app/lib/founderArchive.ts')).replace('"./workspaceModel"', JSON.stringify(modelUrl));
  return import(`data:text/javascript;base64,${Buffer.from(`${source}\n// ${Math.random()}`).toString('base64')}`);
}
test('client reports save failure and version conflict without losing the last confirmed state', async () => {
  const originalFetch = globalThis.fetch; const client = await clientModule();
  let mode = 'ok', savedState = model.emptyWorkspace(), savedVersion = 0;
  globalThis.fetch = async (_url, options = {}) => {
    if (!options.method) return Response.json({ state: savedState, version: savedVersion, updatedAt: null });
    if (mode === 'offline') throw new Error('offline');
    if (mode === 'conflict') return Response.json({ code: 'version_conflict', error: 'Conflict' }, { status: 409 });
    const request = JSON.parse(options.body); savedState = request.state; savedVersion++;
    return Response.json({ state: savedState, version: savedVersion, updatedAt: null });
  };
  try {
    await client.initializeWorkspace(); await client.saveProject(project);
    assert.equal(client.readProject().name, project.name);
    mode = 'offline'; await assert.rejects(client.saveProject({ ...project, name: 'Unsaved draft' })); assert.equal(client.readProject().name, project.name);
    mode = 'conflict'; await assert.rejects(client.toggleResource('y-combinator'), error => error.code === 'version_conflict'); assert.deepEqual(client.workspaceSnapshot().state.shortlist, []);
    mode = 'ok'; await client.toggleResource('y-combinator'); assert.deepEqual(client.workspaceSnapshot().state.shortlist, ['y-combinator']);
  } finally { globalThis.fetch = originalFetch; }
});
test('clearing refuses a changed confirmation version and preserves saved content on failed deletion', async () => {
  const originalFetch = globalThis.fetch; const client = await clientModule();
  let savedState = model.emptyWorkspace(), savedVersion = 0, deleteCalls = 0, failDelete = false;
  savedState.project = project;
  globalThis.fetch = async (_url, options = {}) => {
    if (!options.method) return Response.json({ state: savedState, version: savedVersion, updatedAt: null });
    if (options.method === 'DELETE') {
      deleteCalls++;
      assert.equal(JSON.parse(options.body).version, savedVersion);
      if (failDelete) return Response.json({ error: 'Unavailable' }, { status: 503 });
      savedState = model.emptyWorkspace(); savedVersion++;
    } else { savedState = JSON.parse(options.body).state; savedVersion++; }
    return Response.json({ state: savedState, version: savedVersion, updatedAt: null });
  };
  try {
    await client.initializeWorkspace();
    const reviewedVersion = client.workspaceSnapshot().version;
    const queuedSave = client.saveProject({ ...project, name: 'Changed after review' });
    const staleClear = client.clearWorkspaceData(reviewedVersion);
    await queuedSave;
    await assert.rejects(staleClear, error => error.code === 'version_conflict');
    assert.equal(deleteCalls, 0); assert.equal(client.readProject().name, 'Changed after review');
    failDelete = true;
    await assert.rejects(client.clearWorkspaceData(client.workspaceSnapshot().version));
    assert.equal(client.readProject().name, 'Changed after review'); assert.equal(client.workspaceSnapshot().version, 1);
    failDelete = false;
    await client.clearWorkspaceData(client.workspaceSnapshot().version);
    assert.deepEqual(client.workspaceSnapshot().state, model.emptyWorkspace()); assert.equal(client.workspaceSnapshot().version, 2);
  } finally { globalThis.fetch = originalFetch; }
});
test('legacy evidence is never uploaded automatically and explicit migration preserves both archives', async () => {
  const originalFetch = globalThis.fetch, originalWindow = globalThis.window; const client = await clientModule();
  const legacyEntry = { id: 'legacy-1', guide: 'first-user-interview', title: 'Local evidence', type: 'Interview', summary: 'Observed', content: 'Legacy record', savedAt: project.updatedAt };
  const local = new Map([[client.PROJECT_KEY, JSON.stringify({ ...project, name: 'Legacy project' })], [client.ARCHIVE_KEY, JSON.stringify([legacyEntry])]]); let writes = 0;
  const cloud = model.emptyWorkspace(); cloud.project = project;
  globalThis.window = { dispatchEvent() {}, localStorage: { getItem(key) { return local.get(key) ?? null; }, setItem() { throw new Error('Cloud state must not write local storage'); } } };
  globalThis.fetch = async (_url, options = {}) => { if (!options.method) return Response.json({ state: cloud, version: 1, updatedAt: null }); writes++; return Response.json({ state: JSON.parse(options.body).state, version: 2, updatedAt: null }); };
  try {
    await client.initializeWorkspace(); assert.equal(writes, 0); assert.equal(client.readProject().name, project.name); assert.deepEqual(client.readArchive(), []);
    await client.importLegacyWorkspace(); assert.equal(writes, 1); assert.equal(client.readProject().name, project.name); assert.equal(client.readArchive()[0].content, 'Legacy record'); assert.ok(local.has(client.ARCHIVE_KEY));
    await client.importLegacyWorkspace(true); assert.equal(client.readProject().name, 'Legacy project'); assert.equal(client.readArchive().length, 1);
  } finally { globalThis.fetch = originalFetch; globalThis.window = originalWindow; }
});

const weeklyUrl = `data:text/javascript;base64,${Buffer.from(await compile('../app/data/weekly.ts')).toString('base64')}`;
const freshness = await import(`data:text/javascript;base64,${Buffer.from((await compile('../app/lib/resourceFreshness.ts')).replace('"../data/weekly"', JSON.stringify(weeklyUrl))).toString('base64')}`);
test('resource freshness separates historical windows, old reviews and the bounded current weekly check', () => {
  const resource = { status: 'Applications open', verified: '2026.10.05 核验', url: 'https://www.ycombinator.com/apply/' };
  assert.equal(freshness.resourceFreshness(resource, new Date('2026-10-05T04:00Z')), 'reviewed');
  assert.equal(freshness.resourceFreshness(resource, new Date('2026-10-12T00:00:00+08:00')), 'needs-review');
  assert.equal(freshness.resourceFreshness(resource, new Date('2026-11-03T04:00Z')), 'historical');
  assert.equal(freshness.resourceFreshness({ ...resource, status: '历史归档' }, new Date('2026-10-05')), 'historical');
  assert.equal(freshness.resourceFreshness({ status: 'Open', verified: '2026.07.16', url: 'https://example.org/' }, new Date('2026-10-05')), 'needs-review');
  assert.equal(freshness.resourceStage({}), 'any');
});

const freshnessUrl = `data:text/javascript;base64,${Buffer.from((await compile('../app/lib/resourceFreshness.ts')).replace('"../data/weekly"', JSON.stringify(weeklyUrl))).toString('base64')}`;
const communityFreshness = await import(`data:text/javascript;base64,${Buffer.from((await compile('../app/lib/communityFreshness.ts')).replace('"./resourceFreshness"', JSON.stringify(freshnessUrl))).toString('base64')}`);
test('community freshness shares historical, thirty-day and weekly cutoffs across all views', () => {
  const row = { status: 'published', deadline: null, verified_at: '2026-10-05T04:00:00Z', url: 'https://example.org/' };
  const date = new Date('2026-10-06T04:00:00Z');
  assert.equal(communityFreshness.communityFreshness(row, date), 'reviewed');
  assert.equal(communityFreshness.communityFreshness({ ...row, verified_at: '2026-07-30T04:00:00Z' }, date), 'needs-review');
  assert.equal(communityFreshness.communityFreshness({ ...row, deadline: '2026-08-04' }, date), 'historical');
  assert.equal(communityFreshness.communityFreshness({ ...row, status: 'archived' }, date), 'historical');
  assert.equal(communityFreshness.communityFreshness({ ...row, url: 'https://www.ycombinator.com/apply/' }, new Date('2026-10-12T00:00:00+08:00')), 'needs-review');
  assert.equal(communityFreshness.communityStatus({ ...row, verified_at: 'invalid' }, 'en', date), 'Current window needs rechecking');
  assert.equal(freshness.resourceFreshness({ status: 'Open', verified: '2026-02-30', url: row.url }, date), 'needs-review');
});

const eventCatalogUrl = `data:text/javascript;base64,${Buffer.from(await compile('../app/data/resources.ts')).toString('base64')}`;
const { resources: eventCatalog } = await import(eventCatalogUrl);
test('every dated event has a venue window; past editions archive without renewing old verification', () => {
  const events = eventCatalog.filter(row => row.type === 'event');
  assert.equal(events.length, 15);
  for (const row of events) {
    assert.ok(row.eventWindow, row.slug);
    assert.equal(freshness.resourceFreshness(row, new Date('2027-01-11T12:00:00Z')), 'historical', row.slug);
  }
  const now = new Date('2026-10-05T12:00:00Z');
  for (const slug of ['ifa-berlin-2026', 'bits-and-pretzels-2026', 'sifted-summit-2026', 'inbound-2026', 'dreamforce-2026']) {
    assert.equal(freshness.resourceFreshness(eventCatalog.find(row => row.slug === slug), now), 'historical', slug);
  }
  assert.equal(freshness.resourceFreshness(eventCatalog.find(row => row.slug === 'switch-singapore-2026'), now), 'needs-review');
  for (const mode of ['featured', 'event', 'program', 'organization', 'startup', 'knowledge']) {
    const selected = freshness.resourcePreview(eventCatalog, mode, now);
    assert.ok(selected.length <= 6);
    assert.ok(selected.every(row => mode === "featured" || mode === "knowledge" ? row.featured : row.type === mode));
    assert.ok(selected.every(row => freshness.resourceFreshness(row, now) !== 'historical'));
  }
});
test('event end days expire at venue midnight, including DST, and never invent a precise closing hour', () => {
  const row = { status: 'Open', verified: '2026.10.05', url: 'https://example.org/', eventWindow: { lastDay: '2026-10-25', timeZone: 'Europe/London' } };
  assert.equal(freshness.resourceFreshness(row, new Date('2026-10-25T23:59:59Z')), 'reviewed');
  assert.equal(freshness.resourceFreshness(row, new Date('2026-10-26T00:00:00Z')), 'historical');
  const sf = { ...row, eventWindow: { lastDay: '2026-10-15', timeZone: 'America/Los_Angeles' } };
  assert.equal(freshness.resourceFreshness(sf, new Date('2026-10-16T06:59:59Z')), 'reviewed');
  assert.equal(freshness.resourceFreshness(sf, new Date('2026-10-16T07:00:00Z')), 'historical');
  for (const window of [{ lastDay: '2026-02-30', timeZone: 'Europe/London' }, { lastDay: '2026-10-25', timeZone: 'Invalid/Zone' }, { lastDay: '2026-10-25' }]) {
    assert.equal(freshness.resourceFreshness({ ...row, eventWindow: window }), 'needs-review');
  }
});

test('backup merge refuses a workspace changed after preview before sending a write', async () => {
  const originalFetch = globalThis.fetch, client = await clientModule();
  let savedState = model.emptyWorkspace(), savedVersion = 0, writes = 0;
  globalThis.fetch = async (_url, options = {}) => {
    if (!options.method) return Response.json({state:savedState,version:savedVersion,updatedAt:null});
    writes++;savedState=JSON.parse(options.body).state;savedVersion++;
    return Response.json({state:savedState,version:savedVersion,updatedAt:null});
  };
  try {
    await client.initializeWorkspace(); const previewVersion=client.workspaceSnapshot().version;
    const first=client.saveProject({...project,name:'Saved after preview'});
    const stale=client.updateWorkspace(state=>{state.shortlist.push('y-combinator');},previewVersion);
    await first;await assert.rejects(stale,error=>error.code==='version_conflict');
    assert.equal(writes,1);assert.equal(client.readProject().name,'Saved after preview');assert.deepEqual(client.workspaceSnapshot().state.shortlist,[]);
  } finally {globalThis.fetch=originalFetch;}
});
