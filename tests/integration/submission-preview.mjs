import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
const origin = process.env.PIONEER_PREVIEW_URL ?? 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname), 'Run this write test only against a local preview');
const agent = `Pioneer-local-test-${randomUUID()}`;
const payload = { resourceType: 'program', resourceName: 'Source pending ownership check', resourceUrl: 'https://pioneer-integration-check.org/opportunity', whyUseful: 'Founders can use this opportunity for mentorship and early customer validation.', submitterName: 'Local test', submitterEmail: 'preview@example.org', relationship: 'community', language: 'en', idempotencyKey: randomUUID().replaceAll('-', '') };
const post = body => fetch(`${origin}/api/submissions`, { method: 'POST', headers: { 'content-type': 'application/json', origin, 'user-agent': agent }, body: JSON.stringify(body) });
test('real preview D1 submission persists, retries once and exposes only a private receipt', async () => {
  const response = await post(payload); assert.equal(response.status, 201);
  const first = await response.json(); assert.equal(first.status, 'pending'); assert.equal(first.reason, 'unknown_official_source'); assert.match(first.reviewToken, /^[a-f0-9]{32}$/);
  assert.equal(first.submitterEmail, undefined);
  const retry = await post(payload); assert.equal(retry.status, 200); assert.equal((await retry.json()).reviewToken, first.reviewToken);
  const receipt = await fetch(`${origin}/api/submissions?token=${first.reviewToken}`); assert.equal(receipt.status, 200); assert.equal((await receipt.json()).status, 'pending');
  const page = await fetch(`${origin}/en/submissions/${first.reviewToken}`); assert.equal(page.status, 200); assert.match(await page.text(), /Awaiting editor review/);
  const directory = await fetch(`${origin}/api/community`); assert.equal(directory.status, 200); assert.ok(!(await directory.json()).resources.some(row => row.name === payload.resourceName));
});
test('real preview rejects unsafe URLs, cross-origin writes and anonymous admin requests', async () => {
  assert.equal((await post({ ...payload, resourceUrl: 'https://127.0.0.1/' })).status, 400);
  const cross = await fetch(`${origin}/api/submissions`, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://external.example.org' }, body: JSON.stringify(payload) }); assert.equal(cross.status, 403);
  assert.equal((await fetch(`${origin}/api/admin/reviews`)).status, 403);
  assert.equal((await fetch(`${origin}/api/audience?full=1`)).status, 403);
  assert.equal((await fetch(`${origin}/api/submissions?token=guess`)).status, 400);
});
