import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
const origin = process.env.PIONEER_PREVIEW_URL ?? 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname), 'Local preview only');
const userA = `workspace-test-${randomUUID()}`, userB = `workspace-test-${randomUUID()}`;
function call(user, method = 'GET', body) { return fetch(`${origin}/api/workspace`, { method, headers: { 'content-type': 'application/json', origin, ...(user ? { 'oai-authenticated-user-id': user, 'oai-authenticated-user-email': `${user}@example.org` } : {}) }, body: body ? JSON.stringify(body) : undefined }); }
const state = { project: { name: 'Preview account A', oneLine: '', targetUser: '', currentRisk: 'Observe buying behavior', nextAction: 'Interview buyers', stage: 'idea', goals: ['customers'], updatedAt: new Date().toISOString() }, archive: [], decisions: [], completions: [], shortlist: ['y-combinator'], tasks: [] };
test('actual local D1 API enforces login, account isolation, persistence, conflict and clearing', async () => {
  assert.equal((await call(null)).status, 401); assert.equal((await call(null, 'PUT', { version: 0, state })).status, 401);
  assert.equal((await call(userA)).status, 200);
  const saved = await call(userA, 'PUT', { userId: userB, version: 0, state }); assert.equal(saved.status, 200); assert.equal((await saved.json()).version, 1);
  const reread = await (await call(userA)).json(); assert.equal(reread.state.project.name, state.project.name);
  const separate = await (await call(userB)).json(); assert.equal(separate.state.project, null); assert.deepEqual(separate.state.shortlist, []);
  assert.equal((await call(userA, 'PUT', { version: 0, state })).status, 409);
  assert.equal((await call(userA, 'PUT', { version: 1, state: { ...state, project: { ...state.project, stage: 'invalid' } } })).status, 400);
  const clear = await call(userA, 'DELETE', { version: 1 }); assert.equal(clear.status, 200); assert.equal((await clear.json()).state.project, null);
  assert.equal((await call(userA, 'PUT', { version: 1, state })).status, 409);
  assert.equal((await (await call(userA)).json()).state.project, null);
});
test('workspace browser flows render bilingual controls only for authenticated local identities', async () => {
  for (const [path, title, button] of [['/workspace', '你的创业工作台', '使用 ChatGPT 登录'], ['/en/workspace', 'Your founder workspace', 'Sign in with ChatGPT']]) {
    const anon = await fetch(`${origin}${path}`); const html = await anon.text(); assert.equal(anon.status, 200); assert.ok(html.includes(title)); assert.ok(html.includes(button)); assert.ok(html.includes('target="_top"')); assert.ok(!html.includes('Preview account A'));
    const signed = await fetch(`${origin}${path}`, { headers: { 'oai-authenticated-user-id': userB, 'oai-authenticated-user-email': `${userB}@example.org` } }); const signedHtml = await signed.text(); assert.equal(signed.status, 200); assert.ok(signedHtml.includes(path.startsWith('/en') ? 'Resource shortlist and comparison' : '资源清单与对比'));
  }
});
