import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
const source = ts.transpileModule(await readFile(new URL('../app/lib/newsletterService.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const service = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
async function database() {
 const sqlite = new DatabaseSync(':memory:');
 for (const name of (await readdir(new URL('../drizzle/', import.meta.url))).filter(n => n.endsWith('.sql')).sort()) sqlite.exec(await readFile(new URL(`../drizzle/${name}`, import.meta.url), 'utf8'));
 const wrap = (sql, args = []) => ({ bind(...values) { return wrap(sql, values); }, async first() { return sqlite.prepare(sql).get(...args) ?? null; }, async run() { const r = sqlite.prepare(sql).run(...args); return { success: true, results: [], meta: { changes: Number(r.changes) } }; } });
 return { db: { prepare: wrap }, sqlite };
}
const alice = { id: 'alice', email: 'alice@example.org' }, bob = { id: 'bob', email: 'bob@example.org' };
const preferences = { language: 'en', weekly: true, cases: false };
test('legacy interest registration needs explicit account consent before email eligibility', async () => {
 const { db, sqlite } = await database();
 await service.registerNewsletterInterest(db, alice.email, 'zh', '/', 'request-a');
 const interest = await service.loadNewsletter(db, alice); assert.equal(interest.status, 'interest'); assert.equal(interest.weekly, false); assert.equal(interest.version, 1);
 assert.equal(sqlite.prepare('SELECT verified_at FROM newsletter_subscribers').get().verified_at, null);
 const confirmed = await service.saveNewsletter(db, alice, interest.version, preferences); assert.equal(confirmed.status, 'registered'); assert.equal(confirmed.weekly, true);
 assert.equal(sqlite.prepare('SELECT user_id FROM newsletter_subscribers').get().user_id, alice.id);
 assert.equal((await service.loadNewsletter(db, bob)).status, 'none'); sqlite.close();
});
test('repeat anonymous registration cannot overwrite choices, language, ownership or opt-outs', async () => {
 const { db, sqlite } = await database(); const saved = await service.saveNewsletter(db, alice, 0, preferences);
 const off = await service.unsubscribeNewsletter(db, alice, saved.version); assert.equal(off.status, 'unsubscribed');
 await service.registerNewsletterInterest(db, alice.email, 'zh', '/knowledge', 'other');
 assert.deepEqual(await service.loadNewsletter(db, alice), off);
 assert.equal(await service.saveNewsletter(db, { id: 'intruder', email: alice.email }, 0, preferences), null);
 sqlite.close();
});
test('concurrent creation, stale updates, and stale reactivation after unsubscribe are refused', async () => {
 const { db, sqlite } = await database(); const saved = await service.saveNewsletter(db, alice, 0, preferences);
 assert.equal(await service.saveNewsletter(db, alice, 0, preferences), null);
 const off = await service.unsubscribeNewsletter(db, alice, saved.version);
 assert.equal(await service.saveNewsletter(db, alice, saved.version, preferences), null);
 const enabled = await service.saveNewsletter(db, alice, off.version, { ...preferences, cases: true }); assert.equal(enabled.cases, true);
 sqlite.close();
});
test('opting out before any registration creates a durable opt-out that later anonymous requests preserve', async () => {
 const { db, sqlite } = await database(); const off = await service.unsubscribeNewsletter(db, alice, 0); assert.equal(off.status, 'unsubscribed');
 await service.registerNewsletterInterest(db, alice.email, 'en', '/', 'another'); assert.deepEqual(await service.loadNewsletter(db, alice), off); sqlite.close();
});
test('bounded registration quota, email and preference validation reject malformed intake', async () => {
 const { db, sqlite } = await database();
 for (let i = 0; i < 5; i++) assert.equal(await service.registerNewsletterInterest(db, `a${i}@example.org`, 'en', '/', 'same'), 'saved');
 assert.equal(await service.registerNewsletterInterest(db, 'sixth@example.org', 'en', '/', 'same'), 'limited');
 assert.equal(await service.registerNewsletterInterest(db, 'a0@example.org', 'zh', '/', 'same'), 'saved');
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM newsletter_subscribers').get().n, 5);
 assert.equal(service.validEmail('wrong'), false); assert.equal(service.validEmail('a'.repeat(255) + '@example.org'), false);
 assert.throws(() => service.validatePreferences({ language: 'bad', weekly: true, cases: false })); assert.throws(() => service.validatePreferences({ language: 'en', weekly: 1, cases: false })); sqlite.close();
});
test('private hashed unsubscribe capability changes only its recipient, rejects guessing and blocks stale saves', async () => {
 const { db, sqlite } = await database(); const a = await service.saveNewsletter(db, alice, 0, preferences); const b = await service.saveNewsletter(db, bob, 0, { ...preferences, cases: true });
 const id = sqlite.prepare('SELECT id FROM newsletter_subscribers WHERE user_id = ?').get(alice.id).id;
 const token = await service.issueUnsubscribeToken(db, id); assert.match(token, /^[a-f0-9]{64}$/); assert.notEqual(sqlite.prepare('SELECT token_hash FROM newsletter_unsubscribe_tokens').get().token_hash, token);
 assert.equal(await service.unsubscribeByToken(db, '0'.repeat(64)), false); assert.equal(await service.unsubscribeByToken(db, token), true);
 assert.equal((await service.loadNewsletter(db, alice)).status, 'unsubscribed'); assert.deepEqual(await service.loadNewsletter(db, bob), b);
 assert.equal(await service.saveNewsletter(db, alice, a.version, preferences), null); assert.equal(await service.unsubscribeByToken(db, token), true);
 await assert.rejects(service.issueUnsubscribeToken(db, id)); sqlite.close();
});

test('admin newsletter aggregates separate confirmed consent, anonymous interest and opted-out users', async () => {
 const { db, sqlite } = await database();
 await service.registerNewsletterInterest(db, 'interest@example.org', 'zh', '/', 'interest-source');
 await service.saveNewsletter(db, alice, 0, preferences);
 const saved = await service.saveNewsletter(db, bob, 0, preferences); await service.unsubscribeNewsletter(db, bob, saved.version);
 const source = await readFile(new URL('../app/api/audience/route.ts', import.meta.url), 'utf8');
 const queries = [...source.matchAll(/\.prepare\("(SELECT COUNT\(\*\) AS count FROM newsletter_subscribers[^"\n]+)"\)/g)].map(match => match[1]);
 assert.equal(queries.length, 3); assert.deepEqual(queries.map(query => sqlite.prepare(query).get().count), [1, 1, 1]); sqlite.close();
});
