import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
const origin = process.env.PIONEER_PREVIEW_URL ?? 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname), 'Local preview only');
const a = `newsletter-${randomUUID()}`, b = `newsletter-${randomUUID()}`;
function call(user, method = 'GET', body, options = {}) { return fetch(`${origin}/api/newsletter${options.path ?? ''}`, { method, headers: { origin: options.origin ?? origin, 'content-type': 'application/json', 'user-agent': `Newsletter-preview-${a}`, ...(user ? { 'oai-authenticated-user-id': user, 'oai-authenticated-user-email': `${user}@example.org` } : {}) }, body: body ? JSON.stringify(body) : undefined }); }
test('actual D1 subscription API protects ownership, consent, updates, opt-outs and stale writes', async () => {
  assert.equal((await call(null)).status, 401); assert.equal((await call(null, 'PUT', { version: 0, language: 'en', weekly: true, cases: false })).status, 401);
  const registration = await call(null, 'POST', { email: `${a}@example.org`, language: 'zh' }); assert.equal(registration.status, 200); assert.equal((await registration.json()).deliveryEnabled, false);
  const interest = await (await call(a)).json(); assert.equal(interest.status, 'interest'); assert.equal(interest.weekly, false);
  const saved = await call(a, 'PUT', { version: interest.version, language: 'en', weekly: true, cases: true, email: `${b}@example.org`, userId: b }); assert.equal(saved.status, 200); const confirmed = await saved.json(); assert.equal(confirmed.email, `${a}@example.org`); assert.equal(confirmed.status, 'registered'); assert.equal(confirmed.deliveryEnabled, false);
  assert.equal((await (await call(b)).json()).status, 'none');
  assert.equal((await call(a, 'PUT', { version: interest.version, language: 'en', weekly: false, cases: true })).status, 409);
  const off = await call(a, 'DELETE', { version: confirmed.version }); assert.equal(off.status, 200); const stopped = await off.json(); assert.equal(stopped.status, 'unsubscribed');
  assert.equal((await call(null, 'POST', { email: `${a}@example.org`, language: 'zh' })).status, 200);
  assert.deepEqual(await (await call(a)).json(), stopped);
  assert.equal((await call(a, 'PUT', { version: confirmed.version, language: 'en', weekly: true, cases: true })).status, 409);
  assert.equal((await call(a, 'PUT', { version: stopped.version, language: 'wrong', weekly: true, cases: true })).status, 400);
  assert.equal((await call(a, 'DELETE', { version: stopped.version }, { origin: 'https://other.example' })).status, 403);
  assert.equal((await call(null, 'POST', { token: '0'.repeat(64) }, { path: '/unsubscribe' })).status, 400);
  assert.equal((await call(null, 'GET', undefined, { path: '/unsubscribe' })).status, 405);
});
test('bilingual management renders owned controls only for signed local test identities', async () => {
  for (const [path, title, topic] of [['/notifications', '你的通知偏好', '通知主题'], ['/en/notifications', 'Your notification preferences', 'Topics']]) {
    const anon = await fetch(`${origin}${path}`); const html = await anon.text(); assert.equal(anon.status, 200); assert.ok(html.includes(title)); assert.ok(html.includes('target="_top"')); assert.ok(!html.includes(`${a}@example.org`));
    const signed = await fetch(`${origin}${path}`, { headers: { 'oai-authenticated-user-id': a, 'oai-authenticated-user-email': `${a}@example.org` } }); assert.equal(signed.status, 200); assert.ok((await signed.text()).includes(topic));
  }
});
